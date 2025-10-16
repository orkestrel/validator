import { test, expect } from 'vitest'
import { isDeepEqual, isDeepClone } from '../src/deep.js'
import { assertDeepEqual, assertDeepClone } from '../src/assert.js'

test('isDeepEqual primitives and number edge cases', () => {
	expect(isDeepEqual('a', 'a')).toBe(true)
	expect(isDeepEqual(0, -0)).toBe(false)
	expect(isDeepEqual(NaN, NaN)).toBe(true)
	expect(isDeepEqual(0, -0, { strictNumbers: false })).toBe(true)
})

test('isDeepEqual arrays and nested objects', () => {
	const a = [1, { x: ['y'] }]
	const b = [1, { x: ['y'] }]
	const c = [1, { x: ['z'] }]
	expect(isDeepEqual(a, b)).toBe(true)
	expect(isDeepEqual(a, c)).toBe(false)
})

test('isDeepEqual sets and maps (unordered by default)', () => {
	const sa = new Set([1, 2, 3])
	const sb = new Set([3, 2, 1])
	expect(isDeepEqual(sa, sb)).toBe(true)
	expect(isDeepEqual(sa, sb, { compareSetOrder: true })).toBe(false)

	const ma = new Map<unknown, unknown>([[{ k: 1 }, 'a'], [{ k: 2 }, 'b']])
	const mb = new Map<unknown, unknown>([[{ k: 2 }, 'b'], [{ k: 1 }, 'a']])
	expect(isDeepEqual(ma, mb)).toBe(true)
	expect(isDeepEqual(ma, mb, { compareMapOrder: true })).toBe(false)
})

test('isDeepEqual Dates, RegExps, Buffers and TypedArrays', () => {
	expect(isDeepEqual(new Date(5), new Date(5))).toBe(true)
	expect(isDeepEqual(new Date(5), new Date(6))).toBe(false)

	expect(isDeepEqual(/a/gi, /a/gi)).toBe(true)
	expect(isDeepEqual(/a/g, /a/i)).toBe(false)

	const ab1 = new ArrayBuffer(4)
	const ab2 = new ArrayBuffer(4)
	new Uint8Array(ab1).set([1, 2, 3, 4])
	new Uint8Array(ab2).set([1, 2, 3, 4])
	expect(isDeepEqual(ab1, ab2)).toBe(true)
	new Uint8Array(ab2)[2] = 9
	expect(isDeepEqual(ab1, ab2)).toBe(false)

	expect(isDeepEqual(new Uint16Array([1, 2]), new Uint16Array([1, 2]))).toBe(true)
	expect(isDeepEqual(new Uint16Array([1, 2]), new Uint16Array([2, 1]))).toBe(false)
})

test('isDeepClone validations', () => {
	const a = { x: { y: 1 }, z: [1, 2] }
	const b = { x: { y: 1 }, z: [1, 2] }
	expect(isDeepClone(a, b)).toBe(true)

	const c = { x: 1 }
	expect(isDeepClone(c, c)).toBe(false)

	const shared = { y: 1 }
	const d = { x: shared }
	const e = { x: shared }
	expect(isDeepClone(d, e)).toBe(false)

	const fn = () => 1
	const err = new Error('x')
	const f = { fn, e: err, k: { v: 1 } }
	const g = { fn, e: err, k: { v: 1 } }
	expect(isDeepClone(f, g)).toBe(true)
	expect(isDeepClone(f, g, { allowSharedFunctions: false })).toBe(false)
	expect(isDeepClone(f, g, { allowSharedErrors: false })).toBe(false)
})

test('assertDeepEqual and assertDeepClone diagnostics', () => {
	expect(() => assertDeepEqual({ a: [1] }, { a: [1] }, { path: ['root'] })).not.toThrow()
	let threw = false
	try {
		assertDeepEqual({ a: [1, 2] }, { a: [1, 3] }, { path: ['root'] })
	}
	catch (e) {
		threw = true
		const err = e as Error
		expect(err.message).toContain('deep equality')
		expect(err.message).toContain('root.a[1]')
	}
	expect(threw).toBe(true)

	const a = { x: { y: 1 } }
	const b = { x: { y: 1 } }
	expect(() => assertDeepClone(a, b, { path: ['obj'] })).not.toThrow()
})

test('isDeepEqual with symbol keys (enumerable)', () => {
	const sym = Symbol('k')
	const a: Record<string | symbol, unknown> = {}
	const b: Record<string | symbol, unknown> = {}
	Object.defineProperty(a, sym, { value: 1, enumerable: true, configurable: true, writable: true })
	Object.defineProperty(b, sym, { value: 1, enumerable: true, configurable: true, writable: true })
	expect(isDeepEqual(a, b)).toBe(true)
	Object.defineProperty(b, sym, { value: 2, enumerable: true, configurable: true, writable: true })
	expect(isDeepEqual(a, b)).toBe(false)
})
