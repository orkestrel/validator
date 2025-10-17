import type { Guard, EmptyOf } from '../types.js'
import { isEmpty } from '../emptiness.js'
import { isIterable } from '../primitives.js'
import { isRecord } from '../objects.js'
import { countEnumerableProperties, peekIterable } from '../helpers.js'

/**
 * Accept either an empty value or a value that passes guard `g`.
 *
 * @param g - Guard for non-empty variant
 * @returns Guard that accepts empty shapes (empty string, empty array, etc.) or values passing `g`
 * @example
 * ```ts
 * const S = emptyOf(stringOf())
 * S('') // true
 * S('abc') // true
 * ```
 */
export function emptyOf<T>(g: Guard<T>): Guard<T | EmptyOf<T>> {
	return (x: unknown): x is T | EmptyOf<T> => isEmpty(x) || g(x)
}

/**
 * Require non-emptiness for empty-able shapes, then apply `g`.
 * Uses a small iterator peek for generic Iterables.
 *
 * @param g - Base guard applied after non-emptiness is established
 * @returns Guard for non-empty values matching `g`
 * @example
 * ```ts
 * const NonEmptyNumbers = nonEmptyOf(arrayOf(isNumber))
 * NonEmptyNumbers([1]) // true
 * NonEmptyNumbers([]) // false
 * ```
 */
export function nonEmptyOf<T>(g: Guard<T>): Guard<T> {
	return (x: unknown): x is T => {
		// Strings
		if (typeof x === 'string') return x.length > 0 && g(x)
		// Arrays
		if (Array.isArray(x)) return x.length > 0 && g(x)
		// Map/Set
		if (x instanceof Map) return x.size > 0 && g(x)
		if (x instanceof Set) return x.size > 0 && g(x)
		// Generic Iterable (custom types)
		if (isIterable(x)) {
			const { empty, replay } = peekIterable(x)
			return !empty && g(replay as unknown as T)
		}
		// Plain objects: require at least one own enumerable key/symbol
		if (isRecord(x)) return countEnumerableProperties(x) > 0 && g(x)
		// Other shapes: pass through
		return g(x)
	}
}
