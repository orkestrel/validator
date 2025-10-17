import type { Guard } from '../types.js'
import { isArrayBufferView, isTypedArray, isInt8Array, isUint8Array, isUint8ClampedArray, isInt16Array, isUint16Array, isInt32Array, isUint32Array, isFloat32Array, isFloat64Array, isBigInt64Array, isBigUint64Array } from '../arrays.js'

/** Guard for any ArrayBuffer view (TypedArray or DataView). */
export function arrayBufferViewOf(): Guard<ArrayBufferView> {
	return (x: unknown): x is ArrayBufferView => isArrayBufferView(x)
}

/** Guard for any concrete TypedArray instance. */
export function typedArrayOf(): Guard<Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array> {
	return (x: unknown) => isTypedArray(x)
}

/** Guard for Int8Array. */
export function int8ArrayOf(): Guard<Int8Array> { return (x: unknown) => isInt8Array(x) }
/** Guard for Uint8Array. */
export function uint8ArrayOf(): Guard<Uint8Array> { return (x: unknown) => isUint8Array(x) }
/** Guard for Uint8ClampedArray. */
export function uint8ClampedArrayOf(): Guard<Uint8ClampedArray> { return (x: unknown) => isUint8ClampedArray(x) }
/** Guard for Int16Array. */
export function int16ArrayOf(): Guard<Int16Array> { return (x: unknown) => isInt16Array(x) }
/** Guard for Uint16Array. */
export function uint16ArrayOf(): Guard<Uint16Array> { return (x: unknown) => isUint16Array(x) }
/** Guard for Int32Array. */
export function int32ArrayOf(): Guard<Int32Array> { return (x: unknown) => isInt32Array(x) }
/** Guard for Uint32Array. */
export function uint32ArrayOf(): Guard<Uint32Array> { return (x: unknown) => isUint32Array(x) }
/** Guard for Float32Array. */
export function float32ArrayOf(): Guard<Float32Array> { return (x: unknown) => isFloat32Array(x) }
/** Guard for Float64Array. */
export function float64ArrayOf(): Guard<Float64Array> { return (x: unknown) => isFloat64Array(x) }
/** Guard for BigInt64Array. */
export function bigInt64ArrayOf(): Guard<BigInt64Array> { return (x: unknown) => isBigInt64Array(x) }
/** Guard for BigUint64Array. */
export function bigUint64ArrayOf(): Guard<BigUint64Array> { return (x: unknown) => isBigUint64Array(x) }
