import { test, expect } from 'vitest'
import { isMap, isSet, isWeakMap, isWeakSet, mapOf, setOf, nonEmptySetOf } from '../src/collections.js'
import { isString, isNumber } from '../src/primitives.js'

test('isMap/isSet', () => {
	expect(isMap(new Map())).toBe(true)
	expect(isSet(new Set())).toBe(true)
	expect(isMap({})).toBe(false)
	expect(isSet([])).toBe(false)
})

test('weak collections', () => {
	expect(isWeakMap(new WeakMap())).toBe(true)
	expect(isWeakSet(new WeakSet())).toBe(true)
})

test('mapOf validates', () => {
	const m = new Map<unknown, unknown>([[1, 'a'], [2, 'b']])
	const g = mapOf(isNumber, isString)
	expect(g(m)).toBe(true)

	const bad = new Map<unknown, unknown>([[1, 2]])
	expect(g(bad)).toBe(false)
})

test('setOf and nonEmptySetOf', () => {
	const s = new Set<unknown>(['a', 'b'])
	expect(setOf(isString)(s)).toBe(true)
	expect(nonEmptySetOf(isString)(s)).toBe(true)
	expect(nonEmptySetOf(isString)(new Set())).toBe(false)
})
