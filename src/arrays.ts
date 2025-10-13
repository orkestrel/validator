import type { Guard } from './types.js'
import { isRecord } from './objects.js'

/**
 * Determine whether a value is an array.
 *
 * @param x - Value to test
 * @returns True if `x` is an array
 * @example
 * ```ts
 * isArray([]) // true
 * isArray({}) // false
 * ```
 */
export function isArray<T = unknown>(x: unknown): x is ReadonlyArray<T> {
	return Array.isArray(x)
}

/**
 * Create a guard for an array whose elements satisfy the provided element guard.
 *
 * @param elem - Guard to validate each element
 * @returns Guard that accepts arrays of `T`
 * @example
 * ```ts
 * import { arrayOf } from '@orkestrel/validator'
 * import { isString } from './primitives.js'
 *
 * const strings = arrayOf(isString)
 * strings(['a', 'b']) // true
 * strings([1, 'b']) // false
 * ```
 */
export function arrayOf<T>(elem: Guard<T>): Guard<ReadonlyArray<T>> {
	return (x: unknown): x is ReadonlyArray<T> => Array.isArray(x) && x.every(elem)
}

/**
 * Create a guard for a non-empty array whose elements satisfy the provided element guard.
 *
 * @param elem - Guard to validate each element
 * @returns Guard that accepts non-empty arrays of `T`
 * @example
 * ```ts
 * import { nonEmptyArrayOf } from '@orkestrel/validator'
 * import { isNumber } from './primitives.js'
 *
 * const onePlus = nonEmptyArrayOf(isNumber)
 * onePlus([1]) // true
 * onePlus([]) // false
 * ```
 */
export function nonEmptyArrayOf<T>(elem: Guard<T>): Guard<readonly [T, ...T[]]> {
	return (x: unknown): x is readonly [T, ...T[]] => Array.isArray(x) && x.length > 0 && x.every(elem)
}

/**
 * Create a guard for a fixed-length tuple with per-index guards.
 *
 * @param guards - Guards for each tuple element
 * @returns Guard that accepts tuples matching the provided guards
 * @example
 * ```ts
 * import { tupleOf } from '@orkestrel/validator'
 * import { isNumber, isString } from './primitives.js'
 *
 * const isPoint = tupleOf(isNumber, isNumber)
 * isPoint([1, 2]) // true
 * isPoint([1, '2']) // false
 *
 * const pair = tupleOf(isNumber, isString)
 * pair([3, 'x']) // true
 * ```
 */
export function tupleOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<{ readonly [K in keyof Gs]: Gs[K] extends Guard<infer T> ? T : never }> {
	return (x: unknown): x is { readonly [K in keyof Gs]: Gs[K] extends Guard<infer T> ? T : never } => {
		if (!Array.isArray(x) || x.length !== guards.length) return false
		for (let i = 0; i < guards.length; i++) {
			const guard = guards[i]
			if (!guard || !guard(x[i])) return false
		}
		return true
	}
}

/**
 * Create a guard for a plain-object record whose values match a guard.
 *
 * Note: This checks that the input is a non-array object and that all own
 * enumerable string keys have values accepted by `valueGuard`.
 *
 * @param valueGuard - Guard for property values
 * @returns Guard that accepts records of `T`
 * @example
 * ```ts
 * import { recordOf } from '@orkestrel/validator'
 * import { isString } from './primitives.js'
 *
 * const record = recordOf(isString)
 * record({ a: 'x', b: 'y' }) // true
 * record({ a: 1 }) // false
 * ```
 */
export function recordOf<T>(valueGuard: Guard<T>): Guard<Record<string, T>> {
	return (x: unknown): x is Record<string, T> => {
		if (!isRecord(x)) return false
		for (const k of Object.keys(x)) {
			if (!valueGuard((x as Record<string, unknown>)[k])) return false
		}
		return true
	}
}
