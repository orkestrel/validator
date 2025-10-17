import { describe, test, expect } from 'vitest'
import { lengthOf, sizeOf, countOf, minOf, maxOf, rangeOf, multipleOf, measureOf } from '../../src/combinators/measurements.js'

describe('combinators/measurements', () => {
	describe('lengthOf', () => {
		test('validates exact string length', () => {
			const g = lengthOf(3)
			expect(g('abc')).toBe(true)
			expect(g('ab')).toBe(false)
		})

		test('validates exact array length', () => {
			const g = lengthOf(2)
			expect(g([1, 2])).toBe(true)
			expect(g([1])).toBe(false)
		})

		test('validates function arity', () => {
			const g = lengthOf(1)
			expect(g((a: number) => a)).toBe(true)
			expect(g(() => 1)).toBe(false)
		})
	})

	describe('sizeOf', () => {
		test('validates exact Map size', () => {
			const g = sizeOf(2)
			const m = new Map([[1, 'a'], [2, 'b']])
			expect(g(m)).toBe(true)
			expect(g(new Map())).toBe(false)
		})

		test('validates exact Set size', () => {
			const g = sizeOf(1)
			expect(g(new Set([1]))).toBe(true)
			expect(g(new Set())).toBe(false)
		})
	})

	describe('countOf', () => {
		test('validates exact property count', () => {
			const g = countOf(2)
			expect(g({ a: 1, b: 2 })).toBe(true)
			expect(g({ a: 1 })).toBe(false)
		})
	})

	describe('minOf', () => {
		test('validates minimum number value', () => {
			const g = minOf(5)
			expect(g(10)).toBe(true)
			expect(g(5)).toBe(true)
			expect(g(3)).toBe(false)
		})

		test('validates minimum string length', () => {
			const g = minOf(3)
			expect(g('abc')).toBe(true)
			expect(g('ab')).toBe(false)
		})
	})

	describe('maxOf', () => {
		test('validates maximum number value', () => {
			const g = maxOf(10)
			expect(g(5)).toBe(true)
			expect(g(10)).toBe(true)
			expect(g(15)).toBe(false)
		})

		test('validates maximum string length', () => {
			const g = maxOf(5)
			expect(g('abc')).toBe(true)
			expect(g('abcdef')).toBe(false)
		})
	})

	describe('rangeOf', () => {
		test('validates number range', () => {
			const g = rangeOf(1, 10)
			expect(g(5)).toBe(true)
			expect(g(1)).toBe(true)
			expect(g(10)).toBe(true)
			expect(g(0)).toBe(false)
			expect(g(11)).toBe(false)
		})

		test('validates string length range', () => {
			const g = rangeOf(2, 4)
			expect(g('ab')).toBe(true)
			expect(g('abc')).toBe(true)
			expect(g('abcd')).toBe(true)
			expect(g('a')).toBe(false)
			expect(g('abcde')).toBe(false)
		})
	})

	describe('multipleOf', () => {
		test('validates multiples', () => {
			const g = multipleOf(3)
			expect(g(9)).toBe(true)
			expect(g(12)).toBe(true)
			expect(g(10)).toBe(false)
		})

		test('rejects invalid inputs', () => {
			const g = multipleOf(3)
			expect(g('9' as unknown)).toBe(false)
		})
	})

	describe('measureOf', () => {
		test('matches number exactly', () => {
			const g = measureOf(5)
			expect(g(5)).toBe(true)
			expect(g(6)).toBe(false)
		})

		test('matches string length', () => {
			const g = measureOf(3)
			expect(g('abc')).toBe(true)
			expect(g('ab')).toBe(false)
		})

		test('matches Set size', () => {
			const g = measureOf(2)
			expect(g(new Set([1, 2]))).toBe(true)
			expect(g(new Set([1]))).toBe(false)
		})
	})
})
