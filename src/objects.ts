import { countEnumerableProperties } from './helpers.js'

// --------------------------------------------
// Type guards
// --------------------------------------------

/**
 * Determine whether a value is a non-null object (arrays allowed).
 *
 * Overloads:
 * - When called with `Record<string, unknown>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to object.
 *
 * @param x - Value to test
 * @returns True if `x` is a non-null object
 * @example
 * ```ts
 * isObject({}) // true
 * isObject([]) // true
 * ```
 */
export function isObject(x: Record<string, unknown>): boolean
export function isObject(x: unknown): x is Record<string, unknown>
export function isObject(x: unknown): boolean {
	return typeof x === 'object' && x !== null
}

/**
 * Determine whether a value is a plain record (non-array object).
 *
 * Overloads:
 * - When called with `Record<string, unknown>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to plain record.
 *
 * @param x - Value to test
 * @returns True if `x` is an object and not an array
 * @example
 * ```ts
 * isRecord({}) // true
 * isRecord([]) // false
 * ```
 */
export function isRecord(x: Record<string, unknown>): boolean
export function isRecord(x: unknown): x is Record<string, unknown>
export function isRecord(x: unknown): boolean {
	return typeof x === 'object' && x !== null && !Array.isArray(x)
}

// --------------------------------------------
// Count helpers
// --------------------------------------------

/**
 * Check the exact count of own enumerable properties on a plain object.
 *
 * Counts enumerable string keys and enumerable symbol keys. Arrays and non-objects are rejected.
 *
 * Overloads:
 * - When called with `Record<string | symbol, unknown>`, preserves the object type.
 * - When called with `unknown`, narrows to `Record<string | symbol, unknown>`.
 *
 * @param x - Value to test (plain object)
 * @param n - Exact required count (integer ≥ 0)
 * @returns True when the count of own enumerable properties equals `n`
 * @example
 * ```ts
 * const s = Symbol('s')
 * const o: Record<string | symbol, unknown> = { a: 1 }
 * Object.defineProperty(o, s, { value: 1, enumerable: true })
 * isCount(o, 2) // true
 * ```
 */
export function isCount<T extends Record<string | symbol, unknown>>(x: T, n: number): x is T
export function isCount(x: unknown, n: number): x is Record<string | symbol, unknown>
export function isCount(x: unknown, n: number): boolean {
	if (!isRecord(x)) return false
	return countEnumerableProperties(x) === n
}

/**
 * Check whether a plain object owns a number of enumerable properties within the inclusive range [min, max].
 *
 * Counts enumerable string keys and enumerable symbol keys. Arrays and non-objects are rejected.
 *
 * Overloads:
 * - When called with `Record<string | symbol, unknown>`, preserves the object type.
 * - When called with `unknown`, narrows to `Record<string | symbol, unknown>`.
 *
 * @param x - Value to test (plain object)
 * @param min - Minimum inclusive count
 * @param max - Maximum inclusive count
 * @returns True when `min <= count <= max`
 * @example
 * ```ts
 * const sym = Symbol('s')
 * const obj: Record<string | symbol, unknown> = { a: 1 }
 * Object.defineProperty(obj, sym, { value: 1, enumerable: true })
 * isCountRange(obj, 2, 3) // true
 * isCountRange(obj, 3, 3) // false
 * ```
 */
export function isCountRange<T extends Record<string | symbol, unknown>>(x: T, min: number, max: number): x is T
export function isCountRange(x: unknown, min: number, max: number): x is Record<string | symbol, unknown>
export function isCountRange(x: unknown, min: number, max: number): boolean {
	if (!isRecord(x)) return false
	const c = countEnumerableProperties(x)
	return c >= min && c <= max
}
