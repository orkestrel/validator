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
