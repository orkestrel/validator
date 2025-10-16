/**
 * Determine whether a value is a Map.
 *
 * Overloads:
 * - When called with `ReadonlyMap<K,V>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `ReadonlyMap<K,V>`.
 *
 * @param x - Value to check
 * @returns True if `x` is a Map
 * @example
 * ```ts
 * isMap(new Map()) // true
 * isMap({}) // false
 * ```
 */
export function isMap<_K = unknown, _V = unknown>(x: ReadonlyMap<_K, _V>): boolean
export function isMap<_K = unknown, _V = unknown>(x: unknown): x is ReadonlyMap<_K, _V>
export function isMap<_K = unknown, _V = unknown>(x: unknown): boolean {
	return x instanceof Map
}

/**
 * Determine whether a value is a Set.
 *
 * Overloads:
 * - When called with `ReadonlySet<T>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `ReadonlySet<T>`.
 *
 * @param x - Value to check
 * @returns True if `x` is a Set
 * @example
 * ```ts
 * isSet(new Set()) // true
 * isSet([]) // false
 * ```
 */
export function isSet<_T = unknown>(x: ReadonlySet<_T>): boolean
export function isSet<_T = unknown>(x: unknown): x is ReadonlySet<_T>
export function isSet<_T = unknown>(x: unknown): boolean {
	return x instanceof Set
}

/**
 * Determine whether a value is a WeakMap.
 *
 * Overloads:
 * - When called with `WeakMap<object, unknown>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `WeakMap<object, unknown>`.
 *
 * @param x - Value to check
 * @returns True if `x` is a WeakMap
 * @example
 * ```ts
 * isWeakMap(new WeakMap()) // true
 * isWeakMap(new Map()) // false
 * ```
 */
export function isWeakMap(x: WeakMap<object, unknown>): boolean
export function isWeakMap(x: unknown): x is WeakMap<object, unknown>
export function isWeakMap(x: unknown): boolean {
	return x instanceof WeakMap
}

/**
 * Determine whether a value is a WeakSet.
 *
 * Overloads:
 * - When called with `WeakSet<object>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `WeakSet<object>`.
 *
 * @param x - Value to check
 * @returns True if `x` is a WeakSet
 * @example
 * ```ts
 * isWeakSet(new WeakSet()) // true
 * isWeakSet(new Set()) // false
 * ```
 */
export function isWeakSet(x: WeakSet<object>): boolean
export function isWeakSet(x: unknown): x is WeakSet<object>
export function isWeakSet(x: unknown): boolean {
	return x instanceof WeakSet
}

// --------------------------------------------
// Size helpers
// --------------------------------------------

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
