import { describe, test, expect } from 'vitest'
import { isMap, isSet, isWeakMap, isWeakSet, mapOf, setOf, nonEmptySetOf } from '../src/collections.js'
import { isString, isNumber } from '../src/primitives.js'

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

	describe('mapOf', () => {
		test('validates Map entries with key and value guards', () => {
			const m = new Map<unknown, unknown>([[1, 'a'], [2, 'b']])
			const g = mapOf(isNumber, isString)
			expect(g(m)).toBe(true)
		})

		test('returns false when entries fail guards', () => {
			const bad = new Map<unknown, unknown>([[1, 2]])
			const g = mapOf(isNumber, isString)
			expect(g(bad)).toBe(false)
		})

		test('returns true for empty Maps', () => {
			const g = mapOf(isNumber, isString)
			expect(g(new Map())).toBe(true)
		})
	})

	describe('setOf', () => {
		test('validates Set values with guard', () => {
			const s = new Set<unknown>(['a', 'b'])
			expect(setOf(isString)(s)).toBe(true)
		})

		test('returns false when values fail guard', () => {
			const s = new Set<unknown>(['a', 1])
			expect(setOf(isString)(s)).toBe(false)
		})

		test('returns true for empty Sets', () => {
			expect(setOf(isString)(new Set())).toBe(true)
		})
	})

	describe('nonEmptySetOf', () => {
		test('validates non-empty Sets', () => {
			const s = new Set<unknown>(['a', 'b'])
			expect(nonEmptySetOf(isString)(s)).toBe(true)
		})

		test('returns false for empty Sets', () => {
			expect(nonEmptySetOf(isString)(new Set())).toBe(false)
		})
	})
})
