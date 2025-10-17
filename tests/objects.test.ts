import { describe, test, expect } from 'vitest'
import { isObject, isRecord, isCountRange } from '../src/objects.js'

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
