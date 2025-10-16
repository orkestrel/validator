import { describe, test, expect } from 'vitest'
import {
	isEmpty,
	isEmptyArray,
	isEmptyMap,
	isEmptyObject,
	isEmptySet,
	isEmptyString,
	isNonEmptyArray,
	isNonEmptyMap,
	isNonEmptyObject,
	isNonEmptySet,
	isNonEmptyString,
} from '../src/emptiness.js'
import {
	assertEmpty,
	assertEmptyArray,
	assertEmptyMap,
	assertEmptyObject,
	assertEmptySet,
	assertEmptyString,
} from '../src/assert.js'

describe('emptiness', () => {
	describe('isEmpty', () => {
		test('returns true for empty strings', () => {
			expect(isEmpty('')).toBe(true)
		})

		test('returns true for empty arrays', () => {
			expect(isEmpty([])).toBe(true)
		})

		test('returns true for empty sets', () => {
			expect(isEmpty(new Set())).toBe(true)
		})

		test('returns true for empty maps', () => {
			expect(isEmpty(new Map())).toBe(true)
		})

		test('returns true for empty objects', () => {
			expect(isEmpty({})).toBe(true)
		})

		test('returns false for non-empty values', () => {
			expect(isEmpty(['x'])).toBe(false)
			expect(isEmpty('x')).toBe(false)
			expect(isEmpty(new Set([1]))).toBe(false)
		})
	})

	describe('specific emptiness guards', () => {
		test('isEmptyString returns true for empty strings', () => {
			expect(isEmptyString('')).toBe(true)
		})

		test('isEmptyArray returns true for empty arrays', () => {
			expect(isEmptyArray([])).toBe(true)
		})

		test('isEmptySet returns true for empty sets', () => {
			expect(isEmptySet(new Set())).toBe(true)
		})

		test('isEmptyMap returns true for empty maps', () => {
			expect(isEmptyMap(new Map())).toBe(true)
		})

		test('isEmptyObject returns true for empty objects', () => {
			expect(isEmptyObject({})).toBe(true)
		})

		test('isNonEmptyString returns true for non-empty strings', () => {
			expect(isNonEmptyString('a')).toBe(true)
		})

		test('isNonEmptyArray returns true for non-empty arrays', () => {
			expect(isNonEmptyArray([1])).toBe(true)
		})

		test('isNonEmptySet returns true for non-empty sets', () => {
			expect(isNonEmptySet(new Set([1]))).toBe(true)
		})

		test('isNonEmptyMap returns true for non-empty maps', () => {
			expect(isNonEmptyMap(new Map([[1, 2]]))).toBe(true)
		})

		test('isNonEmptyObject returns true for non-empty objects', () => {
			expect(isNonEmptyObject({ a: 1 })).toBe(true)
		})
	})

	describe('emptiness assertions', () => {
		test('assertEmpty does not throw for empty values', () => {
			expect(() => assertEmpty('')).not.toThrow()
		})

		test('assertEmptyArray does not throw for empty arrays', () => {
			expect(() => assertEmptyArray([])).not.toThrow()
		})

		test('assertEmptySet does not throw for empty sets', () => {
			expect(() => assertEmptySet(new Set())).not.toThrow()
		})

		test('assertEmptyMap does not throw for empty maps', () => {
			expect(() => assertEmptyMap(new Map())).not.toThrow()
		})

		test('assertEmptyObject does not throw for empty objects', () => {
			expect(() => assertEmptyObject({})).not.toThrow()
		})

		test('assertEmptyString does not throw for empty strings', () => {
			expect(() => assertEmptyString('')).not.toThrow()
		})

		test('assertEmpty throws with diagnostic path for non-empty values', () => {
			let threw = false
			try {
				assertEmpty(['x'], { path: ['root', 'arr'] })
			}
			catch (e) {
				threw = true
				const err = e as Error
				expect(err.message).toMatch(/empty value/i)
				expect(err.message).toMatch(/root\.arr/)
			}
			expect(threw).toBe(true)
		})
	})
})
