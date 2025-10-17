import type { Guard } from '../types.js'
import { isString, isNumber, isSymbol, isBoolean, isBigInt, isDate, isRegExp, isError, isArrayBuffer, isSharedArrayBuffer, isPrimitive, isAsyncIterator } from '../primitives.js'

/**
 * Guard for the `string` type (accepts any string).
 *
 * @returns Guard for strings
 * @example
 * ```ts
 * const g = stringOf()
 * g('ok') // true
 * g(123 as unknown) // false
 * ```
 */
export function stringOf(): Guard<string> {
	return (x: unknown) => isString(x)
}

/**
 * Guard for the `number` type (accepts any number).
 *
 * @returns Guard for numbers
 * @example
 * ```ts
 * const g = numberOf()
 * g(42) // true
 * g('42' as unknown) // false
 * ```
 */
export function numberOf(): Guard<number> {
	return (x: unknown) => isNumber(x)
}

/**
 * Guard for the `symbol` type.
 *
 * @returns Guard for symbols
 * @example
 * ```ts
 * const g = symbolOf()
 * g(Symbol('x')) // true
 * g(42 as unknown) // false
 * g('42' as unknown) // false
 * ```
 */
export function symbolOf(): Guard<symbol> {
	return (x: unknown) => isSymbol(x)
}

/**
 * Guard for `boolean` values.
 *
 * @returns Guard for booleans
 * @example
 * ```ts
 * const g = booleanOf()
 * g(true) // true
 * g(false) // true
 * g(0 as unknown) // false
 * ```
 */
export function booleanOf(): Guard<boolean> {
	return (x: unknown) => isBoolean(x)
}

/**
 * Guard for `bigint` values.
 *
 * @returns Guard for bigint
 * @example
 * ```ts
 * bigIntOf()(1n) // true
 * bigIntOf()('1' as unknown) // false
 * ```
 */
export function bigIntOf(): Guard<bigint> {
	return (x: unknown) => isBigInt(x)
}

/**
 * Guard for `null` only.
 * @returns Guard
 * @example
 * ```ts
 * nullOf()(null) // true
 * ```
 */
export function nullOf(): Guard<null> {
	return (x: unknown): x is null => x === null
}

/**
 * Guard for `undefined` only.
 * @returns Guard
 * @example
 * ```ts
 * undefinedOf()(undefined) // true
 * ```
 */
export function undefinedOf(): Guard<undefined> {
	return (x: unknown): x is undefined => x === undefined
}

/**
 * Guard for Date objects.
 * @returns Guard
 * @example
 * ```ts
 * dateOf()(new Date()) // true
 * ```
 */
export function dateOf(): Guard<Date> {
	return (x: unknown) => isDate(x)
}

/**
 * Guard for RegExp objects.
 * @returns Guard
 * @example
 * ```ts
 * regExpOf()(/test/) // true
 * ```
 */
export function regExpOf(): Guard<RegExp> {
	return (x: unknown) => isRegExp(x)
}

/**
 * Guard for Error objects.
 * @returns Guard
 * @example
 * ```ts
 * errorOf()(new Error()) // true
 * ```
 */
export function errorOf(): Guard<Error> {
	return (x: unknown) => isError(x)
}

/**
 * Guard for ArrayBuffer instances.
 * @returns Guard
 * @example
 * ```ts
 * arrayBufferOf()(new ArrayBuffer(10)) // true
 * ```
 */
export function arrayBufferOf(): Guard<ArrayBuffer> {
	return (x: unknown) => isArrayBuffer(x)
}

/**
 * Guard for SharedArrayBuffer instances (feature-detected).
 * @returns Guard
 * @example
 * ```ts
 * sharedArrayBufferOf()(new SharedArrayBuffer(10)) // true
 * ```
 */
export function sharedArrayBufferOf(): Guard<SharedArrayBuffer> {
	return (x: unknown) => isSharedArrayBuffer(x)
}

/**
 * Guard for primitive values per `typeof` (string, number, boolean, symbol, bigint) and function.
 *
 * @returns Guard for primitive or function values
 * @example
 * ```ts
 * primitiveOf()('hello') // true
 * primitiveOf()({} as unknown) // false
 * ```
 */
export function primitiveOf(): Guard<string | number | boolean | symbol | bigint | ((...args: unknown[]) => unknown)> {
	return (x: unknown): x is string | number | boolean | symbol | bigint | ((...args: unknown[]) => unknown) => isPrimitive(x)
}

/**
 * Guard for AsyncIterable values.
 *
 * @returns Guard for `AsyncIterable<unknown>`
 * @example
 * ```ts
 * async function* agen() { yield 1 }
 * asyncIteratorOf()(agen()) // true
 * ```
 */
export function asyncIteratorOf(): Guard<AsyncIterable<unknown>> {
	return (x: unknown): x is AsyncIterable<unknown> => isAsyncIterator(x)
}
