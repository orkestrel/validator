import { describe, test, expect } from 'vitest'
import { isObject, isRecord } from '../src/objects.js'

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
})
