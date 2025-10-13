import type { Guard } from './types.js'

/**
 * Determine whether a value is a Map.
 *
 * @param x - Value to check
 * @returns True if `x` is a Map
 * @example
 * ```ts
 * isMap(new Map()) // true
 * isMap({}) // false
 * ```
 */
export function isMap<K = unknown, V = unknown>(x: unknown): x is ReadonlyMap<K, V> {
	return x instanceof Map
}

/**
 * Determine whether a value is a Set.
 *
 * @param x - Value to check
 * @returns True if `x` is a Set
 * @example
 * ```ts
 * isSet(new Set()) // true
 * isSet([]) // false
 * ```
 */
export function isSet<T = unknown>(x: unknown): x is ReadonlySet<T> {
	return x instanceof Set
}

/**
 * Determine whether a value is a WeakMap.
 *
 * @param x - Value to check
 * @returns True if `x` is a WeakMap
 * @example
 * ```ts
 * isWeakMap(new WeakMap()) // true
 * isWeakMap(new Map()) // false
 * ```
 */
export function isWeakMap(x: unknown): x is WeakMap<object, unknown> {
	return x instanceof WeakMap
}

/**
 * Determine whether a value is a WeakSet.
 *
 * @param x - Value to check
 * @returns True if `x` is a WeakSet
 * @example
 * ```ts
 * isWeakSet(new WeakSet()) // true
 * isWeakSet(new Set()) // false
 * ```
 */
export function isWeakSet(x: unknown): x is WeakSet<object> {
	return x instanceof WeakSet
}

/**
 * Create a guard for a Map whose keys and values satisfy the given guards.
 *
 * @param keyGuard - Guard that validates map keys
 * @param valueGuard - Guard that validates map values
 * @returns A guard that checks a ReadonlyMap with validated keys and values
 * @example
 * ```ts
 * const g = mapOf(isString, isNumber)
 * g(new Map([['a', 1]])) // true
 * ```
 */
export function mapOf<K, V>(keyGuard: Guard<K>, valueGuard: Guard<V>): Guard<ReadonlyMap<K, V>> {
	return (x: unknown): x is ReadonlyMap<K, V> => {
		if (!(x instanceof Map)) return false
		for (const [k, v] of x as Map<unknown, unknown>) {
			if (!keyGuard(k) || !valueGuard(v)) return false
		}
		return true
	}
}

/**
 * Create a guard for a Set whose elements satisfy the given guard.
 *
 * @param elemGuard - Guard that validates set elements
 * @returns A guard that checks a ReadonlySet with validated elements
 * @example
 * ```ts
 * const g = setOf(isNumber)
 * g(new Set([1, 2])) // true
 * ```
 */
export function setOf<T>(elemGuard: Guard<T>): Guard<ReadonlySet<T>> {
	return (x: unknown): x is ReadonlySet<T> => {
		if (!(x instanceof Set)) return false
		for (const v of x as Set<unknown>) {
			if (!elemGuard(v)) return false
		}
		return true
	}
}

/**
 * Create a guard for a non-empty Set whose elements satisfy the given guard.
 *
 * @param elemGuard - Guard that validates set elements
 * @returns A guard that checks a non-empty ReadonlySet with validated elements
 * @example
 * ```ts
 * const g = nonEmptySetOf(isString)
 * g(new Set(['a'])) // true
 * g(new Set()) // false
 * ```
 */
export function nonEmptySetOf<T>(elemGuard: Guard<T>): Guard<ReadonlySet<T>> {
	return (x: unknown): x is ReadonlySet<T> => {
		if (!(x instanceof Set) || x.size === 0) return false
		for (const v of x as Set<unknown>) {
			if (!elemGuard(v)) return false
		}
		return true
	}
}
