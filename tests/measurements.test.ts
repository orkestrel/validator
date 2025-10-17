import { describe, test, expect } from 'vitest'
import {
	isLength,
	isLengthRange,
	isLengthMin,
	isLengthMax,
	isCount,
	isSize,
	isCountRange,
	isCountMin,
	isCountMax,
	isSizeMin,
	isSizeMax,
	isSizeRange,
} from '../src/measurements.js'

describe('measurements', () => {
	describe('isLength (exact length for strings/arrays)', () => {
		test('matches exact string length', () => {
			expect(isLength('ab', 2)).toBe(true)
			expect(isLength('ab', 3)).toBe(false)
		})
		test('matches exact array length', () => {
			expect(isLength([], 0)).toBe(true)
			expect(isLength(['a', 'b'], 2)).toBe(true)
			expect(isLength(['a', 'b'], 1)).toBe(false)
		})
	})

	describe('isLengthRange (value-first length range validator)', () => {
		test('string length within inclusive range', () => {
			expect(isLengthRange('ab', 2, 3)).toBe(true)
			expect(isLengthRange('abc', 2, 3)).toBe(true)
			expect(isLengthRange('a', 2, 3)).toBe(false)
		})
		test('array length within inclusive range', () => {
			expect(isLengthRange([1, 2], 2, 3)).toBe(true)
			expect(isLengthRange([1, 2, 3], 2, 3)).toBe(true)
			expect(isLengthRange([1], 2, 3)).toBe(false)
		})
	})

	describe('isLengthMin/Max (inclusive bounds)', () => {
		test('string length min/max', () => {
			expect(isLengthMin('ab', 2)).toBe(true)
			expect(isLengthMin('a', 2)).toBe(false)
			expect(isLengthMax('ab', 2)).toBe(true)
			expect(isLengthMax('abc', 2)).toBe(false)
		})
		test('array length min/max', () => {
			expect(isLengthMin([1, 2], 2)).toBe(true)
			expect(isLengthMin([1], 2)).toBe(false)
			expect(isLengthMax([1], 1)).toBe(true)
			expect(isLengthMax([1, 2], 1)).toBe(false)
		})
	})

	describe('isCountRange (value-first object property count validator)', () => {
		test('counts enumerable string and symbol keys within range', () => {
			const sym = Symbol('s')
			const obj: Record<string | symbol, unknown> = { a: 1 }
			Object.defineProperty(obj, sym, { value: 1, enumerable: true })
			expect(isCountRange(obj, 2, 3)).toBe(true)
			expect(isCountRange(obj, 3, 3)).toBe(false)
		})
		test('rejects non-objects and arrays', () => {
			expect(isCountRange([] as unknown, 1, 1)).toBe(false)
			expect(isCountRange(123 as unknown, 1, 1)).toBe(false)
		})
	})

	describe('isCount (exact count for plain objects)', () => {
		test('matches exact enumerable string and symbol key count', () => {
			const sym = Symbol('s')
			const obj: Record<string | symbol, unknown> = { a: 1 }
			Object.defineProperty(obj, sym, { value: 1, enumerable: true })
			expect(isCount(obj, 2)).toBe(true)
			expect(isCount(obj, 3)).toBe(false)
		})
		test('rejects arrays and non-objects', () => {
			expect(isCount([] as unknown, 0)).toBe(false)
			expect(isCount(123 as unknown, 0)).toBe(false)
		})
	})

	describe('isCountMin/Max (inclusive bounds)', () => {
		test('counts enumerable string and symbol keys with min/max', () => {
			const sym = Symbol('s')
			const obj: Record<string | symbol, unknown> = { a: 1 }
			Object.defineProperty(obj, sym, { value: 1, enumerable: true })
			expect(isCountMin(obj, 2)).toBe(true)
			expect(isCountMin(obj, 3)).toBe(false)
			expect(isCountMax(obj, 2)).toBe(true)
			expect(isCountMax(obj, 1)).toBe(false)
		})
		test('rejects non-objects and arrays', () => {
			expect(isCountMin([] as unknown, 1)).toBe(false)
			expect(isCountMax(123 as unknown, 1)).toBe(false)
		})
	})

	describe('isSizeRange (value-first size range validator)', () => {
		test('Set size within inclusive range', () => {
			const s = new Set([1, 2])
			expect(isSizeRange(s, 2, 3)).toBe(true)
			expect(isSizeRange(s, 3, 4)).toBe(false)
		})
		test('Map size within inclusive range', () => {
			const m = new Map<number, string>([[1, 'a']])
			expect(isSizeRange(m, 1, 2)).toBe(true)
			expect(isSizeRange(m, 2, 3)).toBe(false)
		})
	})

	describe('isSize (exact size for Map/Set)', () => {
		test('matches exact Set size', () => {
			const s = new Set([1, 2])
			expect(isSize(s, 2)).toBe(true)
			expect(isSize(s, 1)).toBe(false)
		})
		test('matches exact Map size', () => {
			const m = new Map<number, string>([[1, 'a']])
			expect(isSize(m, 1)).toBe(true)
			expect(isSize(m, 2)).toBe(false)
		})
		test('rejects non-Map/Set values', () => {
			expect(isSize([] as unknown, 0)).toBe(false)
			expect(isSize({} as unknown, 0)).toBe(false)
		})
	})

	describe('isSizeMin/Max (inclusive bounds)', () => {
		test('Set size min/max', () => {
			const s = new Set([1, 2])
			expect(isSizeMin(s, 2)).toBe(true)
			expect(isSizeMin(s, 3)).toBe(false)
			expect(isSizeMax(s, 2)).toBe(true)
			expect(isSizeMax(s, 1)).toBe(false)
		})
		test('Map size min/max', () => {
			const m = new Map<number, string>([[1, 'a']])
			expect(isSizeMin(m, 1)).toBe(true)
			expect(isSizeMax(m, 0)).toBe(false)
		})
	})
})
