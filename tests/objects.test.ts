import { describe, test, expect } from 'vitest'
import { isObject, isRecord, hasOwn, hasOnlyKeys, keyOf, hasNo, recordOf } from '../src/objects.js'
import { assertHasNo } from '../src/assert.js'
import { isNumber } from '@orkestrel/validator'

describe('objects', () => {
	describe('isObject', () => {
		test('returns true for plain objects', () => {
			expect(isObject({})).toBe(true)
			expect(isObject({ a: 1 })).toBe(true)
		})

		test('returns true for arrays', () => {
			expect(isObject([])).toBe(true)
		})

		test('returns false for null', () => {
			expect(isObject(null)).toBe(false)
		})

		test('returns false for primitives', () => {
			expect(isObject(1)).toBe(false)
			expect(isObject('str')).toBe(false)
		})
	})

	describe('isRecord', () => {
		test('returns true for plain objects', () => {
			expect(isRecord({})).toBe(true)
			expect(isRecord({ a: 1 })).toBe(true)
		})

		test('returns false for arrays', () => {
			expect(isRecord([])).toBe(false)
		})

		test('returns false for null', () => {
			expect(isRecord(null)).toBe(false)
		})
	})

	describe('hasOwn', () => {
		test('returns true for own properties', () => {
			expect(hasOwn({ x: 1 }, 'x')).toBe(true)
		})

		test('returns false for missing properties', () => {
			expect(hasOwn({ x: 1 }, 'y' as never)).toBe(false)
		})

		test('works with prototype-less objects', () => {
			const o = Object.create(null) as Record<string, unknown>
			o.x = 1
			expect(hasOwn(o, 'x')).toBe(true)
			expect(hasOwn(o, 'y' as never)).toBe(false)
		})
	})

	describe('hasOnlyKeys', () => {
		test('returns true when object has exactly the specified keys', () => {
			expect(hasOnlyKeys({ a: 1, b: 2 }, 'a', 'b')).toBe(true)
		})

		test('returns false when object is missing keys', () => {
			expect(hasOnlyKeys({ a: 1 }, 'a', 'b')).toBe(false)
		})

		test('returns false when object has extra keys', () => {
			expect(hasOnlyKeys({ a: 1, b: 2, c: 3 }, 'a', 'b')).toBe(false)
		})

		test('returns true for empty object with no keys', () => {
			expect(hasOnlyKeys({})).toBe(true)
		})
	})

	describe('keyOf', () => {
		test('creates guard for object keys', () => {
			const isSeverity = keyOf({ info: 1, warn: 2, error: 3 } as const)
			expect(isSeverity('warn')).toBe(true)
			expect(isSeverity('info')).toBe(true)
		})

		test('returns false for non-keys', () => {
			const isSeverity = keyOf({ info: 1, warn: 2, error: 3 } as const)
			expect(isSeverity('oops' as unknown)).toBe(false)
		})
	})

	describe('hasNo', () => {
		test('returns true when object lacks specified keys', () => {
			const o = { a: 1 }
			expect(hasNo(o, 'b', 'c')).toBe(true)
		})

		test('returns false when object has any of the specified keys', () => {
			const o = { a: 1 }
			expect(hasNo(o, 'a')).toBe(false)
			expect(hasNo(o, 'a', 'b')).toBe(false)
		})
	})

	describe('assertHasNo', () => {
		test('does not throw when object lacks specified keys', () => {
			const o = { a: 1 }
			expect(() => assertHasNo(o, 'b', 'c')).not.toThrow()
		})

		test('throws when object has any of the specified keys', () => {
			const o = { a: 1 }
			let threw = false
			try {
				assertHasNo(o, 'a', { path: ['obj'] })
			}
			catch (e) {
				threw = true
				const err = e as Error
				expect(err.message).toMatch(/without keys/i)
				expect(err.message).toMatch(/obj/)
			}
			expect(threw).toBe(true)
		})
	})

	describe('recordOf', () => {
		test('validates record values with guard', () => {
			const isRecOfNum = recordOf(isNumber)
			expect(isRecOfNum({ a: 1 })).toBe(true)
			expect(isRecOfNum({ a: 1, b: 2 })).toBe(true)
		})

		test('returns false when value fails guard', () => {
			const isRecOfNum = recordOf(isNumber)
			expect(isRecOfNum({ a: 'x' } as unknown)).toBe(false)
		})

		test('returns true for empty records', () => {
			const isRecOfNum = recordOf(isNumber)
			expect(isRecOfNum({})).toBe(true)
		})
	})
})
