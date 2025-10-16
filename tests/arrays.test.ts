import { describe, test, expect } from 'vitest'
import {
	isArray,
	arrayOf,
	nonEmptyArrayOf,
	tupleOf,
	isDataView,
	isTypedArray,
	isInt8Array,
	isUint8Array,
	isUint8ClampedArray,
	isInt16Array,
	isUint16Array,
	isInt32Array,
	isUint32Array,
	isFloat32Array,
	isFloat64Array,
	isBigInt64Array,
	isBigUint64Array,
} from '../src/arrays.js'
import { isString, isNumber } from '../src/primitives.js'

describe('arrays', () => {
	describe('isArray', () => {
		test('returns true for arrays', () => {
			expect(isArray([])).toBe(true)
			expect(isArray([1, 2, 3])).toBe(true)
		})

		test('returns false for non-arrays', () => {
			expect(isArray('x')).toBe(false)
			expect(isArray({})).toBe(false)
			expect(isArray(null)).toBe(false)
		})
	})

	describe('arrayOf', () => {
		test('validates array elements with guard', () => {
			const isStringArray = arrayOf(isString)
			expect(isStringArray(['a', 'b'])).toBe(true)
			expect(isStringArray([])).toBe(true)
		})

		test('returns false when element fails guard', () => {
			const isStringArray = arrayOf(isString)
			expect(isStringArray(['a', 1] as unknown[])).toBe(false)
		})

		test('returns false for non-arrays', () => {
			const isStringArray = arrayOf(isString)
			expect(isStringArray('not an array' as unknown)).toBe(false)
		})
	})

	describe('nonEmptyArrayOf', () => {
		test('validates non-empty arrays', () => {
			const isNonEmptyNumArray = nonEmptyArrayOf(isNumber)
			expect(isNonEmptyNumArray([1])).toBe(true)
			expect(isNonEmptyNumArray([1, 2, 3])).toBe(true)
		})

		test('returns false for empty arrays', () => {
			const isNonEmptyNumArray = nonEmptyArrayOf(isNumber)
			expect(isNonEmptyNumArray([])).toBe(false)
		})

		test('returns false when element fails guard', () => {
			const isNonEmptyNumArray = nonEmptyArrayOf(isNumber)
			expect(isNonEmptyNumArray([1, 'x'] as unknown[])).toBe(false)
		})
	})

	describe('tupleOf', () => {
		test('validates fixed-length tuples with correct types', () => {
			const isPoint = tupleOf(isNumber, isNumber)
			expect(isPoint([1, 2])).toBe(true)
		})

		test('returns false for wrong element types', () => {
			const isPoint = tupleOf(isNumber, isNumber)
			expect(isPoint([1, '2'] as unknown[])).toBe(false)
		})

		test('returns false for wrong tuple length', () => {
			const isPoint = tupleOf(isNumber, isNumber)
			expect(isPoint([1])).toBe(false)
			expect(isPoint([1, 2, 3])).toBe(false)
		})

		test('returns false for non-arrays', () => {
			const isPoint = tupleOf(isNumber, isNumber)
			expect(isPoint({ 0: 1, 1: 2 } as unknown)).toBe(false)
		})
	})

	describe('isDataView', () => {
		test('returns true for DataView instances', () => {
			const buf = new ArrayBuffer(8)
			expect(isDataView(new DataView(buf))).toBe(true)
		})

		test('returns false for TypedArrays', () => {
			const buf = new ArrayBuffer(8)
			expect(isDataView(new Uint8Array(buf))).toBe(false)
		})

		test('returns false for non-view objects', () => {
			expect(isDataView([])).toBe(false)
			expect(isDataView({})).toBe(false)
		})
	})

	describe('isTypedArray', () => {
		test('returns true for TypedArray instances', () => {
			expect(isTypedArray(new Uint8Array(4))).toBe(true)
			expect(isTypedArray(new Int32Array(4))).toBe(true)
			expect(isTypedArray(new Float64Array(8))).toBe(true)
		})

		test('returns false for DataView', () => {
			const buf = new ArrayBuffer(4)
			expect(isTypedArray(new DataView(buf))).toBe(false)
		})

		test('returns false for arrays and other objects', () => {
			expect(isTypedArray([])).toBe(false)
			expect(isTypedArray({})).toBe(false)
			expect(isTypedArray(null)).toBe(false)
		})
	})

	describe('isInt8Array', () => {
		test('returns true for Int8Array', () => {
			expect(isInt8Array(new Int8Array(8))).toBe(true)
		})

		test('returns false for other TypedArrays', () => {
			expect(isInt8Array(new Uint8Array(8) as unknown)).toBe(false)
			expect(isInt8Array(new Int16Array(8) as unknown)).toBe(false)
		})
	})

	describe('isUint8Array', () => {
		test('returns true for Uint8Array', () => {
			expect(isUint8Array(new Uint8Array(8))).toBe(true)
		})

		test('returns false for other TypedArrays', () => {
			expect(isUint8Array(new Int8Array(8) as unknown)).toBe(false)
			expect(isUint8Array(new Uint8ClampedArray(8) as unknown)).toBe(false)
		})
	})

	describe('isUint8ClampedArray', () => {
		test('returns true for Uint8ClampedArray', () => {
			expect(isUint8ClampedArray(new Uint8ClampedArray(8))).toBe(true)
		})

		test('returns false for other TypedArrays', () => {
			expect(isUint8ClampedArray(new Uint8Array(8) as unknown)).toBe(false)
		})
	})

	describe('isInt16Array', () => {
		test('returns true for Int16Array', () => {
			expect(isInt16Array(new Int16Array(8))).toBe(true)
		})

		test('returns false for other TypedArrays', () => {
			expect(isInt16Array(new Uint16Array(8) as unknown)).toBe(false)
		})
	})

	describe('isUint16Array', () => {
		test('returns true for Uint16Array', () => {
			expect(isUint16Array(new Uint16Array(8))).toBe(true)
		})

		test('returns false for other TypedArrays', () => {
			expect(isUint16Array(new Int16Array(8) as unknown)).toBe(false)
		})
	})

	describe('isInt32Array', () => {
		test('returns true for Int32Array', () => {
			expect(isInt32Array(new Int32Array(8))).toBe(true)
		})

		test('returns false for other TypedArrays', () => {
			expect(isInt32Array(new Uint32Array(8) as unknown)).toBe(false)
		})
	})

	describe('isUint32Array', () => {
		test('returns true for Uint32Array', () => {
			expect(isUint32Array(new Uint32Array(8))).toBe(true)
		})

		test('returns false for other TypedArrays', () => {
			expect(isUint32Array(new Int32Array(8) as unknown)).toBe(false)
		})
	})

	describe('isFloat32Array', () => {
		test('returns true for Float32Array', () => {
			expect(isFloat32Array(new Float32Array(8))).toBe(true)
		})

		test('returns false for other TypedArrays', () => {
			expect(isFloat32Array(new Float64Array(8) as unknown)).toBe(false)
		})
	})

	describe('isFloat64Array', () => {
		test('returns true for Float64Array', () => {
			expect(isFloat64Array(new Float64Array(8))).toBe(true)
		})

		test('returns false for other TypedArrays', () => {
			expect(isFloat64Array(new Float32Array(8) as unknown)).toBe(false)
		})
	})

	describe('isBigInt64Array', () => {
		test('returns true for BigInt64Array when available', () => {
			if (typeof BigInt64Array !== 'undefined') {
				expect(isBigInt64Array(new BigInt64Array(2))).toBe(true)
			}
		})

		test('returns false for other TypedArrays', () => {
			if (typeof BigInt64Array !== 'undefined' && typeof BigUint64Array !== 'undefined') {
				expect(isBigInt64Array(new BigUint64Array(2) as unknown)).toBe(false)
			}
		})

		test('returns false when BigInt64Array is unavailable', () => {
			if (typeof BigInt64Array === 'undefined') {
				expect(isBigInt64Array({} as unknown)).toBe(false)
			}
		})
	})

	describe('isBigUint64Array', () => {
		test('returns true for BigUint64Array when available', () => {
			if (typeof BigUint64Array !== 'undefined') {
				expect(isBigUint64Array(new BigUint64Array(2))).toBe(true)
			}
		})

		test('returns false for other TypedArrays', () => {
			if (typeof BigInt64Array !== 'undefined' && typeof BigUint64Array !== 'undefined') {
				expect(isBigUint64Array(new BigInt64Array(2) as unknown)).toBe(false)
			}
		})

		test('returns false when BigUint64Array is unavailable', () => {
			if (typeof BigUint64Array === 'undefined') {
				expect(isBigUint64Array({} as unknown)).toBe(false)
			}
		})
	})
})
