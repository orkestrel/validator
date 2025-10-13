import type { Guard } from './types.js'

/**
 * Determine whether a value implements the iterable protocol.
 *
 * A value is considered iterable when it is non-nullish and has a
 * callable `[Symbol.iterator]` method.
 *
 * @param x - Value to test
 * @returns True if `x` is iterable
 * @example
 * ```ts
 * isIterable([1, 2, 3]) // true
 * isIterable(new Set([1])) // true
 * isIterable({}) // false
 * ```
 */
export function isIterable<T = unknown>(x: unknown): x is Iterable<T> {
	return x != null && typeof (x as { [Symbol.iterator]?: unknown })[Symbol.iterator] === 'function'
}

/**
 * Create a guard that validates every element of an iterable using the provided element guard.
 *
 * Note: This will iterate and fully consume the iterable (if it is single-pass).
 *
 * @param elemGuard - Guard used to validate each element
 * @returns Guard that accepts iterables whose elements all pass `elemGuard`
 * @example
 * ```ts
 * import { iterableOf } from '@orkestrel/validator'
 * import { isNumber } from './primitives.js'
 *
 * const numbers = iterableOf(isNumber)
 * numbers(new Set([1, 2])) // true
 * numbers(['a', 2]) // false
 * ```
 */
export function iterableOf<T>(elemGuard: Guard<T>): Guard<Iterable<T>> {
	return (x: unknown): x is Iterable<T> => {
		if (!isIterable<T>(x)) return false
		for (const v of x as Iterable<unknown>) {
			if (!elemGuard(v)) return false
		}
		return true
	}
}
