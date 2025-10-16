import { describe, test, expect } from 'vitest'
import {
	isNegativeNumber,
	isInteger,
	isSafeInteger,
	isNonNegativeNumber,
	isPositiveNumber,
	isFiniteNumber,
	isRange,
} from '../src/numbers.js'

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

	describe('isInteger', () => {
		test('returns true for integers', () => {
			expect(isInteger(3)).toBe(true)
			expect(isInteger(0)).toBe(true)
			expect(isInteger(-5)).toBe(true)
		})

		test('returns false for non-integers', () => {
			expect(isInteger(3.1)).toBe(false)
			expect(isInteger(3.9)).toBe(false)
		})
	})

	describe('isSafeInteger', () => {
		test('returns true for safe integers', () => {
			expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
			expect(isSafeInteger(Number.MIN_SAFE_INTEGER)).toBe(true)
			expect(isSafeInteger(0)).toBe(true)
		})

		test('returns false for unsafe integers', () => {
			expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false)
		})
	})

	describe('isNonNegativeNumber', () => {
		test('returns true for non-negative numbers', () => {
			expect(isNonNegativeNumber(0)).toBe(true)
			expect(isNonNegativeNumber(1)).toBe(true)
			expect(isNonNegativeNumber(100)).toBe(true)
		})

		test('returns false for negative numbers', () => {
			expect(isNonNegativeNumber(-1)).toBe(false)
		})
	})

	describe('isPositiveNumber', () => {
		test('returns true for positive numbers', () => {
			expect(isPositiveNumber(1)).toBe(true)
			expect(isPositiveNumber(0.1)).toBe(true)
		})

		test('returns false for zero and negative numbers', () => {
			expect(isPositiveNumber(0)).toBe(false)
			expect(isPositiveNumber(-1)).toBe(false)
		})
	})

	describe('isFiniteNumber', () => {
		test('returns true for finite numbers', () => {
			expect(isFiniteNumber(0)).toBe(true)
			expect(isFiniteNumber(1)).toBe(true)
			expect(isFiniteNumber(-1)).toBe(true)
			expect(isFiniteNumber(3.14)).toBe(true)
		})

		test('returns false for NaN and Infinity', () => {
			expect(isFiniteNumber(NaN)).toBe(false)
			expect(isFiniteNumber(Infinity)).toBe(false)
			expect(isFiniteNumber(-Infinity)).toBe(false)
		})
	})

	describe('isRange (value-first number range validator)', () => {
		test('returns true within inclusive range', () => {
			expect(isRange(2, 1, 3)).toBe(true)
			expect(isRange(1, 1, 3)).toBe(true)
			expect(isRange(3, 1, 3)).toBe(true)
		})
		test('returns false outside range or for non-numbers', () => {
			expect(isRange(0, 1, 3)).toBe(false)
			expect(isRange(4, 1, 3)).toBe(false)
			expect(isRange('x' as unknown, 1, 3)).toBe(false)
		})
	})
})
