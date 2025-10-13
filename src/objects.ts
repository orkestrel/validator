import type { Guard } from './types.js'

/**
 * Determine whether a value is a non-null object (arrays allowed).
 *
 * @param x - Value to test
 * @returns True if `x` is a non-null object
 * @example
 * ```ts
 * isObject({}) // true
 * isObject([]) // true
 * ```
 */
export function isObject(x: unknown): x is Record<string, unknown> {
	return typeof x === 'object' && x !== null
}

/**
 * Determine whether a value is a plain record (non-array object).
 *
 * @param x - Value to test
 * @returns True if `x` is an object and not an array
 * @example
 * ```ts
 * isRecord({}) // true
 * isRecord([]) // false
 * ```
 */
export function isRecord(x: unknown): x is Record<string, unknown> {
	return typeof x === 'object' && x !== null && !Array.isArray(x)
}

/**
 * hasOwn with overloads that preserve the original type where known.
 *
 * Checks whether `obj` owns the provided key(s). When used with a single key
 * the type predicate narrows the object to include that property.
 *
 * @param obj - Value to check
 * @param key - One or more keys to require on the object
 * @returns True when all provided keys exist as own properties on `obj`
 * @example
 * ```ts
 * hasOwn({ a: 1 }, 'a') // true
 * hasOwn({}, 'a') // false
 * ```
 */
export function hasOwn<K extends PropertyKey>(obj: unknown, key: K): obj is Record<K, unknown>
export function hasOwn<Ks extends readonly PropertyKey[]>(obj: unknown, ...keys: Ks): obj is { [P in Ks[number]]: unknown }
export function hasOwn<T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown>
export function hasOwn<T extends object, Ks extends readonly PropertyKey[]>(obj: T, ...keys: Ks): obj is T & { [P in Ks[number]]: unknown }
export function hasOwn(obj: unknown, ...keys: readonly PropertyKey[]): boolean {
	if (!isRecord(obj)) return false
	for (const k of keys) if (!Object.prototype.hasOwnProperty.call(obj, k)) return false
	return true
}

/**
 * Object must own only the specified keys (no extras).
 *
 * @param obj - Value to check
 * @param keys - Exact allowed keys
 * @returns True when `obj` is an object and owns exactly the provided keys
 * @example
 * ```ts
 * hasOnlyKeys({ a: 1 }, 'a') // true
 * hasOnlyKeys({ a: 1, b: 2 }, 'a') // false
 * ```
 */
export function hasOnlyKeys<Ks extends readonly PropertyKey[]>(obj: unknown, ...keys: Ks): obj is { [P in Ks[number]]: unknown } {
	if (!isRecord(obj)) return false
	const objKeys = Object.keys(obj)
	if (objKeys.length !== keys.length) return false
	for (const k of keys) if (!Object.prototype.hasOwnProperty.call(obj, k)) return false
	return true
}

/**
 * Create a guard that tests membership in the keys of a provided object literal.
 *
 * @param obj - Object to derive keys from
 * @returns A guard that returns true for values that are keys of `obj`
 * @example
 * ```ts
 * const g = keyOf({ a: 1, b: 2 })
 * g('a') // true
 * ```
 */
export function keyOf<const O extends Readonly<Record<PropertyKey, unknown>>>(obj: O): Guard<keyof O> {
	return (x: unknown): x is keyof O => (typeof x === 'string' || typeof x === 'symbol' || typeof x === 'number') && x in obj
}

/**
 * Opposite of hasOwn: returns true if object owns none of the provided keys.
 *
 * @param obj - Value to check
 * @param keys - Keys that must not be present
 * @returns True when `obj` does not own any of the provided keys
 * @example
 * ```ts
 * hasNo({ a: 1 }, 'b') // true
 * hasNo({ a: 1 }, 'a') // false
 * ```
 */
export function hasNo(obj: unknown, ...keys: readonly PropertyKey[]): boolean {
	if (!isRecord(obj)) return false
	for (const k of keys) if (Object.prototype.hasOwnProperty.call(obj, k)) return false
	return true
}
