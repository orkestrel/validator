import { test, expect } from 'vitest'
import { isArray, arrayOf, nonEmptyArrayOf, tupleOf, recordOf } from '../src/arrays.js'
import { isString, isNumber } from '../src/primitives.js'

test('isArray', () => {
	expect(isArray([])).toBe(true)
	expect(isArray('x')).toBe(false)
})

test('arrayOf', () => {
	const isStringArray = arrayOf(isString)
	expect(isStringArray(['a', 'b'])).toBe(true)
	expect(isStringArray(['a', 1] as unknown[])).toBe(false)
})

test('nonEmptyArrayOf', () => {
	const isNonEmptyNumArray = nonEmptyArrayOf(isNumber)
	expect(isNonEmptyNumArray([1])).toBe(true)
	expect(isNonEmptyNumArray([])).toBe(false)
})

test('tupleOf', () => {
	const isPoint = tupleOf(isNumber, isNumber)
	expect(isPoint([1, 2])).toBe(true)
	expect(isPoint([1, '2'] as unknown[])).toBe(false)
})

test('recordOf', () => {
	const isRecOfNum = recordOf(isNumber)
	expect(isRecOfNum({ a: 1 })).toBe(true)
	expect(isRecOfNum({ a: 'x' } as unknown)).toBe(false)
})
