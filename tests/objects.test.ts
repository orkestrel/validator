import { describe, test, expect } from 'vitest'
import { isObject, isRecord, hasOwn, hasOnlyKeys, hasNo, isCountRange } from '../src/objects.js'

describe('objects', () => {
	describe('isObject', () => {
		test('returns true for objects and arrays', () => {
			expect(isObject({})).toBe(true)
			expect(isObject([] as unknown as Record<string, unknown>)).toBe(true)
		})

		test('returns false for null', () => {
			expect(isObject(null as unknown)).toBe(false)
		})
	})

	describe('isRecord', () => {
		test('returns true for plain objects', () => {
			expect(isRecord({})).toBe(true)
		})

		test('returns false for arrays and null', () => {
			expect(isRecord([])).toBe(false)
			expect(isRecord(null as unknown)).toBe(false)
		})
	})

	describe('hasOwn', () => {
		test('single key', () => {
			expect(hasOwn({ x: 1 }, 'x')).toBe(true)
			expect(hasOwn({ x: 1 }, 'y' as never)).toBe(false)
		})

		test('multiple keys', () => {
			const o = { x: 1 } as const
			expect(hasOwn(o, 'x')).toBe(true)
			expect(hasOwn(o, 'y' as never)).toBe(false)
		})
	})

	describe('hasOnlyKeys', () => {
		test('exact key set', () => {
			expect(hasOnlyKeys({ a: 1, b: 2 }, 'a', 'b')).toBe(true)
			expect(hasOnlyKeys({ a: 1 }, 'a', 'b')).toBe(false)
			expect(hasOnlyKeys({ a: 1, b: 2, c: 3 }, 'a', 'b')).toBe(false)
			expect(hasOnlyKeys({})).toBe(true)
		})
	})

	describe('hasNo', () => {
		test('none of the keys are present', () => {
			const o = { a: 1 } as const
			expect(hasNo(o, 'b', 'c')).toBe(true)
			expect(hasNo(o, 'a')).toBe(false)
			expect(hasNo(o, 'a', 'b')).toBe(false)
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
})
