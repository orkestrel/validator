import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isIterable, iterableOf } from '../src/iterables.js'
import { isNumber } from '../src/primitives.js'

test('isIterable', () => {
  assert.equal(isIterable([1, 2, 3]), true)
  assert.equal(isIterable('abc'), true)
  assert.equal(isIterable(123), false)
})

test('iterableOf consumes and validates', () => {
  function* gen() { yield 1; yield 2 }
  assert.equal(iterableOf(isNumber)(gen()), true)
  assert.equal(iterableOf(isNumber)([1, 'x'] as unknown[]), false)
})
