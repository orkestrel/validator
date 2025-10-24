import { isRecord } from './collections.js'

/**
 * Determine whether a value is the empty string (x === '').
 *
 * @param x - Value to test
 * @returns True when x is strictly the empty string
 * @example
 * ```ts
 * isEmptyString('') // true
 * isEmptyString('a' as unknown) // false
 * ```
 */
export function isEmptyString(x: unknown): x is '' {
	return x === ''
}

/**
 * Determine whether a value is an empty array (length equals 0).
 *
 * Overloads preserve tuple/readonly array intent where applicable.
 *
 * @param x - Value to test
 * @returns True when x is an array with length 0
 * @example
 * ```ts
 * isEmptyArray([]) // true
 * isEmptyArray(['a'] as unknown) // false
 * ```
 */
export function isEmptyArray(x: readonly []): boolean
export function isEmptyArray(x: unknown): x is readonly []
export function isEmptyArray(x: unknown): boolean {
	return Array.isArray(x) && x.length === 0
}

/**
 * Determine whether a value is an empty object (no own enumerable keys/symbols).
 *
 * @param x - Value to test
 * @returns True when x has no own enumerable string or symbol keys
 * @example
 * ```ts
 * isEmptyObject({}) // true
 * isEmptyObject({ a: 1 } as unknown) // false
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
 * Determine whether a value is an empty Map (size equals 0).
 *
 * @param x - Value to test
 * @returns True when x is a Map of size 0
 * @example
 * ```ts
 * isEmptyMap(new Map()) // true
 * isEmptyMap(new Map([[1, 2]]) as unknown) // false
 * ```
 */
export function isEmptyMap(x: ReadonlyMap<never, never>): boolean
export function isEmptyMap(x: unknown): x is ReadonlyMap<never, never>
export function isEmptyMap(x: unknown): boolean {
	return x instanceof Map && x.size === 0
}

/**
 * Determine whether a value is an empty Set (size equals 0).
 *
 * @param x - Value to test
 * @returns True when x is a Set of size 0
 * @example
 * ```ts
 * isEmptySet(new Set()) // true
 * isEmptySet(new Set([1]) as unknown) // false
 * ```
 */
export function isEmptySet(x: ReadonlySet<never>): boolean
export function isEmptySet(x: unknown): x is ReadonlySet<never>
export function isEmptySet(x: unknown): boolean {
	return x instanceof Set && x.size === 0
}

/**
 * Determine whether a value is a non-empty string (length \> 0).
 *
 * @param x - Value to test
 * @returns True when x is a string with length \> 0
 * @example
 * ```ts
 * isNonEmptyString('a') // true
 * isNonEmptyString('' as unknown) // false
 * ```
 */
export function isNonEmptyString(x: string): boolean
export function isNonEmptyString(x: unknown): x is string
export function isNonEmptyString(x: unknown): boolean {
	return typeof x === 'string' && x.length > 0
}

/**
 * Determine whether a value is a non-empty array (length greater than 0).
 * Narrows to a non-empty tuple type.
 *
 * @param x - Value to test
 * @returns True when x is an array with length greater than 0
 * @example
 * ```ts
 * isNonEmptyArray([1]) // true
 * isNonEmptyArray([] as unknown) // false
 * ```
 */
export function isNonEmptyArray<_T = unknown>(x: readonly [_T, ..._T[]]): boolean
export function isNonEmptyArray<_T = unknown>(x: unknown): x is readonly [_T, ..._T[]]
export function isNonEmptyArray<_T = unknown>(x: unknown): boolean {
	return Array.isArray(x) && x.length > 0
}

/**
 * Determine whether a value is a non-empty object (has at least one own enumerable key or symbol).
 *
 * @param x - Value to test
 * @returns True when x has at least one own enumerable property
 * @example
 * ```ts
 * isNonEmptyObject({ a: 1 }) // true
 * isNonEmptyObject({} as unknown) // false
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
 * Determine whether a value is a non-empty Map (size \> 0).
 *
 * @param x - Value to test
 * @returns True when x is a Map with size \> 0
 * @example
 * ```ts
 * isNonEmptyMap(new Map([[1, 2]])) // true
 * isNonEmptyMap(new Map() as unknown) // false
 * ```
 */
export function isNonEmptyMap<_K = unknown, _V = unknown>(x: ReadonlyMap<_K, _V>): boolean
export function isNonEmptyMap<_K = unknown, _V = unknown>(x: unknown): x is ReadonlyMap<_K, _V>
export function isNonEmptyMap<_K = unknown, _V = unknown>(x: unknown): boolean {
	return x instanceof Map && x.size > 0
}

/**
 * Determine whether a value is a non-empty Set (size \> 0).
 *
 * @param x - Value to test
 * @returns True when x is a Set with size \> 0
 * @example
 * ```ts
 * isNonEmptySet(new Set([1])) // true
 * isNonEmptySet(new Set() as unknown) // false
 * ```
 */
export function isNonEmptySet<_T = unknown>(x: ReadonlySet<_T>): boolean
export function isNonEmptySet<_T = unknown>(x: unknown): x is ReadonlySet<_T>
export function isNonEmptySet<_T = unknown>(x: unknown): boolean {
	return x instanceof Set && x.size > 0
}
