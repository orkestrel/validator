import { test, expect } from 'vitest'
import { isIterable, iterableOf } from '../src/iterables.js'
import { isNumber } from '../src/primitives.js'

test('isIterable', () => {
	expect(isIterable([1, 2, 3])).toBe(true)
	expect(isIterable('abc')).toBe(true)
	expect(isIterable(123)).toBe(false)
})

test('iterableOf consumes and validates', () => {
	function* gen() {
		yield 1
		yield 2
	}
	expect(iterableOf(isNumber)(gen())).toBe(true)
	expect(iterableOf(isNumber)([1, 'x'] as unknown[])).toBe(false)
})
