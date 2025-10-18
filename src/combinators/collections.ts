import type { Guard } from '../types.js'

/**
 * Guard for WeakSet instances with optional proof-based element validation.
 *
 * Since WeakSet is not enumerable, this guard always validates the instance type.
 * When `proof` is provided, the guard will check each element in `proof` that exists
 * in the set against `elemGuard`.
 *
 * Overloads:
 * - weakSetOf(elemGuard, proof?) → typed WeakSet guard with optional proof
 * - weakSetOf(elemPredicate, proof?) → untyped WeakSet guard with optional proof
 *
 * @param elemGuard - Guard or predicate for set elements
 * @param proof - Optional iterable of candidate elements to validate if present in the set
 * @returns Guard for `WeakSet<T>` (or `WeakSet<unknown>` for predicates)
 * @example
 * ```ts
 * const obj1 = { id: 1 }
 * const obj2 = { id: 2 }
 * const ws = new WeakSet([obj1])
 * const g = weakSetOf(isObject, [obj1, obj2])
 * g(ws) // true (obj1 is in set and passes guard)
 * ```
 */
export function weakSetOf<T extends object>(elemGuard: Guard<T>, proof?: Iterable<unknown>): Guard<WeakSet<T>>
export function weakSetOf(elemPredicate: (x: unknown) => boolean, proof?: Iterable<unknown>): Guard<WeakSet<object>>
export function weakSetOf(elemGuardOrPred: (x: unknown) => boolean, proof?: Iterable<unknown>): Guard<WeakSet<object>> {
	return (x: unknown): x is WeakSet<object> => {
		if (!(x instanceof WeakSet)) return false
		if (!proof) return true
		for (const candidate of proof) {
			if (typeof candidate !== 'object' || candidate === null) continue
			if ((x as WeakSet<object>).has(candidate as object)) {
				if (!elemGuardOrPred(candidate)) return false
			}
		}
		return true
	}
}

/**
 * Guard for WeakMap instances with optional proof-based key/value validation.
 *
 * Since WeakMap is not enumerable, this guard always validates the instance type.
 * When `proofKeys` is provided, the guard will check each key in `proofKeys` that exists
 * in the map, validating both the key and its corresponding value.
 *
 * Overloads:
 * - weakMapOf(keyGuard, valueGuard, proofKeys?) → typed WeakMap guard with optional proof
 * - weakMapOf(keyPredicate, valuePredicate, proofKeys?) → untyped WeakMap guard with optional proof
 *
 * @param keyGuard - Guard or predicate for map keys
 * @param valueGuard - Guard or predicate for map values
 * @param proofKeys - Optional iterable of candidate keys to validate if present in the map
 * @returns Guard for `WeakMap<K, V>` (or `WeakMap<object, unknown>` for predicates)
 * @example
 * ```ts
 * const key1 = { id: 1 }
 * const key2 = { id: 2 }
 * const wm = new WeakMap([[key1, 'value1']])
 * const g = weakMapOf(isObject, isString, [key1, key2])
 * g(wm) // true (key1 is in map and both key and value pass guards)
 * ```
 */
export function weakMapOf<K extends object, V>(keyGuard: Guard<K>, valueGuard: Guard<V>, proofKeys?: Iterable<K>): Guard<WeakMap<K, V>>
export function weakMapOf(keyPredicate: (x: unknown) => boolean, valuePredicate: (x: unknown) => boolean, proofKeys?: Iterable<unknown>): Guard<WeakMap<object, unknown>>
export function weakMapOf(keyGuardOrPred: (x: unknown) => boolean, valueGuardOrPred: (x: unknown) => boolean, proofKeys?: Iterable<unknown>): Guard<WeakMap<object, unknown>> {
	return (x: unknown): x is WeakMap<object, unknown> => {
		if (!(x instanceof WeakMap)) return false
		if (!proofKeys) return true
		for (const candidate of proofKeys) {
			if (typeof candidate !== 'object' || candidate === null) continue
			if ((x as WeakMap<object, unknown>).has(candidate as object)) {
				if (!keyGuardOrPred(candidate)) return false
				const value = (x as WeakMap<object, unknown>).get(candidate as object)
				if (!valueGuardOrPred(value)) return false
			}
		}
		return true
	}
}
