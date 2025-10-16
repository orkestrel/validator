import { describe, test, expect } from 'vitest'
import { isNegativeNumber, intInRange, isMultipleOf } from '../src/numbers.js'

describe('numbers', () => {
	describe('isNegativeNumber', () => {
		test('returns true for negative numbers', () => {
			expect(isNegativeNumber(-1)).toBe(true)
			expect(isNegativeNumber(-0.5)).toBe(true)
		})

		test('returns false for zero and positive numbers', () => {
			expect(isNegativeNumber(0)).toBe(false)
			expect(isNegativeNumber(1)).toBe(false)
		})
	})

	describe('intInRange', () => {
		test('returns true for integers in range', () => {
			const g = intInRange(1, 3)
			expect(g(2)).toBe(true)
			expect(g(1)).toBe(true)
			expect(g(3)).toBe(true)
		})

		test('returns false for non-integers', () => {
			const g = intInRange(1, 3)
			expect(g(2.5)).toBe(false)
		})

		test('returns false for out-of-range integers', () => {
			const g = intInRange(1, 3)
			expect(g(4)).toBe(false)
			expect(g(0)).toBe(false)
		})
	})

	describe('isMultipleOf', () => {
		test('returns true for multiples', () => {
			expect(isMultipleOf(3)(9)).toBe(true)
			expect(isMultipleOf(3)(0)).toBe(true)
			expect(isMultipleOf(5)(25)).toBe(true)
		})

		test('returns false for non-multiples', () => {
			expect(isMultipleOf(3)(10)).toBe(false)
			expect(isMultipleOf(5)(26)).toBe(false)
		})
	})
})
