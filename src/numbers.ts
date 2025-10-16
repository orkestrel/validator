/**
 * Determine whether a value is a finite number.
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @param x - Value to test
 * @returns True if `x` is a JavaScript number and `Number.isFinite(x)`
 * @example
 * ```ts
 * isFiniteNumber(1) // true
 * isFiniteNumber(Infinity) // false
 * ```
 */
export function isFiniteNumber(x: number): boolean
export function isFiniteNumber(x: unknown): x is number
export function isFiniteNumber(x: unknown): boolean {
	return typeof x === 'number' && Number.isFinite(x)
}

/**
 * Determine whether a value is a finite negative number.
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @param x - Value to test
 * @returns True if `x` is a finite number less than 0
 * @example
 * ```ts
 * isNegativeNumber(-1) // true
 * isNegativeNumber(0) // false
 * ```
 */
export function isNegativeNumber(x: number): boolean
export function isNegativeNumber(x: unknown): x is number
export function isNegativeNumber(x: unknown): boolean {
	return isFiniteNumber(x) && x < 0
}

/**
 * Determine whether a value is an integer.
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @param x - Value to test
 * @returns True if `x` is an integer (`Number.isInteger(x)`)
 * @example
 * ```ts
 * isInteger(2) // true
 * isInteger(2.5) // false
 * ```
 */
export function isInteger(x: number): boolean
export function isInteger(x: unknown): x is number
export function isInteger(x: unknown): boolean {
	return typeof x === 'number' && Number.isInteger(x)
}

/**
 * Determine whether a value is a safe integer (within JS safe range).
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @param x - Value to test
 * @returns True if `x` is a safe integer (`Number.isSafeInteger(x)`)
 * @example
 * ```ts
 * isSafeInteger(Number.MAX_SAFE_INTEGER) // true
 * isSafeInteger(Number.MAX_SAFE_INTEGER + 1) // false
 * ```
 */
export function isSafeInteger(x: number): boolean
export function isSafeInteger(x: unknown): x is number
export function isSafeInteger(x: unknown): boolean {
	return typeof x === 'number' && Number.isSafeInteger(x)
}

/**
 * Determine whether a value is a non-negative finite number (`>= 0`).
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @param x - Value to test
 * @returns True if `x` is a finite number greater than or equal to 0
 * @example
 * ```ts
 * isNonNegativeNumber(-1) // false
 * isNonNegativeNumber(0) // true
 * ```
 */
export function isNonNegativeNumber(x: number): boolean
export function isNonNegativeNumber(x: unknown): x is number
export function isNonNegativeNumber(x: unknown): boolean {
	return isFiniteNumber(x) && x >= 0
}

/**
 * Determine whether a value is a positive finite number (`> 0`).
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @param x - Value to test
 * @returns True if `x` is a finite number greater than 0
 * @example
 * ```ts
 * isPositiveNumber(1) // true
 * isPositiveNumber(0) // false
 * ```
 */
export function isPositiveNumber(x: number): boolean
export function isPositiveNumber(x: unknown): x is number
export function isPositiveNumber(x: unknown): boolean {
	return isFiniteNumber(x) && x > 0
}

// --------------------------------------------
// Range helpers
// --------------------------------------------

/**
 * Check whether a value is a number within the inclusive range [min, max].
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @param x - Value to test
 * @param min - Minimum inclusive boundary
 * @param max - Maximum inclusive boundary
 * @returns True when `x` is a number and `min <= x <= max`
 * @example
 * ```ts
 * isRange(2, 1, 3) // true
 * isRange(4, 1, 3) // false
 * isRange('x' as unknown, 1, 3) // false
 * ```
 */
export function isRange(x: number, min: number, max: number): boolean
export function isRange(x: unknown, min: number, max: number): x is number
export function isRange(x: unknown, min: number, max: number): boolean {
	return typeof x === 'number' && x >= min && x <= max
}
