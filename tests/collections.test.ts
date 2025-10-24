import { describe, test, expect } from 'vitest'
import { isMap, isObject, isRecord, isSet, isWeakMap, isWeakSet } from '../src/collections.js'

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
