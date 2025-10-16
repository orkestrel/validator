import { describe, test, expect } from 'vitest'
import { isDeepEqual, isDeepClone } from '../src/deep.js'
import { assertDeepEqual, assertDeepClone } from '../src/assert.js'

describe('deep', () => {
	describe('isDeepEqual', () => {
		test('compares primitive values', () => {
			expect(isDeepEqual('a', 'a')).toBe(true)
			expect(isDeepEqual('a', 'b')).toBe(false)
			expect(isDeepEqual(1, 1)).toBe(true)
			expect(isDeepEqual(1, 2)).toBe(false)
		})

		test('handles number edge cases with strictNumbers', () => {
			expect(isDeepEqual(0, -0)).toBe(false)
			expect(isDeepEqual(NaN, NaN)).toBe(true)
			expect(isDeepEqual(0, -0, { strictNumbers: false })).toBe(true)
		})

		test('compares arrays deeply', () => {
			expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
			expect(isDeepEqual([1, 2], [1, 2, 3])).toBe(false)
			expect(isDeepEqual([1, 2], [1, 3])).toBe(false)
		})

		test('compares nested objects and arrays', () => {
			const a = [1, { x: ['y'] }]
			const b = [1, { x: ['y'] }]
			const c = [1, { x: ['z'] }]
			expect(isDeepEqual(a, b)).toBe(true)
			expect(isDeepEqual(a, c)).toBe(false)
		})

		test('compares objects with keys', () => {
			expect(isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
			expect(isDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
			expect(isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
		})

		test('compares Sets unordered by default', () => {
			const sa = new Set([1, 2, 3])
			const sb = new Set([3, 2, 1])
			expect(isDeepEqual(sa, sb)).toBe(true)
		})

		test('compares Sets ordered when compareSetOrder is true', () => {
			const sa = new Set([1, 2, 3])
			const sb = new Set([3, 2, 1])
			expect(isDeepEqual(sa, sb, { compareSetOrder: true })).toBe(false)
			expect(isDeepEqual(sa, sa, { compareSetOrder: true })).toBe(true)
		})

		test('compares Maps unordered by default', () => {
			const ma = new Map<unknown, unknown>([[{ k: 1 }, 'a'], [{ k: 2 }, 'b']])
			const mb = new Map<unknown, unknown>([[{ k: 2 }, 'b'], [{ k: 1 }, 'a']])
			expect(isDeepEqual(ma, mb)).toBe(true)
		})

		test('compares Maps ordered when compareMapOrder is true', () => {
			const ma = new Map<unknown, unknown>([[{ k: 1 }, 'a'], [{ k: 2 }, 'b']])
			const mb = new Map<unknown, unknown>([[{ k: 2 }, 'b'], [{ k: 1 }, 'a']])
			expect(isDeepEqual(ma, mb, { compareMapOrder: true })).toBe(false)
		})

		test('compares Dates', () => {
			expect(isDeepEqual(new Date(5), new Date(5))).toBe(true)
			expect(isDeepEqual(new Date(5), new Date(6))).toBe(false)
		})

		test('compares RegExps', () => {
			expect(isDeepEqual(/a/gi, /a/gi)).toBe(true)
			expect(isDeepEqual(/a/g, /a/i)).toBe(false)
			expect(isDeepEqual(/a/, /b/)).toBe(false)
		})

		test('compares ArrayBuffers', () => {
			const ab1 = new ArrayBuffer(4)
			const ab2 = new ArrayBuffer(4)
			new Uint8Array(ab1).set([1, 2, 3, 4])
			new Uint8Array(ab2).set([1, 2, 3, 4])
			expect(isDeepEqual(ab1, ab2)).toBe(true)
			new Uint8Array(ab2)[2] = 9
			expect(isDeepEqual(ab1, ab2)).toBe(false)
		})

		test('compares DataViews', () => {
			const ab1 = new ArrayBuffer(4)
			const ab2 = new ArrayBuffer(4)
			const dv1 = new DataView(ab1)
			const dv2 = new DataView(ab2)
			new Uint8Array(ab1).set([1, 2, 3, 4])
			new Uint8Array(ab2).set([1, 2, 3, 4])
			expect(isDeepEqual(dv1, dv2)).toBe(true)
			new Uint8Array(ab2)[2] = 9
			expect(isDeepEqual(dv1, dv2)).toBe(false)
		})

		test('compares TypedArrays of same type', () => {
			expect(isDeepEqual(new Uint16Array([1, 2]), new Uint16Array([1, 2]))).toBe(true)
			expect(isDeepEqual(new Uint16Array([1, 2]), new Uint16Array([2, 1]))).toBe(false)
			expect(isDeepEqual(new Int32Array([1, 2, 3]), new Int32Array([1, 2, 3]))).toBe(true)
		})

		test('returns false for TypedArrays of different types', () => {
			expect(isDeepEqual(new Uint8Array([1, 2]), new Uint16Array([1, 2]))).toBe(false)
			expect(isDeepEqual(new Int32Array([1]), new Uint32Array([1]))).toBe(false)
		})

		test('compares objects with symbol keys', () => {
			const sym = Symbol('k')
			const a: Record<string | symbol, unknown> = {}
			const b: Record<string | symbol, unknown> = {}
			Object.defineProperty(a, sym, { value: 1, enumerable: true, configurable: true, writable: true })
			Object.defineProperty(b, sym, { value: 1, enumerable: true, configurable: true, writable: true })
			expect(isDeepEqual(a, b)).toBe(true)
			Object.defineProperty(b, sym, { value: 2, enumerable: true, configurable: true, writable: true })
			expect(isDeepEqual(a, b)).toBe(false)
		})

		test('handles circular references', () => {
			const a: Record<string, unknown> = { x: 1 }
			const b: Record<string, unknown> = { x: 1 }
			a.self = a
			b.self = b
			expect(isDeepEqual(a, b)).toBe(true)
		})
	})

	describe('isDeepClone', () => {
		test('returns true for deep clones without shared references', () => {
			const a = { x: { y: 1 }, z: [1, 2] }
			const b = { x: { y: 1 }, z: [1, 2] }
			expect(isDeepClone(a, b)).toBe(true)
		})

		test('returns false for same object reference', () => {
			const c = { x: 1 }
			expect(isDeepClone(c, c)).toBe(false)
		})

		test('returns false for shared nested references', () => {
			const shared = { y: 1 }
			const d = { x: shared }
			const e = { x: shared }
			expect(isDeepClone(d, e)).toBe(false)
		})

		test('allows shared functions by default', () => {
			const fn = () => 1
			const f = { fn, k: { v: 1 } }
			const g = { fn, k: { v: 1 } }
			expect(isDeepClone(f, g)).toBe(true)
		})

		test('allows shared errors by default', () => {
			const err = new Error('x')
			const f = { e: err, k: { v: 1 } }
			const g = { e: err, k: { v: 1 } }
			expect(isDeepClone(f, g)).toBe(true)
		})

		test('respects allowSharedFunctions option', () => {
			const fn = () => 1
			const f = { fn, k: { v: 1 } }
			const g = { fn, k: { v: 1 } }
			expect(isDeepClone(f, g, { allowSharedFunctions: false })).toBe(false)
		})

		test('respects allowSharedErrors option', () => {
			const err = new Error('x')
			const f = { e: err, k: { v: 1 } }
			const g = { e: err, k: { v: 1 } }
			expect(isDeepClone(f, g, { allowSharedErrors: false })).toBe(false)
		})
	})

	describe('assertDeepEqual', () => {
		test('does not throw for equal values', () => {
			expect(() => assertDeepEqual({ a: [1] }, { a: [1] }, { path: ['root'] })).not.toThrow()
			expect(() => assertDeepEqual([1, 2], [1, 2])).not.toThrow()
		})

		test('throws with diagnostic path for unequal values', () => {
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
		})
	})

	describe('assertDeepClone', () => {
		test('does not throw for deep clones', () => {
			const a = { x: { y: 1 } }
			const b = { x: { y: 1 } }
			expect(() => assertDeepClone(a, b, { path: ['obj'] })).not.toThrow()
		})

		test('throws for shared references', () => {
			const c = { x: 1 }
			let threw = false
			try {
				assertDeepClone(c, c)
			}
			catch (e) {
				threw = true
				expect((e as Error).message).toContain('deep clone')
			}
			expect(threw).toBe(true)
		})
	})
})
