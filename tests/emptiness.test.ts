import { test, expect } from 'vitest'
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

test('isEmpty generic and specific checks', () => {
	expect(isEmpty('')).toBe(true)
	expect(isEmpty([])).toBe(true)
	expect(isEmpty(new Set())).toBe(true)
	expect(isEmpty(new Map())).toBe(true)
	expect(isEmpty({})).toBe(true)
	expect(isEmpty(['x'])).toBe(false)
})

test('specific emptiness guards', () => {
	expect(isEmptyString('')).toBe(true)
	expect(isEmptyArray([])).toBe(true)
	expect(isEmptySet(new Set())).toBe(true)
	expect(isEmptyMap(new Map())).toBe(true)
	expect(isEmptyObject({})).toBe(true)

	expect(isNonEmptyString('a')).toBe(true)
	expect(isNonEmptyArray([1])).toBe(true)
	expect(isNonEmptySet(new Set([1]))).toBe(true)
	expect(isNonEmptyMap(new Map([[1, 2]]))).toBe(true)
	expect(isNonEmptyObject({ a: 1 })).toBe(true)
})

test('emptiness assertions', () => {
	expect(() => assertEmpty('')).not.toThrow()
	expect(() => assertEmptyArray([])).not.toThrow()
	expect(() => assertEmptySet(new Set())).not.toThrow()
	expect(() => assertEmptyMap(new Map())).not.toThrow()
	expect(() => assertEmptyObject({})).not.toThrow()
	expect(() => assertEmptyString('')).not.toThrow()

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
