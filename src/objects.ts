// --------------------------------------------
// Internal helpers (exported for internal use by combinators)
// --------------------------------------------

/**
 * Count own enumerable string keys and enumerable symbol keys on an object.
 *
 * Internal helper exported for use by combinators.ts. Counts both enumerable
 * string keys (via Object.keys) and enumerable symbol keys.
 *
 * @internal
 * @param obj - Object to count keys on
 * @returns Total count of enumerable string and symbol keys
 * @example
 * ```ts
 * ownEnumerableCount({ a: 1, b: 2 }) // 2
 * ```
 */
export function ownEnumerableCount(obj: object): number {
	const keysLen = Object.keys(obj).length
	const symsLen = Object.getOwnPropertySymbols(obj).reduce(
		(acc, s) => acc + (Object.getOwnPropertyDescriptor(obj, s)?.enumerable ? 1 : 0),
		0,
	)
	return keysLen + symsLen
}

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

/**
 * hasOwn with overloads that preserve the original type where known.
 *
 * Checks whether `obj` owns the provided key(s). When used with a single key
 * the type predicate narrows the object to include that property.
 *
 * @param obj - Value to check
 * @param keys - One or more keys to require on the object
 * @returns True when all provided keys exist as own properties on `obj`
 * @example
 * ```ts
 * hasOwn({ a: 1 }, 'a') // true
 * hasOwn({}, 'a') // false
 * ```
 */
export function hasOwn<K extends PropertyKey>(obj: unknown, keys: K): obj is Record<K, unknown>
export function hasOwn<Ks extends readonly PropertyKey[]>(obj: unknown, ...keys: Ks): obj is { [P in Ks[number]]: unknown }
export function hasOwn<T extends object, K extends PropertyKey>(obj: T, keys: K): obj is T & Record<K, unknown>
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
 * @returns True when `ownEnumerableCount(x) === n`
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
	return ownEnumerableCount(x as object) === n
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
 * @returns True when `min <= ownEnumerableCount(x) <= max`
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
	const c = ownEnumerableCount(x as object)
	return c >= min && c <= max
}

// --------------------------------------------
// Assertion helpers
// --------------------------------------------

/**
 * Assert that a value is a non-null object (arrays allowed).
 *
 * Throws a TypeError when the assertion fails.
 *
 * @param x - Value to test
 * @param label - Optional label for the error message
 * @throws TypeError when `x` is not an object
 * @example
 * ```ts
 * assertObject({}) // no throw
 * assertObject(null) // throws TypeError
 * ```
 */
export function assertObject(x: unknown, label = 'value'): asserts x is Record<string, unknown> {
	if (!isObject(x)) {
		throw new TypeError(`Expected ${label} to be an object, got ${typeof x}`)
	}
}

/**
 * Assert that a value is a plain record (non-array object).
 *
 * Throws a TypeError when the assertion fails.
 *
 * @param x - Value to test
 * @param label - Optional label for the error message
 * @throws TypeError when `x` is not a record
 * @example
 * ```ts
 * assertRecord({}) // no throw
 * assertRecord([]) // throws TypeError
 * ```
 */
export function assertRecord(x: unknown, label = 'value'): asserts x is Record<string, unknown> {
	if (!isRecord(x)) {
		const type = Array.isArray(x) ? 'array' : typeof x
		throw new TypeError(`Expected ${label} to be a plain record, got ${type}`)
	}
}
