import { describe, test, expect } from 'vitest'
import {
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

describe('emptiness', () => {
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
})
