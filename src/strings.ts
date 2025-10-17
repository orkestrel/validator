/**
 * Determine whether a string is all lowercase.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isLowercase('abc') // true
 * ```
 */
export function isLowercase(s: string): boolean
export function isLowercase(s: unknown): s is string
export function isLowercase(s: unknown): boolean {
	return typeof s === 'string' && s === s.toLowerCase()
}

/**
 * Determine whether a string is all uppercase.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isUppercase('ABC') // true
 * ```
 */
export function isUppercase(s: string): boolean
export function isUppercase(s: unknown): s is string
export function isUppercase(s: unknown): boolean {
	return typeof s === 'string' && s === s.toUpperCase()
}

/**
 * Determine whether a string contains only alphanumeric characters A-Z, a-z, 0-9.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isAlphanumeric('A1') // true
 * ```
 */
export function isAlphanumeric(s: string): boolean
export function isAlphanumeric(s: unknown): s is string
export function isAlphanumeric(s: unknown): boolean {
	return typeof s === 'string' && /^[A-Za-z0-9]+$/.test(s)
}
