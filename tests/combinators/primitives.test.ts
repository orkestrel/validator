import { describe, test, expect } from 'vitest'
import { stringOf, numberOf, symbolOf, booleanOf, bigIntOf, nullOf, undefinedOf, dateOf, regExpOf, errorOf, arrayBufferOf, sharedArrayBufferOf, primitiveOf, asyncIteratorOf } from '../../src/combinators/primitives.js'

describe('combinators/primitives', () => {
	describe('stringOf', () => {
		test('accepts any string', () => {
			const g = stringOf()
			expect(g('hello')).toBe(true)
			expect(g('')).toBe(true)
			expect(g(42 as unknown)).toBe(false)
		})
	})

	describe('numberOf', () => {
		test('accepts any number', () => {
			const g = numberOf()
			expect(g(42)).toBe(true)
			expect(g(0)).toBe(true)
			expect(g(NaN)).toBe(true)
			expect(g('42' as unknown)).toBe(false)
		})
	})

	describe('symbolOf', () => {
		test('accepts symbols', () => {
			const g = symbolOf()
			const s = Symbol('test')
			expect(g(s)).toBe(true)
			expect(g('symbol' as unknown)).toBe(false)
		})
	})

	describe('booleanOf', () => {
		test('accepts booleans', () => {
			const g = booleanOf()
			expect(g(true)).toBe(true)
			expect(g(false)).toBe(true)
			expect(g(1 as unknown)).toBe(false)
		})
	})

	describe('bigIntOf', () => {
		test('accepts bigints', () => {
			const g = bigIntOf()
			expect(g(1n)).toBe(true)
			expect(g(BigInt(42))).toBe(true)
			expect(g(42 as unknown)).toBe(false)
		})
	})

	describe('nullOf', () => {
		test('accepts only null', () => {
			const g = nullOf()
			expect(g(null)).toBe(true)
			expect(g(undefined as unknown)).toBe(false)
			expect(g(0 as unknown)).toBe(false)
		})
	})

	describe('undefinedOf', () => {
		test('accepts only undefined', () => {
			const g = undefinedOf()
			expect(g(undefined)).toBe(true)
			expect(g(null as unknown)).toBe(false)
		})
	})

	describe('dateOf', () => {
		test('accepts Date objects', () => {
			const g = dateOf()
			expect(g(new Date())).toBe(true)
			expect(g('2024-01-01' as unknown)).toBe(false)
		})
	})

	describe('regExpOf', () => {
		test('accepts RegExp objects', () => {
			const g = regExpOf()
			expect(g(/test/)).toBe(true)
			expect(g('/test/' as unknown)).toBe(false)
		})
	})

	describe('errorOf', () => {
		test('accepts Error objects', () => {
			const g = errorOf()
			expect(g(new Error('test'))).toBe(true)
			expect(g({ message: 'test' } as unknown)).toBe(false)
		})
	})

	describe('arrayBufferOf', () => {
		test('accepts ArrayBuffer instances', () => {
			const g = arrayBufferOf()
			expect(g(new ArrayBuffer(10))).toBe(true)
			expect(g(new Uint8Array(10) as unknown)).toBe(false)
		})
	})

	describe('sharedArrayBufferOf', () => {
		test('accepts SharedArrayBuffer instances if available', () => {
			const g = sharedArrayBufferOf()
			if (typeof SharedArrayBuffer !== 'undefined') {
				expect(g(new SharedArrayBuffer(10))).toBe(true)
			}
			expect(g(new ArrayBuffer(10) as unknown)).toBe(false)
		})
	})

	describe('primitiveOf', () => {
		test('accepts primitives and functions', () => {
			const g = primitiveOf()
			expect(g('string')).toBe(true)
			expect(g(42)).toBe(true)
			expect(g(true)).toBe(true)
			expect(g(Symbol('s'))).toBe(true)
			expect(g(1n)).toBe(true)
			expect(g(() => {})).toBe(true)
			expect(g({} as unknown)).toBe(false)
			expect(g([] as unknown)).toBe(false)
		})
	})

	describe('asyncIteratorOf', () => {
		test('accepts async iterables', async () => {
			const g = asyncIteratorOf()
			async function* gen() {
				yield 1
			}
			expect(g(gen())).toBe(true)
			expect(g([] as unknown)).toBe(false)
		})
	})
})
