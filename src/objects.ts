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
