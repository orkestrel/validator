import { test, expect } from 'vitest'
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

test('isArray', () => {
	expect(isArray([])).toBe(true)
	expect(isArray('x')).toBe(false)
})

test('arrayOf', () => {
	const isStringArray = arrayOf(isString)
	expect(isStringArray(['a', 'b'])).toBe(true)
	expect(isStringArray(['a', 1] as unknown[])).toBe(false)
})

test('nonEmptyArrayOf', () => {
	const isNonEmptyNumArray = nonEmptyArrayOf(isNumber)
	expect(isNonEmptyNumArray([1])).toBe(true)
	expect(isNonEmptyNumArray([])).toBe(false)
})

test('tupleOf', () => {
	const isPoint = tupleOf(isNumber, isNumber)
	expect(isPoint([1, 2])).toBe(true)
	expect(isPoint([1, '2'] as unknown[])).toBe(false)
})

// New: DataView and TypedArray guards

test('isDataView', () => {
	const buf = new ArrayBuffer(8)
	expect(isDataView(new DataView(buf))).toBe(true)
	expect(isDataView(new Uint8Array(buf))).toBe(false)
})

test('isTypedArray generic', () => {
	const buf = new ArrayBuffer(4)
	expect(isTypedArray(new Uint8Array(buf))).toBe(true)
	expect(isTypedArray(new DataView(buf))).toBe(false)
	expect(isTypedArray([])).toBe(false)
})

test('specific TypedArray guards', () => {
	const b = new ArrayBuffer(8)
	expect(isInt8Array(new Int8Array(b))).toBe(true)
	expect(isUint8Array(new Uint8Array(b))).toBe(true)
	expect(isUint8ClampedArray(new Uint8ClampedArray(b))).toBe(true)
	expect(isInt16Array(new Int16Array(b))).toBe(true)
	expect(isUint16Array(new Uint16Array(b))).toBe(true)
	expect(isInt32Array(new Int32Array(b))).toBe(true)
	expect(isUint32Array(new Uint32Array(b))).toBe(true)
	expect(isFloat32Array(new Float32Array(b))).toBe(true)
	expect(isFloat64Array(new Float64Array(b))).toBe(true)

	// BigInt typed arrays may be unavailable in some environments
	if (typeof BigInt64Array !== 'undefined') {
		expect(isBigInt64Array(new BigInt64Array(2))).toBe(true)
	}
	if (typeof BigUint64Array !== 'undefined') {
		expect(isBigUint64Array(new BigUint64Array(2))).toBe(true)
	}

	// Negative checks
	expect(isInt8Array(new Uint8Array(b) as unknown)).toBe(false)
	expect(isUint8Array(new Int8Array(b) as unknown)).toBe(false)
	expect(isUint8ClampedArray(new Uint8Array(b) as unknown)).toBe(false)
	expect(isInt16Array(new Uint16Array(b) as unknown)).toBe(false)
	expect(isUint16Array(new Int16Array(b) as unknown)).toBe(false)
	expect(isInt32Array(new Uint32Array(b) as unknown)).toBe(false)
	expect(isUint32Array(new Int32Array(b) as unknown)).toBe(false)
	expect(isFloat32Array(new Float64Array(b) as unknown)).toBe(false)
	expect(isFloat64Array(new Float32Array(b) as unknown)).toBe(false)
})
