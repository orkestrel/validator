import { describe, test, expect } from 'vitest'
import { typedArrayOf, int8ArrayOf, uint8ArrayOf, uint8ClampedArrayOf, int16ArrayOf, uint16ArrayOf, int32ArrayOf, uint32ArrayOf, float32ArrayOf, float64ArrayOf, bigInt64ArrayOf, bigUint64ArrayOf, arrayBufferViewOf } from '../../src/combinators/arrays.js'

describe('combinators/arrays', () => {
	describe('arrayBufferViewOf', () => {
		test('accepts TypedArray and DataView instances', () => {
			const g = arrayBufferViewOf()
			expect(g(new Uint8Array(10))).toBe(true)
			expect(g(new DataView(new ArrayBuffer(10)))).toBe(true)
			expect(g(new ArrayBuffer(10) as unknown)).toBe(false)
		})
	})

	describe('typedArrayOf', () => {
		test('accepts any TypedArray', () => {
			const g = typedArrayOf()
			expect(g(new Uint8Array(10))).toBe(true)
			expect(g(new Int32Array(10))).toBe(true)
			expect(g(new Float64Array(10))).toBe(true)
			expect(g([] as unknown)).toBe(false)
		})
	})

	describe('specific typed array guards', () => {
		test('int8ArrayOf', () => {
			const g = int8ArrayOf()
			expect(g(new Int8Array(10))).toBe(true)
			expect(g(new Uint8Array(10) as unknown)).toBe(false)
		})

		test('uint8ArrayOf', () => {
			const g = uint8ArrayOf()
			expect(g(new Uint8Array(10))).toBe(true)
			expect(g(new Int8Array(10) as unknown)).toBe(false)
		})

		test('uint8ClampedArrayOf', () => {
			const g = uint8ClampedArrayOf()
			expect(g(new Uint8ClampedArray(10))).toBe(true)
			expect(g(new Uint8Array(10) as unknown)).toBe(false)
		})

		test('int16ArrayOf', () => {
			const g = int16ArrayOf()
			expect(g(new Int16Array(10))).toBe(true)
			expect(g(new Uint16Array(10) as unknown)).toBe(false)
		})

		test('uint16ArrayOf', () => {
			const g = uint16ArrayOf()
			expect(g(new Uint16Array(10))).toBe(true)
			expect(g(new Int16Array(10) as unknown)).toBe(false)
		})

		test('int32ArrayOf', () => {
			const g = int32ArrayOf()
			expect(g(new Int32Array(10))).toBe(true)
			expect(g(new Uint32Array(10) as unknown)).toBe(false)
		})

		test('uint32ArrayOf', () => {
			const g = uint32ArrayOf()
			expect(g(new Uint32Array(10))).toBe(true)
			expect(g(new Int32Array(10) as unknown)).toBe(false)
		})

		test('float32ArrayOf', () => {
			const g = float32ArrayOf()
			expect(g(new Float32Array(10))).toBe(true)
			expect(g(new Float64Array(10) as unknown)).toBe(false)
		})

		test('float64ArrayOf', () => {
			const g = float64ArrayOf()
			expect(g(new Float64Array(10))).toBe(true)
			expect(g(new Float32Array(10) as unknown)).toBe(false)
		})

		test('bigInt64ArrayOf', () => {
			const g = bigInt64ArrayOf()
			expect(g(new BigInt64Array(10))).toBe(true)
			expect(g(new BigUint64Array(10) as unknown)).toBe(false)
		})

		test('bigUint64ArrayOf', () => {
			const g = bigUint64ArrayOf()
			expect(g(new BigUint64Array(10))).toBe(true)
			expect(g(new BigInt64Array(10) as unknown)).toBe(false)
		})
	})
})
