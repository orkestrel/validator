import { describe, test, expect } from 'vitest'
import { isIterable, iterableOf } from '../src/iterables.js'
import { isNumber } from '../src/primitives.js'

describe('iterables', () => {
	describe('isIterable', () => {
		test('returns true for arrays', () => {
			expect(isIterable([1, 2, 3])).toBe(true)
		})

		test('returns true for strings', () => {
			expect(isIterable('abc')).toBe(true)
		})

		test('returns true for Sets', () => {
			expect(isIterable(new Set([1, 2]))).toBe(true)
		})

		test('returns false for non-iterables', () => {
			expect(isIterable(123)).toBe(false)
			expect(isIterable({})).toBe(false)
		})
	})

	describe('iterableOf', () => {
		test('validates iterable elements', () => {
			function* gen() {
				yield 1
				yield 2
			}
			expect(iterableOf(isNumber)(gen())).toBe(true)
		})

		test('returns false when element fails guard', () => {
			expect(iterableOf(isNumber)([1, 'x'] as unknown[])).toBe(false)
		})

		test('returns true for empty iterables', () => {
			expect(iterableOf(isNumber)([])).toBe(true)
		})
	})
})
