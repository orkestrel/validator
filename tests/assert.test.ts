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
	assertLowercase,
	assertUppercase,
	assertAlphanumeric,
	assertAscii,
	assertHexColor,
	assertIPv4String,
	assertHostnameString,
	assertUUIDv4,
	assertISODateString,
	assertISODateTimeString,
	assertEmail,
	assertURLString,
	assertHttpUrlString,
	assertPortNumber,
	assertMimeType,
	assertSlug,
	assertBase64String,
	assertHexString,
	assertSemver,
	assertJsonString,
	assertHttpMethod,
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

// Newly organized assertion tests

test('assertLowercase and assertUppercase', () => {
	expect(() => assertLowercase('abc')).not.toThrow()
	expect(() => assertUppercase('ABC')).not.toThrow()
	let t1 = false
	try {
		assertLowercase('Abc')
	}
	catch (e) {
		t1 = true
		expect((e as Error).message).toMatch(/lowercase/i)
	}
	expect(t1).toBe(true)
	let t2 = false
	try {
		assertUppercase('AbC')
	}
	catch (e) {
		t2 = true
		expect((e as Error).message).toMatch(/uppercase/i)
	}
	expect(t2).toBe(true)
})

test('assertAlphanumeric and assertAscii', () => {
	expect(() => assertAlphanumeric('A1')).not.toThrow()
	expect(() => assertAscii('Hello')).not.toThrow()
	let t1 = false
	try {
		assertAlphanumeric('A!')
	}
	catch (e) {
		t1 = true
		expect((e as Error).message).toMatch(/alphanumeric/i)
	}
	expect(t1).toBe(true)
	let t2 = false
	try {
		assertAscii('\u00A9' as unknown as string)
	}
	catch (e) {
		t2 = true
		expect((e as Error).message).toMatch(/ascii/i)
	}
	expect(t2).toBe(true)
})

test('assertHexColor', () => {
	expect(() => assertHexColor('#fff', { allowHash: true })).not.toThrow()
	let t = false
	try {
		assertHexColor('ffff')
	}
	catch (e) {
		t = true
		expect((e as Error).message).toMatch(/hex color/i)
	}
	expect(t).toBe(true)
})

test('assertIPv4String and assertHostnameString', () => {
	expect(() => assertIPv4String('127.0.0.1')).not.toThrow()
	expect(() => assertHostnameString('example.com')).not.toThrow()
	let t1 = false
	try {
		assertIPv4String('256.0.0.1')
	}
	catch (e) {
		t1 = true
		expect((e as Error).message).toMatch(/ipv4/i)
	}
	expect(t1).toBe(true)
	let t2 = false
	try {
		assertHostnameString('-bad.com')
	}
	catch (e) {
		t2 = true
		expect((e as Error).message).toMatch(/hostname/i)
	}
	expect(t2).toBe(true)
})

test('assertUUIDv4 and assertEmail', () => {
	expect(() => assertUUIDv4('123e4567-e89b-42d3-a456-426614174000')).not.toThrow()
	expect(() => assertEmail('a@b.co')).not.toThrow()
	let t1 = false
	try {
		assertUUIDv4('not-a-uuid')
	}
	catch (e) {
		t1 = true
		expect((e as Error).message).toMatch(/uuid v4/i)
	}
	expect(t1).toBe(true)
	let t2 = false
	try {
		assertEmail('a@b')
	}
	catch (e) {
		t2 = true
		expect((e as Error).message).toMatch(/email/i)
	}
	expect(t2).toBe(true)
})

test('assertURLString and assertHttpUrlString', () => {
	expect(() => assertURLString('https://example.com')).not.toThrow()
	expect(() => assertHttpUrlString('https://example.com')).not.toThrow()
	let t1 = false
	try {
		assertURLString('/relative')
	}
	catch (e) {
		t1 = true
		expect((e as Error).message).toMatch(/url string/i)
	}
	expect(t1).toBe(true)
	let t2 = false
	try {
		assertHttpUrlString('ftp://example.com')
	}
	catch (e) {
		t2 = true
		expect((e as Error).message).toMatch(/http\(s\) url string/i)
	}
	expect(t2).toBe(true)
})

test('assertPortNumber and assertMimeType', () => {
	expect(() => assertPortNumber(8080)).not.toThrow()
	expect(() => assertMimeType('text/plain')).not.toThrow()
	let t1 = false
	try {
		assertPortNumber(0)
	}
	catch (e) {
		t1 = true
		expect((e as Error).message).toMatch(/port number/i)
	}
	expect(t1).toBe(true)
	let t2 = false
	try {
		assertMimeType('not-a-type')
	}
	catch (e) {
		t2 = true
		expect((e as Error).message).toMatch(/mime type/i)
	}
	expect(t2).toBe(true)
})

test('assertSlug and assertBase64String', () => {
	expect(() => assertSlug('my-post-1')).not.toThrow()
	expect(() => assertBase64String('TWFu')).not.toThrow()
	let t1 = false
	try {
		assertSlug('Hello-World')
	}
	catch (e) {
		t1 = true
		expect((e as Error).message).toMatch(/slug/i)
	}
	expect(t1).toBe(true)
	let t2 = false
	try {
		assertBase64String('@@@')
	}
	catch (e) {
		t2 = true
		expect((e as Error).message).toMatch(/base64/i)
	}
	expect(t2).toBe(true)
})

test('assertHexString and assertSemver', () => {
	expect(() => assertHexString('deadbeef', { evenLength: true })).not.toThrow()
	expect(() => assertSemver('1.2.3')).not.toThrow()
	let t1 = false
	try {
		assertHexString('xyz')
	}
	catch (e) {
		t1 = true
		expect((e as Error).message).toMatch(/hex string/i)
	}
	expect(t1).toBe(true)
	let t2 = false
	try {
		assertSemver('1.2')
	}
	catch (e) {
		t2 = true
		expect((e as Error).message).toMatch(/semantic version/i)
	}
	expect(t2).toBe(true)
})

test('assertJsonString and assertHttpMethod', () => {
	expect(() => assertJsonString('{"a":1}')).not.toThrow()
	expect(() => assertHttpMethod('GET')).not.toThrow()
	let t1 = false
	try {
		assertJsonString('{a:1}')
	}
	catch (e) {
		t1 = true
		expect((e as Error).message).toMatch(/json string/i)
	}
	expect(t1).toBe(true)
	let t2 = false
	try {
		assertHttpMethod('get' as unknown)
	}
	catch (e) {
		t2 = true
		expect((e as Error).message).toMatch(/http method/i)
	}
	expect(t2).toBe(true)
})

// Additional tests to exercise ISO date validators and avoid unused imports

test('assertISODateString and assertISODateTimeString', () => {
	expect(() => assertISODateString('2024-01-02')).not.toThrow()
	expect(() => assertISODateTimeString('2024-10-12T16:59:32Z')).not.toThrow()
	let t1 = false
	try {
		assertISODateString('2024-13-01')
	}
	catch (e) {
		t1 = true
		expect((e as Error).message).toMatch(/iso date/i)
	}
	expect(t1).toBe(true)
	let t2 = false
	try {
		assertISODateTimeString('not-a-date')
	}
	catch (e) {
		t2 = true
		expect((e as Error).message).toMatch(/date-time/i)
	}
	expect(t2).toBe(true)
})
