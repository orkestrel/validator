import { describe, test, expect } from 'vitest'
import { lengthOf, sizeOf, countOf, minOf, maxOf, rangeOf, multipleOf, measureOf } from '../../src/combinators/measurements.js'
import { isString } from '../../src/primitives.js'
import { arrayOf, objectOf } from '../../src/combinators.js'

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

	describe('composed forms with auto-detection', () => {
		test('minOf with base guard auto-detects measure', () => {
			// String length auto-detected
			const MinLength2 = minOf(isString, 2)
			expect(MinLength2('ab')).toBe(true)
			expect(MinLength2('abc')).toBe(true)
			expect(MinLength2('a')).toBe(false)

			// Array length auto-detected
			const MinArrayLen1 = minOf(arrayOf(isString), 1)
			expect(MinArrayLen1(['a'])).toBe(true)
			expect(MinArrayLen1([])).toBe(false)
		})

		test('maxOf with base guard auto-detects measure', () => {
			// String length auto-detected
			const MaxLength5 = maxOf(isString, 5)
			expect(MaxLength5('abc')).toBe(true)
			expect(MaxLength5('abcde')).toBe(true)
			expect(MaxLength5('abcdef')).toBe(false)
		})

		test('rangeOf with base guard auto-detects measure', () => {
			// String length auto-detected
			const Range2to4 = rangeOf(isString, 2, 4)
			expect(Range2to4('ab')).toBe(true)
			expect(Range2to4('abc')).toBe(true)
			expect(Range2to4('abcd')).toBe(true)
			expect(Range2to4('a')).toBe(false)
			expect(Range2to4('abcde')).toBe(false)

			// Object property count auto-detected
			const ObjRange1to2 = rangeOf(objectOf({ id: isString }), 1, 2)
			expect(ObjRange1to2({ id: 'x' })).toBe(true)
			expect(ObjRange1to2({ id: 'x', name: 'y' } as unknown)).toBe(false) // 2 props, exact only
		})

		test('measureOf with base guard auto-detects measure', () => {
			// String length auto-detected
			const Exactly3 = measureOf(isString, 3)
			expect(Exactly3('abc')).toBe(true)
			expect(Exactly3('ab')).toBe(false)
			expect(Exactly3('abcd')).toBe(false)
		})
	})
})
