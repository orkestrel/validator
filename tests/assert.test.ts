import { test, expect } from 'vitest'
import {
	assertString,
	assertNumber,
	assertArrayOf,
	assertNonEmptyArrayOf,
	assertRecordOf,
	assertTupleOf,
	assertSchema,
	assertDefined,
	assertDeepEqual,
	assertDeepClone,
	assertNot,
	assertHasNo,
} from '../src/assert.js'
import { isString, isNumber } from '../src/primitives.js'

test('assertString/Number', () => {
	expect(() => assertString('x')).not.toThrow()
	expect(() => assertNumber(42)).not.toThrow()
})

test('assertString diagnostics', () => {
	let threw = false
	try {
		assertString(42, { path: ['payload', 'name'], label: 'User.name', hint: 'Use String(value)' })
	}
	catch (e) {
		threw = true
		const err = e as Error & { path?: unknown, hint?: string }
		expect(err.message).toMatch(/expected string/i)
		expect(err.message).toMatch(/payload\.name/)
		expect(err.hint).toBe('Use String(value)')
		expect(Array.isArray((err as { path?: unknown }).path)).toBe(true)
	}
	expect(threw).toBe(true)
})

test('assertArrayOf pinpoints index', () => {
	const input = ['a', 1, 'c'] as unknown[]
	let threw = false
	try {
		assertArrayOf(input, isString, { path: ['tags'] })
	}
	catch (e) {
		threw = true
		const err = e as Error
		expect(err.message).toMatch(/element matching guard/i)
		expect(err.message).toMatch(/\[1]/)
		expect(err.message).toMatch(/tags/)
	}
	expect(threw).toBe(true)
})

test('assertNonEmptyArrayOf', () => {
	expect(() => assertNonEmptyArrayOf(['a'], isString)).not.toThrow()
	let threw = false
	try {
		assertNonEmptyArrayOf([], isString)
	}
	catch (e) {
		threw = true
		expect((e as Error).message).toMatch(/non-empty array/i)
	}
	expect(threw).toBe(true)
})

test('assertRecordOf pinpoints key', () => {
	const input = { a: 'x', b: 2 } as Record<string, unknown>
	let threw = false
	try {
		assertRecordOf(input, isString, { path: ['attrs'] })
	}
	catch (e) {
		threw = true
		const err = e as Error
		expect(err.message).toMatch(/property value matching guard/i)
		expect(err.message).toMatch(/attrs\.b/)
	}
	expect(threw).toBe(true)
})

test('assertTupleOf pinpoints index', () => {
	const input = ['x', 2] as unknown
	let threw = false
	try {
		assertTupleOf(input, [isString, isString], { path: ['pair'] })
	}
	catch (e) {
		threw = true
		const err = e as Error
		expect(err.message).toMatch(/tuple element 1 matching guard/i)
		expect(err.message).toMatch(/pair\[1]/)
	}
	expect(threw).toBe(true)
})

test('assertSchema and assertDefined', () => {
	const schema = {
		id: 'string',
		meta: {
			tags: (_x: unknown): _x is readonly string[] => Array.isArray(_x) && _x.every(isString),
			count: isNumber,
		},
	} as const

	const good = { id: 'x', meta: { tags: ['a', 'b'], count: 1 } }
	expect(() => assertSchema(good, schema, { path: ['user'] })).not.toThrow()

	const bad1 = { id: 1, meta: { tags: ['a'], count: 1 } }
	let threw1 = false
	try {
		assertSchema(bad1, schema, { path: ['user'] })
	}
	catch (e) {
		threw1 = true
		const err = e as Error
		expect(err.message).toMatch(/property "id" of type string/i)
		expect(err.message).toMatch(/user\.id/)
	}
	expect(threw1).toBe(true)

	const v: string | undefined = 'x'
	expect(() => assertDefined(v)).not.toThrow()
	let threw2 = false
	try {
		assertDefined(undefined)
	}
	catch (e) {
		threw2 = true
		expect((e as Error).message).toMatch(/defined value/i)
	}
	expect(threw2).toBe(true)
})

test('assertDeepEqual/Clone', () => {
	expect(() => assertDeepEqual({ a: [1] }, { a: [1] }, { path: ['root'] })).not.toThrow()
	let threw = false
	try {
		assertDeepEqual({ a: [1, 2] }, { a: [1, 3] }, { path: ['root'] })
	}
	catch (e) {
		threw = true
		const err = e as Error
		expect(err.message).toMatch(/deep equality/i)
		expect(err.message).toMatch(/root\.a\[1]/)
	}
	expect(threw).toBe(true)

	const a = { x: { y: 1 } }
	const b = { x: { y: 1 } }
	expect(() => assertDeepClone(a, b, { path: ['obj'] })).not.toThrow()
})

test('assertNot and assertHasNo', () => {
	expect(() => assertNot('x', isNumber)).not.toThrow()
	let threw1 = false
	try {
		assertNot('x', isString, { path: ['where'] })
	}
	catch (e) {
		threw1 = true
		const err = e as Error
		expect(err.message).toMatch(/not/i)
		expect(err.message).toMatch(/where/)
	}
	expect(threw1).toBe(true)

	const o = { a: 1 }
	expect(() => assertHasNo(o, 'b', 'c')).not.toThrow()
	let threw2 = false
	try {
		assertHasNo(o, 'a', { path: ['obj'] })
	}
	catch (e) {
		threw2 = true
		expect((e as Error).message).toMatch(/without keys/i)
	}
	expect(threw2).toBe(true)
})
