import { test, expect } from 'vitest'
import { isObject, isRecord, hasOwn, hasOnlyKeys, keyOf, hasNo, recordOf } from '../src/objects.js'
import { assertHasNo } from '../src/assert.js'
import { isNumber } from '@orkestrel/validator'

test('isObject and isRecord', () => {
	expect(isObject({})).toBe(true)
	expect(isObject(null)).toBe(false)
	expect(isRecord({})).toBe(true)
	expect(isRecord([])).toBe(false)
})

test('hasOwn with prototype-less objects', () => {
	const o = Object.create(null) as Record<string, unknown>
	o.x = 1
	expect(hasOwn(o, 'x')).toBe(true)
	expect(hasOwn(o, 'y' as never)).toBe(false)
})

test('hasOnlyKeys exactness', () => {
	expect(hasOnlyKeys({ a: 1, b: 2 }, 'a', 'b')).toBe(true)
	expect(hasOnlyKeys({ a: 1 }, 'a', 'b')).toBe(false)
	expect(hasOnlyKeys({})).toBe(true)
})

test('keyOf guard', () => {
	const isSeverity = keyOf({ info: 1, warn: 2, error: 3 } as const)
	expect(isSeverity('warn')).toBe(true)
	expect(isSeverity('oops' as unknown)).toBe(false)
})

test('hasNo and assertHasNo', () => {
	const o = { a: 1 }
	expect(hasNo(o, 'b', 'c')).toBe(true)
	expect(hasNo(o, 'a')).toBe(false)
	expect(() => assertHasNo(o, 'b', 'c')).not.toThrow()
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

test('recordOf', () => {
	const isRecOfNum = recordOf(isNumber)
	expect(isRecOfNum({ a: 1 })).toBe(true)
	expect(isRecOfNum({ a: 'x' } as unknown)).toBe(false)
})
