import { isRecord } from './objects.js'

/**
 * Determine whether a value is empty.
 *
 * - string: `length === 0`
 * - array: `length === 0`
 * - Map/Set: `size === 0`
 * - object: no own enumerable string or symbol keys
 * - other values: false
 *
 * @param x - Value to check
 * @returns True if the value is considered empty
 * @example
 * ```ts
 * isEmpty('') // true
 * isEmpty([]) // true
 * ```
 */
export function isEmpty(x: unknown): boolean {
	if (typeof x === 'string') return x.length === 0
	if (Array.isArray(x)) return x.length === 0
	if (x instanceof Map || x instanceof Set) return x.size === 0
	if (isRecord(x)) {
		if (Object.keys(x).length > 0) return false
		const syms = Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable)
		return syms.length === 0
	}
	return false
}

/**
 * Determine whether a value is an empty string (`length === 0`).
 *
 * @param x - Value to check
 * @returns True if `x` is an empty string
 * @example
 * ```ts
 * isEmptyString('') // true
 * ```
 */
export function isEmptyString(x: unknown): x is string {
	return typeof x === 'string' && x.length === 0
}

/**
 * Determine whether a value is an empty array (`length === 0`).
 *
 * @param x - Value to check
 * @returns True if `x` is an empty array
 * @example
 * ```ts
 * isEmptyArray([]) // true
 * ```
 */
export function isEmptyArray(x: unknown): x is readonly [] {
	return Array.isArray(x) && x.length === 0
}

/**
 * Determine whether a value is an empty object (no own enumerable string or symbol keys).
 *
 * @param x - Value to check
 * @returns True if `x` is an empty object
 * @example
 * ```ts
 * isEmptyObject({}) // true
 * ```
 */
export function isEmptyObject(x: unknown): x is Record<string | symbol, never> {
	if (!isRecord(x)) return false
	if (Object.keys(x).length > 0) return false
	const syms = Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable)
	return syms.length === 0
}

/**
 * Determine whether a value is an empty Map (`size === 0`).
 *
 * @param x - Value to check
 * @returns True if `x` is an empty Map
 * @example
 * ```ts
 * isEmptyMap(new Map()) // true
 * ```
 */
export function isEmptyMap<K = unknown, V = unknown>(x: unknown): x is ReadonlyMap<K, V> {
	return x instanceof Map && x.size === 0
}

/**
 * Determine whether a value is an empty Set (`size === 0`).
 *
 * @param x - Value to check
 * @returns True if `x` is an empty Set
 * @example
 * ```ts
 * isEmptySet(new Set()) // true
 * ```
 */
export function isEmptySet<T = unknown>(x: unknown): x is ReadonlySet<T> {
	return x instanceof Set && x.size === 0
}

/**
 * Determine whether a value is a non-empty string (`length > 0`).
 *
 * @param x - Value to check
 * @returns True if `x` is a non-empty string
 * @example
 * ```ts
 * isNonEmptyString('a') // true
 * ```
 */
export function isNonEmptyString(x: unknown): x is string {
	return typeof x === 'string' && x.length > 0
}

/**
 * Determine whether a value is a non-empty array (`length > 0`).
 *
 * @param x - Value to check
 * @returns True if `x` is a non-empty array
 * @example
 * ```ts
 * isNonEmptyArray([1]) // true
 * ```
 */
export function isNonEmptyArray<T = unknown>(x: unknown): x is ReadonlyArray<T> {
	return Array.isArray(x) && x.length > 0
}

/**
 * Determine whether a value is a non-empty object (has at least one own enumerable key or symbol).
 *
 * @param x - Value to check
 * @returns True if `x` is a non-empty object
 * @example
 * ```ts
 * isNonEmptyObject({ a: 1 }) // true
 * ```
 */
export function isNonEmptyObject(x: unknown): x is Record<string | symbol, unknown> {
	if (!isRecord(x)) return false
	if (Object.keys(x).length > 0) return true
	const syms = Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable)
	return syms.length > 0
}

/**
 * Determine whether a value is a non-empty Map (`size > 0`).
 *
 * @param x - Value to check
 * @returns True if `x` is a non-empty Map
 * @example
 * ```ts
 * isNonEmptyMap(new Map([['a',1]])) // true
 * ```
 */
export function isNonEmptyMap<K = unknown, V = unknown>(x: unknown): x is ReadonlyMap<K, V> {
	return x instanceof Map && x.size > 0
}

/**
 * Determine whether a value is a non-empty Set (`size > 0`).
 *
 * @param x - Value to check
 * @returns True if `x` is a non-empty Set
 * @example
 * ```ts
 * isNonEmptySet(new Set([1])) // true
 * ```
 */
export function isNonEmptySet<T = unknown>(x: unknown): x is ReadonlySet<T> {
	return x instanceof Set && x.size > 0
}
