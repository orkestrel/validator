import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isArray, arrayOf, nonEmptyArrayOf, tupleOf, recordOf } from '../src/arrays.js'
import { isString, isNumber } from '../src/primitives.js'

test('isArray', () => {
  assert.equal(isArray([]), true)
  assert.equal(isArray('x'), false)
})

test('arrayOf', () => {
  const isStringArray = arrayOf(isString)
  assert.equal(isStringArray(['a', 'b']), true)
  assert.equal(isStringArray(['a', 1] as unknown[]), false)
})

test('nonEmptyArrayOf', () => {
  const isNonEmptyNumArray = nonEmptyArrayOf(isNumber)
  assert.equal(isNonEmptyNumArray([1]), true)
  assert.equal(isNonEmptyNumArray([]), false)
})

test('tupleOf', () => {
  const isPoint = tupleOf(isNumber, isNumber)
  assert.equal(isPoint([1, 2]), true)
  assert.equal(isPoint([1, '2'] as unknown[]), false)
})

test('recordOf', () => {
  const isRecOfNum = recordOf(isNumber)
  assert.equal(isRecOfNum({ a: 1 }), true)
  assert.equal(isRecOfNum({ a: 'x' } as unknown), false)
})
