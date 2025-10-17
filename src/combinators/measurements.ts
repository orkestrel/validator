import type { Guard, MeasureKind } from '../types.js'
import { isString, isFunction } from '../primitives.js'
import { isArray } from '../arrays.js'
import { isSet, isMap } from '../collections.js'
import { isRecord } from '../objects.js'
import {
	isCount,
	isCountMax,
	isCountMin,
	isCountRange,
	isLength,
	isLengthMax,
	isLengthMin,
	isLengthRange,
	isSize,
	isSizeMax,
	isSizeMin,
	isSizeRange,
	isMeasure,
	isMin,
	isMax,
	isRange,
} from '../measurements.js'
import { isFiniteNumber } from '../numbers.js'

/**
 * Validate the exact length of strings, arrays, and function arity (via `.length`).
 *
 * @param n - Exact length
 * @returns Guard for strings/arrays/functions with length exactly `n`
 * @example
 * ```ts
 * lengthOf(2)('ab') // true
 * ```
 */
export function lengthOf(n: number): Guard<string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown>> {
	return (x: unknown): x is string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> => isLength(x, n)
}

/**
 * Validate the exact size of Maps and Sets.
 *
 * @param n - Exact size
 * @returns Guard for Map/Set with size exactly `n`
 * @example
 * ```ts
 * sizeOf(2)(new Set([1,2])) // true
 * ```
 */
export function sizeOf(n: number): Guard<ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>> {
	return (x: unknown): x is ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> => isSize(x, n)
}

/**
 * Validate the exact property count of plain objects (own enumerable keys + enumerable symbols).
 *
 * @param n - Exact property count
 * @returns Guard for objects with exactly `n` enumerable properties
 * @example
 * ```ts
 * const sym = Symbol('s'); const obj: Record<string|symbol, unknown> = { a: 1 }; Object.defineProperty(obj, sym, { value: 1, enumerable: true })
 * countOf(2)(obj) // true
 * ```
 */
export function countOf(n: number): Guard<Record<string | symbol, unknown>> {
	return (x: unknown): x is Record<string | symbol, unknown> => isCount(x, n)
}

// Minimum measure comparator (unified or composed)
export function minOf(min: number): Guard<number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>>
export function minOf<T>(base: Guard<T>, kind: MeasureKind, min: number): Guard<T>
/**
 * Minimum measure across supported shapes (number value, string/array length, Map/Set size, object count),
 * or compose with a base guard and a specific measure kind.
 *
 * Overloads:
 * - minOf(min) → unified guard for numbers/lengths/sizes/counts
 * - minOf(base, kind, min) → refined guard preserving base type
 *
 * @param a - Either the minimum number (unified mode), or the base guard (composed mode)
 * @param kind - When composing with a base guard, the measure kind to compare (e.g., 'length' | 'size' | 'count' | 'value')
 * @param min - When composing with a base guard, the minimum to enforce for the given kind
 * @returns Guard that accepts values whose measure is at least `min`
 * @example
 * ```ts
 * minOf(2)('ab') // true
 * minOf(objectOf({ id: isString }), 'count', 1)({ id: 'x' }) // true
 * ```
 */
export function minOf<T>(a: number | Guard<T>, kind?: MeasureKind, min?: number): Guard<unknown> {
	if (typeof a === 'function' && kind && typeof min === 'number') {
		const base = a as Guard<T>
		return (x: unknown): x is T => base(x) && isMin(x, kind, min)
	}
	const m = a as number
	return (x: unknown): x is number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> => {
		if (typeof x === 'number') return x >= m
		if (isString(x) || isFunction(x) || isArray(x)) return isLengthMin(x, m)
		if (isMap(x) || isSet(x)) return isSizeMin(x, m)
		if (isRecord(x)) return isCountMin(x, m)
		return false
	}
}

// Maximum measure comparator (unified or composed)
export function maxOf(max: number): Guard<number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>>
export function maxOf<T>(base: Guard<T>, kind: MeasureKind, max: number): Guard<T>
/**
 * Maximum measure across supported shapes (number value, string/array length, Map/Set size, object count),
 * or compose with a base guard and a specific measure kind.
 *
 * Overloads:
 * - maxOf(max) → unified guard for numbers/lengths/sizes/counts
 * - maxOf(base, kind, max) → refined guard preserving base type
 *
 * @param a - Either the maximum number (unified mode), or the base guard (composed mode)
 * @param kind - When composing with a base guard, the measure kind to compare (e.g., 'length' | 'size' | 'count' | 'value')
 * @param max - When composing with a base guard, the maximum to enforce for the given kind
 * @returns Guard that accepts values whose measure is at most `max`
 * @example
 * ```ts
 * maxOf(2)('abc') // false
 * maxOf(arrayOf(isNumber), 'length', 1)([1]) // true
 * ```
 */
export function maxOf<T>(a: number | Guard<T>, kind?: MeasureKind, max?: number): Guard<unknown> {
	if (typeof a === 'function' && kind && typeof max === 'number') {
		const base = a as Guard<T>
		return (x: unknown): x is T => base(x) && isMax(x, kind, max)
	}
	const m = a as number
	return (x: unknown): x is number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> => {
		if (typeof x === 'number') return x <= m
		if (isString(x) || isFunction(x) || isArray(x)) return isLengthMax(x, m)
		if (isMap(x) || isSet(x)) return isSizeMax(x, m)
		if (isRecord(x)) return isCountMax(x, m)
		return false
	}
}

// Inclusive range comparator (unified or composed)
export function rangeOf(min: number, max: number): Guard<number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>>
export function rangeOf<T>(base: Guard<T>, kind: MeasureKind, min: number, max: number): Guard<T>
/**
 * Inclusive range across supported shapes (number value, string/array length, Map/Set size, object count),
 * or compose with a base guard and a specific measure kind.
 *
 * Overloads:
 * - rangeOf(min, max) → unified guard for numbers/lengths/sizes/counts
 * - rangeOf(base, kind, min, max) → refined guard preserving base type
 *
 * @param a - Either the minimum number (unified mode) or the base guard (composed mode)
 * @param b - Either the maximum number (unified mode) or the measure kind when composing with a base guard
 * @param c - When composing with a base guard, the inclusive minimum for the given kind
 * @param d - When composing with a base guard, the inclusive maximum for the given kind
 * @returns Guard that accepts values whose measure is within the inclusive range
 * @example
 * ```ts
 * rangeOf(1, 3)(2) // true
 * rangeOf(stringOf(), 'length', 2, 3)('abc') // true
 * ```
 */
export function rangeOf<T>(a: number | Guard<T>, b: number | MeasureKind, c?: number, d?: number): Guard<unknown> {
	if (typeof a === 'function' && typeof b === 'string' && typeof c === 'number' && typeof d === 'number') {
		const base = a as Guard<T>
		const kind = b as MeasureKind
		return (x: unknown): x is T => base(x) && isRange(x, kind, c, d)
	}
	const min = a as number
	const max = b as number
	return (x: unknown): x is number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> => {
		if (typeof x === 'number') return x >= min && x <= max
		if (isString(x) || isFunction(x) || isArray(x)) return isLengthRange(x, min, max)
		if (isMap(x) || isSet(x)) return isSizeRange(x, min, max)
		if (isRecord(x)) return isCountRange(x, min, max)
		return false
	}
}

/**
 * Number multiple check.
 *
 * @param m - Divisor (must be finite and non-zero)
 * @returns Guard for numbers that are exact multiples of `m`
 * @example
 * ```ts
 * multipleOf(3)(9) // true
 * multipleOf(3)(10) // false
 * ```
 */
export function multipleOf(m: number): Guard<number> {
	return (x: unknown): x is number => isFiniteNumber(x) && m !== 0 && x % m === 0
}

/**
 * Create a guard that accepts values whose unified measure equals `n`,
 * or compose with a base guard and a specific measure kind.
 *
 * Overloads:
 * - measureOf(n) → unified guard for numbers/lengths/sizes/counts equal to `n`
 * - measureOf(base, kind, n) → refined guard preserving base type
 *
 * Measure rules:
 * - number → value
 * - string/array → length
 * - Map/Set → size
 * - plain object → own enumerable keys + enumerable symbols count
 *
 * @param a - Either the exact measure to match (unified mode), or the base guard (composed mode)
 * @param kind - When composing with a base guard, the measure kind to compare (e.g., 'length' | 'size' | 'count' | 'value')
 * @param n - When composing with a base guard, the exact measure to require for the given kind
 * @returns Guard that accepts values whose measure equals `n`
 * @example
 * ```ts
 * const m2 = measureOf(2)
 * m2('ab') // true
 * m2(new Set([1, 2])) // true
 * ```
 */
export function measureOf(n: number): Guard<string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>>
export function measureOf<T>(base: Guard<T>, kind: MeasureKind, n: number): Guard<T>
export function measureOf<T>(a: number | Guard<T>, kind?: MeasureKind, n?: number): Guard<unknown> {
	if (typeof a === 'function' && kind && typeof n === 'number') {
		const base = a as Guard<T>
		return (x: unknown): x is T => base(x) && isMeasure(x, kind, n)
	}
	const exact = a as number
	return (x: unknown): x is string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> =>
		(typeof x === 'number' && x === exact) || isLength(x, exact) || isSize(x, exact) || isCount(x, exact)
}
