import type { AnyTypedArray } from './types.js'

/**
 * Determine whether a value is an array.
 *
 * Overloads:
 * - When called with `readonly T[]`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `readonly T[]`.
 *
 * @param x - Value to test
 * @returns True if `x` is an array
 * @example
 * ```ts
 * isArray([]) // true
 * isArray({}) // false
 * ```
 */
export function isArray<_T = unknown>(x: ReadonlyArray<_T>): boolean
export function isArray<_T = unknown>(x: unknown): x is ReadonlyArray<_T>
export function isArray<_T = unknown>(x: unknown): boolean {
	return Array.isArray(x)
}

/**
 * Determine whether a value is a DataView instance.
 *
 * Overloads:
 * - When called with `DataView`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `DataView`.
 *
 * @param x - Value to test
 * @returns True if `x` is a `DataView`
 * @example
 * ```ts
 * isDataView(new DataView(new ArrayBuffer(8))) // true
 * isDataView(new Uint8Array(4)) // false
 * ```
 */
export function isDataView(x: DataView<ArrayBufferLike>): boolean
export function isDataView(x: unknown): x is DataView<ArrayBufferLike>
export function isDataView(x: unknown): boolean {
	return x instanceof DataView
}

/**
 * Determine whether a value is an ArrayBuffer view (TypedArray or DataView).
 *
 * Uses `ArrayBuffer.isView(x)` to detect whether `x` is any view over an ArrayBuffer.
 * This returns true for both TypedArray instances and DataView.
 *
 * @param x - Value to test
 * @returns True if `x` is an ArrayBuffer view
 * @example
 * ```ts
 * isArrayBufferView(new Uint8Array()) // true
 * isArrayBufferView(new DataView(new ArrayBuffer(8))) // true
 * isArrayBufferView([]) // false
 * ```
 */
export function isArrayBufferView(x: ArrayBufferView): boolean
export function isArrayBufferView(x: unknown): x is ArrayBufferView
export function isArrayBufferView(x: unknown): boolean {
	return ArrayBuffer.isView(x)
}

/**
 * Determine whether a value is any TypedArray (Int8Array, Uint8Array, Float32Array, BigInt64Array, etc.).
 *
 * Uses `isArrayBufferView(x)` to gate out non-views, then excludes `DataView` and finally
 * checks the presence of a numeric `constructor.BYTES_PER_ELEMENT` to positively identify
 * TypedArray instances in a portable way.
 *
 * @param x - Value to test
 * @returns True if `x` is a concrete TypedArray instance (not a DataView)
 * @example
 * ```ts
 * isTypedArray(new Uint8Array()) // true
 * isTypedArray(new DataView(new ArrayBuffer(8))) // false
 * isTypedArray([]) // false
 * ```
 */
export function isTypedArray(x: unknown): x is AnyTypedArray {
	if (!isArrayBufferView(x)) return false
	if (isDataView(x)) return false
	const ctor = (x as { constructor?: { BYTES_PER_ELEMENT?: unknown } }).constructor
	return typeof ctor?.BYTES_PER_ELEMENT === 'number'
}

/**
 * Determine whether a value is an Int8Array.
 *
 * Overloads:
 * - When called with `Int8Array`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `Int8Array`.
 *
 * @param x - Value to test
 * @returns True if `x` is an `Int8Array`
 * @example
 * ```ts
 * isInt8Array(new Int8Array()) // true
 * isInt8Array(new Uint8Array()) // false
 * ```
 */
export function isInt8Array(x: Int8Array): boolean
export function isInt8Array(x: unknown): x is Int8Array
export function isInt8Array(x: unknown): boolean {
	return x instanceof Int8Array
}

/**
 * Determine whether a value is a Uint8Array.
 *
 * @param x - Value to test
 * @returns True if `x` is a `Uint8Array`
 * @example
 * ```ts
 * isUint8Array(new Uint8Array()) // true
 * isUint8Array(new Int8Array()) // false
 * ```
 */
export function isUint8Array(x: Uint8Array): boolean
export function isUint8Array(x: unknown): x is Uint8Array
export function isUint8Array(x: unknown): boolean {
	return x instanceof Uint8Array
}

/**
 * Determine whether a value is a Uint8ClampedArray.
 *
 * @param x - Value to test
 * @returns True if `x` is a `Uint8ClampedArray`
 * @example
 * ```ts
 * isUint8ClampedArray(new Uint8ClampedArray()) // true
 * isUint8ClampedArray(new Uint8Array()) // false
 * ```
 */
export function isUint8ClampedArray(x: Uint8ClampedArray): boolean
export function isUint8ClampedArray(x: unknown): x is Uint8ClampedArray
export function isUint8ClampedArray(x: unknown): boolean {
	return x instanceof Uint8ClampedArray
}

/**
 * Determine whether a value is an Int16Array.
 *
 * @param x - Value to test
 * @returns True if `x` is an `Int16Array`
 * @example
 * ```ts
 * isInt16Array(new Int16Array()) // true
 * isInt16Array(new Uint16Array()) // false
 * ```
 */
export function isInt16Array(x: Int16Array): boolean
export function isInt16Array(x: unknown): x is Int16Array
export function isInt16Array(x: unknown): boolean {
	return x instanceof Int16Array
}

/**
 * Determine whether a value is a Uint16Array.
 *
 * @param x - Value to test
 * @returns True if `x` is a `Uint16Array`
 * @example
 * ```ts
 * isUint16Array(new Uint16Array()) // true
 * isUint16Array(new Int16Array()) // false
 * ```
 */
export function isUint16Array(x: Uint16Array): boolean
export function isUint16Array(x: unknown): x is Uint16Array
export function isUint16Array(x: unknown): boolean {
	return x instanceof Uint16Array
}

/**
 * Determine whether a value is an Int32Array.
 *
 * @param x - Value to test
 * @returns True if `x` is an `Int32Array`
 * @example
 * ```ts
 * isInt32Array(new Int32Array()) // true
 * isInt32Array(new Uint32Array()) // false
 * ```
 */
export function isInt32Array(x: Int32Array): boolean
export function isInt32Array(x: unknown): x is Int32Array
export function isInt32Array(x: unknown): boolean {
	return x instanceof Int32Array
}

/**
 * Determine whether a value is a Uint32Array.
 *
 * @param x - Value to test
 * @returns True if `x` is a `Uint32Array`
 * @example
 * ```ts
 * isUint32Array(new Uint32Array()) // true
 * isUint32Array(new Int32Array()) // false
 * ```
 */
export function isUint32Array(x: Uint32Array): boolean
export function isUint32Array(x: unknown): x is Uint32Array
export function isUint32Array(x: unknown): boolean {
	return x instanceof Uint32Array
}

/**
 * Determine whether a value is a Float32Array.
 *
 * @param x - Value to test
 * @returns True if `x` is a `Float32Array`
 * @example
 * ```ts
 * isFloat32Array(new Float32Array()) // true
 * isFloat32Array(new Float64Array()) // false
 * ```
 */
export function isFloat32Array(x: Float32Array): boolean
export function isFloat32Array(x: unknown): x is Float32Array
export function isFloat32Array(x: unknown): boolean {
	return x instanceof Float32Array
}

/**
 * Determine whether a value is a Float64Array.
 *
 * @param x - Value to test
 * @returns True if `x` is a `Float64Array`
 * @example
 * ```ts
 * isFloat64Array(new Float64Array()) // true
 * isFloat64Array(new Float32Array()) // false
 * ```
 */
export function isFloat64Array(x: Float64Array): boolean
export function isFloat64Array(x: unknown): x is Float64Array
export function isFloat64Array(x: unknown): boolean {
	return x instanceof Float64Array
}

/**
 * Determine whether a value is a BigInt64Array.
 *
 * This guard is resilient to environments that do not support BigInt typed arrays
 * by first checking for the global constructor before using `instanceof`.
 *
 * @param x - Value to test
 * @returns True if `x` is a `BigInt64Array`
 * @example
 * ```ts
 * isBigInt64Array(typeof BigInt64Array !== 'undefined' ? new BigInt64Array() : undefined) // true or false depending on support
 * ```
 */
export function isBigInt64Array(x: BigInt64Array): boolean
export function isBigInt64Array(x: unknown): x is BigInt64Array
export function isBigInt64Array(x: unknown): boolean {
	return typeof BigInt64Array !== 'undefined' && x instanceof BigInt64Array
}

/**
 * Determine whether a value is a BigUint64Array.
 *
 * This guard is resilient to environments that do not support BigInt typed arrays
 * by first checking for the global constructor before using `instanceof`.
 *
 * @param x - Value to test
 * @returns True if `x` is a `BigUint64Array`
 * @example
 * ```ts
 * isBigUint64Array(typeof BigUint64Array !== 'undefined' ? new BigUint64Array() : undefined) // true or false depending on support
 * ```
 */
export function isBigUint64Array(x: BigUint64Array): boolean
export function isBigUint64Array(x: unknown): x is BigUint64Array
export function isBigUint64Array(x: unknown): boolean {
	return typeof BigUint64Array !== 'undefined' && x instanceof BigUint64Array
}
