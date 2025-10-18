import type { Guard } from '../types.js'
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

/**
 * Auto-detect the measure of a value and return its numeric representation.
 * - number → value itself
 * - string/array/function → .length
 * - Map/Set → .size
 * - plain object (record) → own enumerable property count
 *
 * @param x - Value to measure
 * @returns The numeric measure, or undefined if not measurable
 */
function getMeasure(x: unknown): number | undefined {
	if (typeof x === 'number') return x
	if (isString(x) || isFunction(x) || isArray(x)) return (x as { length: number }).length
	if (isMap(x) || isSet(x)) return (x as { size: number }).size
	if (isRecord(x)) {
		const keys = Object.keys(x)
		const symbols = Object.getOwnPropertySymbols(x).filter(s => Object.prototype.propertyIsEnumerable.call(x, s))
		return keys.length + symbols.length
	}
	return undefined
}

// Minimum measure comparator (unified or composed)
export function minOf(min: number): Guard<number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>>
export function minOf<T>(base: Guard<T>, min: number): Guard<T>
/**
 * Minimum measure across supported shapes (number value, string/array length, Map/Set size, object count),
 * or compose with a base guard that auto-detects the measure.
 *
 * Overloads:
 * - minOf(min) → unified guard for numbers/lengths/sizes/counts
 * - minOf(base, min) → refined guard preserving base type with auto-detected measure
 *
 * @param a - Either the minimum number (unified mode), or the base guard (composed mode)
 * @param min - When composing with a base guard, the minimum to enforce (auto-detected measure)
 * @returns Guard that accepts values whose measure is at least `min`
 * @example
 * ```ts
 * minOf(2)('ab') // true
 * minOf(objectOf({ id: isString }), 1)({ id: 'x' }) // true (auto-detects property count)
 * ```
 */
export function minOf<T>(a: number | Guard<T>, min?: number): Guard<unknown> {
	if (typeof a === 'function' && typeof min === 'number') {
		const base = a as Guard<T>
		return (x: unknown): x is T => {
			if (!base(x)) return false
			const measure = getMeasure(x)
			return measure !== undefined && measure >= min
		}
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
export function maxOf<T>(base: Guard<T>, max: number): Guard<T>
/**
 * Maximum measure across supported shapes (number value, string/array length, Map/Set size, object count),
 * or compose with a base guard that auto-detects the measure.
 *
 * Overloads:
 * - maxOf(max) → unified guard for numbers/lengths/sizes/counts
 * - maxOf(base, max) → refined guard preserving base type with auto-detected measure
 *
 * @param a - Either the maximum number (unified mode), or the base guard (composed mode)
 * @param max - When composing with a base guard, the maximum to enforce (auto-detected measure)
 * @returns Guard that accepts values whose measure is at most `max`
 * @example
 * ```ts
 * maxOf(2)('abc') // false
 * maxOf(arrayOf(isNumber), 1)([1]) // true (auto-detects array length)
 * ```
 */
export function maxOf<T>(a: number | Guard<T>, max?: number): Guard<unknown> {
	if (typeof a === 'function' && typeof max === 'number') {
		const base = a as Guard<T>
		return (x: unknown): x is T => {
			if (!base(x)) return false
			const measure = getMeasure(x)
			return measure !== undefined && measure <= max
		}
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
export function rangeOf<T>(base: Guard<T>, min: number, max: number): Guard<T>
/**
 * Inclusive range across supported shapes (number value, string/array length, Map/Set size, object count),
 * or compose with a base guard that auto-detects the measure.
 *
 * Overloads:
 * - rangeOf(min, max) → unified guard for numbers/lengths/sizes/counts
 * - rangeOf(base, min, max) → refined guard preserving base type with auto-detected measure
 *
 * @param a - Either the minimum number (unified mode) or the base guard (composed mode)
 * @param b - Either the maximum number (unified mode) or the minimum when composing with a base guard
 * @param c - When composing with a base guard, the inclusive maximum (auto-detected measure)
 * @returns Guard that accepts values whose measure is within the inclusive range
 * @example
 * ```ts
 * rangeOf(1, 3)(2) // true
 * rangeOf(isString, 2, 3)('abc') // true (auto-detects string length)
 * ```
 */
export function rangeOf<T>(a: number | Guard<T>, b: number, c?: number): Guard<unknown> {
	if (typeof a === 'function' && typeof b === 'number' && typeof c === 'number') {
		const base = a as Guard<T>
		const min = b
		const max = c
		return (x: unknown): x is T => {
			if (!base(x)) return false
			const measure = getMeasure(x)
			return measure !== undefined && measure >= min && measure <= max
		}
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
 * or compose with a base guard that auto-detects the measure.
 *
 * Overloads:
 * - measureOf(n) → unified guard for numbers/lengths/sizes/counts equal to `n`
 * - measureOf(base, n) → refined guard preserving base type with auto-detected measure
 *
 * Measure rules:
 * - number → value
 * - string/array/function → length
 * - Map/Set → size
 * - plain object → own enumerable keys + enumerable symbols count
 *
 * @param a - Either the exact measure to match (unified mode), or the base guard (composed mode)
 * @param n - When composing with a base guard, the exact measure to require (auto-detected)
 * @returns Guard that accepts values whose measure equals `n`
 * @example
 * ```ts
 * const m2 = measureOf(2)
 * m2('ab') // true
 * m2(new Set([1, 2])) // true
 * measureOf(isString, 3)('abc') // true (auto-detects string length)
 * ```
 */
export function measureOf(n: number): Guard<string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>>
export function measureOf<T>(base: Guard<T>, n: number): Guard<T>
export function measureOf<T>(a: number | Guard<T>, n?: number): Guard<unknown> {
	if (typeof a === 'function' && typeof n === 'number') {
		const base = a as Guard<T>
		return (x: unknown): x is T => {
			if (!base(x)) return false
			const measure = getMeasure(x)
			return measure === n
		}
	}
	const exact = a as number
	return (x: unknown): x is string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> =>
		(typeof x === 'number' && x === exact) || isLength(x, exact) || isSize(x, exact) || isCount(x, exact)
}
