import { isRecord } from './objects.js'

/**
 * Determine whether a value is empty.
 *
 * - string: `length === 0`
 * - array: `length === 0`
 * - Map/Set: `size === 0`
 * - object: no own enumerable string or symbol keys
 * - other values: false
 *
 * @param x - Value to check
 * @returns True if the value is considered empty
 * @example
 * ```ts
 * isEmpty('') // true
 * isEmpty([]) // true
 * ```
 */
export function isEmpty(x: unknown): boolean {
	if (typeof x === 'string') return x.length === 0
	if (Array.isArray(x)) return x.length === 0
	if (x instanceof Map || x instanceof Set) return x.size === 0
	if (isRecord(x)) {
		if (Object.keys(x).length > 0) return false
		const syms = Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable)
		return syms.length === 0
	}
	return false
}

/**
 * Determine whether a value is an empty string (`length === 0`).
 *
 * Overloads:
 * - When called with `string`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to empty `string`.
 *
 * @example
 * ```ts
 * isEmptyString('') // true
 * ```
 */
export function isEmptyString(x: string): boolean
export function isEmptyString(x: unknown): x is string
export function isEmptyString(x: unknown): boolean {
	return typeof x === 'string' && x.length === 0
}

/**
 * Determine whether a value is an empty array (`length === 0`).
 *
 * Overloads:
 * - When called with `readonly []`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `readonly []`.
 *
 * @example
 * ```ts
 * isEmptyArray([]) // true
 * ```
 */
export function isEmptyArray(x: readonly []): boolean
export function isEmptyArray(x: unknown): x is readonly []
export function isEmptyArray(x: unknown): boolean {
	return Array.isArray(x) && x.length === 0
}

/**
 * Determine whether a value is an empty object (no own enumerable string or symbol keys).
 *
 * Overloads:
 * - When called with `Record<string | symbol, never>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to empty object type.
 *
 * @example
 * ```ts
 * isEmptyObject({}) // true
 * ```
 */
export function isEmptyObject(x: Record<string | symbol, never>): boolean
export function isEmptyObject(x: unknown): x is Record<string | symbol, never>
export function isEmptyObject(x: unknown): boolean {
	if (!isRecord(x)) return false
	if (Object.keys(x).length > 0) return false
	const syms = Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable)
	return syms.length === 0
}

/**
 * Determine whether a value is an empty Map (`size === 0`).
 *
 * Overloads:
 * - When called with empty `ReadonlyMap<K, V>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to empty map shape.
 *
 * @example
 * ```ts
 * isEmptyMap(new Map()) // true
 * ```
 */
export function isEmptyMap<_K = unknown, _V = unknown>(x: ReadonlyMap<_K, _V>): boolean
export function isEmptyMap<_K = unknown, _V = unknown>(x: unknown): x is ReadonlyMap<_K, _V>
export function isEmptyMap<_K = unknown, _V = unknown>(x: unknown): boolean {
	return x instanceof Map && x.size === 0
}

/**
 * Determine whether a value is an empty Set (`size === 0`).
 *
 * Overloads:
 * - When called with empty `ReadonlySet<T>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to empty set shape.
 *
 * @example
 * ```ts
 * isEmptySet(new Set()) // true
 * ```
 */
export function isEmptySet<_T = unknown>(x: ReadonlySet<_T>): boolean
export function isEmptySet<_T = unknown>(x: unknown): x is ReadonlySet<_T>
export function isEmptySet<_T = unknown>(x: unknown): boolean {
	return x instanceof Set && x.size === 0
}

/**
 * Determine whether a value is a non-empty string (`length > 0`).
 *
 * Overloads:
 * - When called with `string`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to non-empty `string`.
 *
 * @example
 * ```ts
 * isNonEmptyString('a') // true
 * ```
 */
export function isNonEmptyString(x: string): boolean
export function isNonEmptyString(x: unknown): x is string
export function isNonEmptyString(x: unknown): boolean {
	return typeof x === 'string' && x.length > 0
}

/**
 * Determine whether a value is a non-empty array (`length > 0`).
 *
 * Overloads:
 * - When called with `ReadonlyArray<T>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to non-empty array.
 *
 * @example
 * ```ts
 * isNonEmptyArray([1]) // true
 * ```
 */
export function isNonEmptyArray<_T = unknown>(x: ReadonlyArray<_T>): boolean
export function isNonEmptyArray<_T = unknown>(x: unknown): x is ReadonlyArray<_T>
export function isNonEmptyArray<_T = unknown>(x: unknown): boolean {
	return Array.isArray(x) && x.length > 0
}

/**
 * Determine whether a value is a non-empty object (has at least one own enumerable key or symbol).
 *
 * Overloads:
 * - When called with `Record<string | symbol, unknown>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to non-empty object.
 *
 * @example
 * ```ts
 * isNonEmptyObject({ a: 1 }) // true
 * ```
 */
export function isNonEmptyObject(x: Record<string | symbol, unknown>): boolean
export function isNonEmptyObject(x: unknown): x is Record<string | symbol, unknown>
export function isNonEmptyObject(x: unknown): boolean {
	if (!isRecord(x)) return false
	if (Object.keys(x).length > 0) return true
	const syms = Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable)
	return syms.length > 0
}

/**
 * Determine whether a value is a non-empty Map (`size > 0`).
 *
 * Overloads:
 * - When called with `ReadonlyMap<K,V>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to non-empty map shape.
 *
 * @example
 * ```ts
 * isNonEmptyMap(new Map([['a',1]])) // true
 * ```
 */
export function isNonEmptyMap<_K = unknown, _V = unknown>(x: ReadonlyMap<_K, _V>): boolean
export function isNonEmptyMap<_K = unknown, _V = unknown>(x: unknown): x is ReadonlyMap<_K, _V>
export function isNonEmptyMap<_K = unknown, _V = unknown>(x: unknown): boolean {
	return x instanceof Map && x.size > 0
}

/**
 * Determine whether a value is a non-empty Set (`size > 0`).
 *
 * Overloads:
 * - When called with `ReadonlySet<T>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to non-empty set shape.
 *
 * @example
 * ```ts
 * isNonEmptySet(new Set([1])) // true
 * ```
 */
export function isNonEmptySet<_T = unknown>(x: ReadonlySet<_T>): boolean
export function isNonEmptySet<_T = unknown>(x: unknown): x is ReadonlySet<_T>
export function isNonEmptySet<_T = unknown>(x: unknown): boolean {
	return x instanceof Set && x.size > 0
}
