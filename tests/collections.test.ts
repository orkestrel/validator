import { describe, test, expect } from 'vitest'
import { isMap, isSet, isWeakMap, isWeakSet, isSizeRange } from '../src/collections.js'

describe('collections', () => {
	describe('isMap', () => {
		test('returns true for Map instances', () => {
			expect(isMap(new Map())).toBe(true)
		})

		test('returns false for non-Map values', () => {
			expect(isMap({})).toBe(false)
			expect(isMap(new Set())).toBe(false)
		})
	})

	describe('isSet', () => {
		test('returns true for Set instances', () => {
			expect(isSet(new Set())).toBe(true)
		})

		test('returns false for non-Set values', () => {
			expect(isSet([])).toBe(false)
			expect(isSet(new Map())).toBe(false)
		})
	})

	describe('isWeakMap', () => {
		test('returns true for WeakMap instances', () => {
			expect(isWeakMap(new WeakMap())).toBe(true)
		})

		test('returns false for non-WeakMap values', () => {
			expect(isWeakMap(new Map())).toBe(false)
		})
	})

	describe('isWeakSet', () => {
		test('returns true for WeakSet instances', () => {
			expect(isWeakSet(new WeakSet())).toBe(true)
		})

		test('returns false for non-WeakSet values', () => {
			expect(isWeakSet(new Set())).toBe(false)
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
})
