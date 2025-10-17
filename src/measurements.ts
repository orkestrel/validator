import { countEnumerableProperties } from './helpers'
import { isRecord } from './objects'
import type { MeasureKind } from './types'

/**
 * Check the exact length of strings and arrays.
 *
 * Overloads:
 * - When called with `ReadonlyArray<T>`, returns a type predicate preserving `T`.
 * - When called with `unknown`, narrows to `string | readonly unknown[]`.
 *
 * @param x - Value to test (string or array)
 * @param n - Exact required length (integer ≥ 0)
 * @returns True when `length(x) === n`
 * @example
 * ```ts
 * isLength('ab', 2) // true
 * isLength(['a','b','c'], 3) // true
 * isLength([], 1) // false
 * ```
 */
export function isLength<T>(x: ReadonlyArray<T>, n: number): x is ReadonlyArray<T>
export function isLength(x: string, n: number): x is string
export function isLength(x: (...args: readonly unknown[]) => unknown, n: number): x is (...args: readonly unknown[]) => unknown
export function isLength(x: unknown, n: number): x is string | ReadonlyArray<unknown>
export function isLength(x: unknown, n: number): boolean {
	if (typeof x === 'string') return x.length === n
	if (Array.isArray(x)) return x.length === n
	if (typeof x === 'function') return x.length === n
	return false
}

/**
 * Check whether strings and arrays have a length at least `min` (inclusive).
 *
 * Overloads:
 * - When called with `ReadonlyArray<T>`, returns a type predicate preserving `T`.
 * - When called with `unknown`, narrows to `string | readonly unknown[]`.
 *
 * @param x - Value to test (string or array)
 * @param min - Minimum inclusive length
 * @returns True when `length(x) >= min`
 * @example
 * ```ts
 * isLengthMin('ab', 2) // true
 * isLengthMin([1], 2) // false
 * ```
 */
export function isLengthMin<T>(x: ReadonlyArray<T>, min: number): x is ReadonlyArray<T>
export function isLengthMin(x: string, min: number): x is string
export function isLengthMin(x: (...args: readonly unknown[]) => unknown, min: number): x is (...args: readonly unknown[]) => unknown
export function isLengthMin(x: unknown, min: number): x is string | ReadonlyArray<unknown>
export function isLengthMin(x: unknown, min: number): boolean {
	if (typeof x === 'string') return x.length >= min
	if (Array.isArray(x)) return x.length >= min
	if (typeof x === 'function') return x.length >= min
	return false
}

/**
 * Check whether strings and arrays have a length at most `max` (inclusive).
 *
 * Overloads:
 * - When called with `ReadonlyArray<T>`, returns a type predicate preserving `T`.
 * - When called with `unknown`, narrows to `string | readonly unknown[]`.
 *
 * @param x - Value to test (string or array)
 * @param max - Maximum inclusive length
 * @returns True when `length(x) <= max`
 * @example
 * ```ts
 * isLengthMax('ab', 2) // true
 * isLengthMax([1,2,3], 2) // false
 * ```
 */
export function isLengthMax<T>(x: ReadonlyArray<T>, max: number): x is ReadonlyArray<T>
export function isLengthMax(x: string, max: number): x is string
export function isLengthMax(x: (...args: readonly unknown[]) => unknown, max: number): x is (...args: readonly unknown[]) => unknown
export function isLengthMax(x: unknown, max: number): x is string | ReadonlyArray<unknown>
export function isLengthMax(x: unknown, max: number): boolean {
	if (typeof x === 'string') return x.length <= max
	if (Array.isArray(x)) return x.length <= max
	if (typeof x === 'function') return x.length <= max
	return false
}

/**
 * Check whether strings and arrays have a length within the inclusive range [min, max].
 *
 * Overloads:
 * - When called with `ReadonlyArray<T>`, returns a type predicate preserving `T`.
 * - When called with `unknown`, narrows to `string | readonly unknown[]`.
 *
 * @param x - Value to test (string or array)
 * @param min - Minimum inclusive length
 * @param max - Maximum inclusive length
 * @returns True when `min <= length(x) <= max`
 * @example
 * ```ts
 * isLengthRange('ab', 2, 3) // true
 * isLengthRange([1, 2, 3], 2, 3) // true
 * isLengthRange('a', 2, 3) // false
 * ```
 */
export function isLengthRange<T>(x: ReadonlyArray<T>, min: number, max: number): x is ReadonlyArray<T>
export function isLengthRange(x: string, min: number, max: number): x is string
export function isLengthRange(x: (...args: readonly unknown[]) => unknown, min: number, max: number): x is (...args: readonly unknown[]) => unknown
export function isLengthRange(x: unknown, min: number, max: number): x is string | ReadonlyArray<unknown>
export function isLengthRange(x: unknown, min: number, max: number): boolean {
	if (typeof x === 'string') return x.length >= min && x.length <= max
	if (Array.isArray(x)) return x.length >= min && x.length <= max
	if (typeof x === 'function') {
		const a = x.length
		return a >= min && a <= max
	}
	return false
}

/**
 * Check the exact size of Map and Set collections.
 *
 * Overloads:
 * - When called with `ReadonlySet<T>`, preserves `T`.
 * - When called with `ReadonlyMap<K, V>`, preserves `K` and `V`.
 * - When called with `unknown`, narrows to `ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>`.
 *
 * @param x - Value to test (Map or Set)
 * @param n - Exact required size (integer ≥ 0)
 * @returns True when `size(x) === n`
 * @example
 * ```ts
 * isSize(new Set([1,2]), 2) // true
 * isSize(new Map([[1,'a']]), 1) // true
 * isSize(new Set(), 3) // false
 * ```
 */
export function isSize<T>(x: ReadonlySet<T>, n: number): x is ReadonlySet<T>
export function isSize<K, V>(x: ReadonlyMap<K, V>, n: number): x is ReadonlyMap<K, V>
export function isSize(x: unknown, n: number): x is ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
export function isSize(x: unknown, n: number): boolean {
	if (x instanceof Map) return x.size === n
	if (x instanceof Set) return x.size === n
	return false
}

/**
 * Check whether Map and Set collections have size at least `min` (inclusive).
 *
 * Overloads:
 * - When called with `ReadonlySet<T>`, preserves `T`.
 * - When called with `ReadonlyMap<K,V>`, preserves `K` and `V`.
 * - When called with `unknown`, narrows to `ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>`.
 *
 * @param x - Value to test (Map or Set)
 * @param min - Minimum inclusive size
 * @returns True when `size(x) >= min`
 * @example
 * ```ts
 * isSizeMin(new Set([1]), 1) // true
 * isSizeMin(new Map(), 1) // false
 * ```
 */
export function isSizeMin<T>(x: ReadonlySet<T>, min: number): x is ReadonlySet<T>
export function isSizeMin<K, V>(x: ReadonlyMap<K, V>, min: number): x is ReadonlyMap<K, V>
export function isSizeMin(x: unknown, min: number): x is ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
export function isSizeMin(x: unknown, min: number): boolean {
	if (x instanceof Map) return x.size >= min
	if (x instanceof Set) return x.size >= min
	return false
}

/**
 * Check whether Map and Set collections have size at most `max` (inclusive).
 *
 * Overloads:
 * - When called with `ReadonlySet<T>`, preserves `T`.
 * - When called with `ReadonlyMap<K,V>`, preserves `K` and `V`.
 * - When called with `unknown`, narrows to `ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>`.
 *
 * @param x - Value to test (Map or Set)
 * @param max - Maximum inclusive size
 * @returns True when `size(x) <= max`
 * @example
 * ```ts
 * isSizeMax(new Set([1,2,3]), 2) // false
 * isSizeMax(new Map([[1,'a']]), 1) // true
 * ```
 */
export function isSizeMax<T>(x: ReadonlySet<T>, max: number): x is ReadonlySet<T>
export function isSizeMax<K, V>(x: ReadonlyMap<K, V>, max: number): x is ReadonlyMap<K, V>
export function isSizeMax(x: unknown, max: number): x is ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
export function isSizeMax(x: unknown, max: number): boolean {
	if (x instanceof Map) return x.size <= max
	if (x instanceof Set) return x.size <= max
	return false
}

/**
 * Check whether Map and Set collections have a size within the inclusive range [min, max].
 *
 * Overloads:
 * - When called with `ReadonlySet<T>`, preserves `T`.
 * - When called with `ReadonlyMap<K,V>`, preserves `K` and `V`.
 * - When called with `unknown`, narrows to `ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>`.
 *
 * @param x - Value to test (Map or Set)
 * @param min - Minimum inclusive size
 * @param max - Maximum inclusive size
 * @returns True when `min <= size(x) <= max`
 * @example
 * ```ts
 * isSizeRange(new Set([1]), 1, 3) // true
 * isSizeRange(new Map([[1,'a']]), 2, 3) // false
 * ```
 */
export function isSizeRange<T>(x: ReadonlySet<T>, min: number, max: number): x is ReadonlySet<T>
export function isSizeRange<K, V>(x: ReadonlyMap<K, V>, min: number, max: number): x is ReadonlyMap<K, V>
export function isSizeRange(x: unknown, min: number, max: number): x is ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
export function isSizeRange(x: unknown, min: number, max: number): boolean {
	if (x instanceof Map) return x.size >= min && x.size <= max
	if (x instanceof Set) return x.size >= min && x.size <= max
	return false
}

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
 * Check whether a plain object owns at least `min` enumerable properties (inclusive).
 *
 * Counts enumerable string keys and enumerable symbol keys. Arrays and non-objects are rejected.
 *
 * Overloads:
 * - When called with `Record<string | symbol, unknown>`, preserves the object type.
 * - When called with `unknown`, narrows to `Record<string | symbol, unknown>`.
 *
 * @param x - Value to test (plain object)
 * @param min - Minimum inclusive count
 * @returns True when `count >= min`
 * @example
 * ```ts
 * const obj: Record<string | symbol, unknown> = { a: 1 }
 * isCountMin(obj, 1) // true
 * isCountMin({}, 1) // false
 * ```
 */
export function isCountMin<T extends Record<string | symbol, unknown>>(x: T, min: number): x is T
export function isCountMin(x: unknown, min: number): x is Record<string | symbol, unknown>
export function isCountMin(x: unknown, min: number): boolean {
	if (!isRecord(x)) return false
	return countEnumerableProperties(x) >= min
}

/**
 * Check whether a plain object owns at most `max` enumerable properties (inclusive).
 *
 * Counts enumerable string keys and enumerable symbol keys. Arrays and non-objects are rejected.
 *
 * Overloads:
 * - When called with `Record<string | symbol, unknown>`, preserves the object type.
 * - When called with `unknown`, narrows to `Record<string | symbol, unknown>`.
 *
 * @param x - Value to test (plain object)
 * @param max - Maximum inclusive count
 * @returns True when `count <= max`
 * @example
 * ```ts
 * const obj: Record<string | symbol, unknown> = { a: 1 }
 * isCountMax(obj, 2) // true
 * isCountMax({ a: 1, b: 2, c: 3 }, 2) // false
 * ```
 */
export function isCountMax<T extends Record<string | symbol, unknown>>(x: T, max: number): x is T
export function isCountMax(x: unknown, max: number): x is Record<string | symbol, unknown>
export function isCountMax(x: unknown, max: number): boolean {
	if (!isRecord(x)) return false
	return countEnumerableProperties(x) <= max
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

/**
 * Check whether a value's unified measure equals `expected`.
 *
 * Kinds:
 * - 'value'  → numbers (identity)
 * - 'length' → strings, arrays, functions (arity via `.length`)
 * - 'size'   → Map/Set (`.size`)
 * - 'count'  → objects (own enumerable keys + enumerable symbols)
 * @param x
 * @param kind
 * @param expected
 * @example
 */
export function isMeasure(x: unknown, kind: MeasureKind, expected: number): boolean {
	if (kind === 'value') return typeof x === 'number' && x === expected
	if (kind === 'length') return isLength(x as unknown, expected)
	if (kind === 'size') return isSize(x as unknown, expected)
	if (kind === 'count') return isCount(x as unknown, expected)
	return false
}

/**
 * Check whether a value's unified measure is at least `min` (inclusive).
 * @param x
 * @param kind
 * @param min
 * @example
 */
export function isMin(x: unknown, kind: MeasureKind, min: number): boolean {
	if (kind === 'value') return typeof x === 'number' && x >= min
	if (kind === 'length') return isLengthMin(x as unknown, min)
	if (kind === 'size') return isSizeMin(x as unknown, min)
	if (kind === 'count') return isCountMin(x as unknown, min)
	return false
}

/**
 * Check whether a value's unified measure is at most `max` (inclusive).
 * @param x
 * @param kind
 * @param max
 * @example
 */
export function isMax(x: unknown, kind: MeasureKind, max: number): boolean {
	if (kind === 'value') return typeof x === 'number' && x <= max
	if (kind === 'length') return isLengthMax(x as unknown, max)
	if (kind === 'size') return isSizeMax(x as unknown, max)
	if (kind === 'count') return isCountMax(x as unknown, max)
	return false
}

/**
 * Check whether a value's unified measure is within the inclusive range [min, max].
 * @param x
 * @param kind
 * @param min
 * @param max
 * @example
 */
export function isRange(x: unknown, kind: MeasureKind, min: number, max: number): boolean {
	if (kind === 'value') return typeof x === 'number' && x >= min && x <= max
	if (kind === 'length') return isLengthRange(x as unknown, min, max)
	if (kind === 'size') return isSizeRange(x as unknown, min, max)
	if (kind === 'count') return isCountRange(x as unknown, min, max)
	return false
}
