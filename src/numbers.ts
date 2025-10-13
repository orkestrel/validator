import type { Guard } from './types.js'
import { isInteger, isNumber } from './primitives.js'

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
 * ```
 */
export function isNegativeNumber(x: number): boolean
export function isNegativeNumber(x: unknown): x is number
export function isNegativeNumber(x: unknown): boolean {
	return isNumber(x) && x < 0
}

/**
 * Create a guard that checks whether a value is an integer inside a closed range.
 *
 * @param min - Minimum allowed integer (inclusive)
 * @param max - Maximum allowed integer (inclusive)
 * @returns A guard that validates integers are between `min` and `max`
 * @example
 * ```ts
 * const g = intInRange(0, 10)
 * g(5) // true
 * ```
 */
export function intInRange(min: number, max: number): Guard<number> {
	return (x: unknown): x is number => isInteger(x) && x >= min && x <= max
}

/**
 * Create a guard that checks whether a number is a multiple of `m`.
 *
 * @param m - The non-zero finite modulus to test against
 * @returns A guard that returns true when `x` is a finite number and `x % m === 0`
 * @example
 * ```ts
 * const g = isMultipleOf(3)
 * g(9) // true
 * ```
 */
export function isMultipleOf(m: number): Guard<number> {
	return (x: unknown): x is number => isNumber(x) && Number.isFinite(m) && m !== 0 && x % m === 0
}
