import type { Guard } from './types.js'
import { getTag } from './helpers.js'

/**
 * Determine whether a value is `null`.
 *
 * Overloads:
 * - When called with `null`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `null`.
 *
 * @example
 * ```ts
 * isNull(null) // true
 * ```
 */
export function isNull(x: null): boolean
export function isNull(x: unknown): x is null
export function isNull(x: unknown): boolean {
	return x === null
}

/**
 * Determine whether a value is `undefined`.
 *
 * Overloads:
 * - When called with `undefined`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `undefined`.
 *
 * @example
 * ```ts
 * isUndefined(undefined) // true
 * ```
 */
export function isUndefined(x: undefined): boolean
export function isUndefined(x: unknown): x is undefined
export function isUndefined(x: unknown): boolean {
	return x === undefined
}

/**
 * Determine whether a value is defined (neither `null` nor `undefined`).
 *
 * Overloads:
 * - When called with `T`, returns `boolean` (no narrowing).
 * - When called with `T | null | undefined`, returns a type predicate narrowing to `T`.
 *
 * @example
 * ```ts
 * isDefined(0) // true
 * isDefined(null) // false
 * ```
 */
export function isDefined<T>(x: T): boolean
export function isDefined<T>(x: T | null | undefined): x is T
export function isDefined<T>(x: T | null | undefined): boolean {
	return x !== null && x !== undefined
}

/**
 * Determine whether a value is a string.
 *
 * Overloads:
 * - When called with `string`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isString('a') // true
 * ```
 */
export function isString(x: string): boolean
export function isString(x: unknown): x is string
export function isString(x: unknown): boolean {
	return typeof x === 'string'
}

/**
 * Determine whether a value is a finite number.
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @example
 * ```ts
 * isNumber(1) // true
 * isNumber(NaN) // false
 * ```
 */
export function isNumber(x: number): boolean
export function isNumber(x: unknown): x is number
export function isNumber(x: unknown): boolean {
	return typeof x === 'number' && Number.isFinite(x)
}

/**
 * Determine whether a value is an integer.
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
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
 * @example
 * ```ts
 * isSafeInteger(Number.MAX_SAFE_INTEGER) // true
 * ```
 */
export function isSafeInteger(x: number): boolean
export function isSafeInteger(x: unknown): x is number
export function isSafeInteger(x: unknown): boolean {
	return typeof x === 'number' && Number.isSafeInteger(x)
}

/**
 * Create a guard for numbers inside a closed range.
 *
 * @param min - Minimum allowed number (inclusive)
 * @param max - Maximum allowed number (inclusive)
 * @returns A guard that validates numbers are between `min` and `max`
 * @example
 * ```ts
 * const g = numberInRange(0, 10)
 * g(5) // true
 * ```
 */
export function numberInRange(min: number, max: number): Guard<number> {
	return (x: unknown): x is number => isNumber(x) && x >= min && x <= max
}

/**
 * Determine whether a value is a non-negative finite number (`>= 0`).
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @example
 * ```ts
 * isNonNegativeNumber(0) // true
 * ```
 */
export function isNonNegativeNumber(x: number): boolean
export function isNonNegativeNumber(x: unknown): x is number
export function isNonNegativeNumber(x: unknown): boolean {
	return isNumber(x) && x >= 0
}

/**
 * Determine whether a value is a positive finite number (`> 0`).
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @example
 * ```ts
 * isPositiveNumber(1) // true
 * ```
 */
export function isPositiveNumber(x: number): boolean
export function isPositiveNumber(x: unknown): x is number
export function isPositiveNumber(x: unknown): boolean {
	return isNumber(x) && x > 0
}

/**
 * Determine whether a value is a boolean.
 *
 * Overloads:
 * - When called with `boolean`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `boolean`.
 *
 * @example
 * ```ts
 * isBoolean(true) // true
 * ```
 */
export function isBoolean(x: boolean): boolean
export function isBoolean(x: unknown): x is boolean
export function isBoolean(x: unknown): boolean {
	return typeof x === 'boolean'
}

/**
 * Determine whether a value is a bigint.
 *
 * Overloads:
 * - When called with `bigint`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `bigint`.
 *
 * @example
 * ```ts
 * isBigInt(1n) // true
 * ```
 */
export function isBigInt(x: bigint): boolean
export function isBigInt(x: unknown): x is bigint
export function isBigInt(x: unknown): boolean {
	return typeof x === 'bigint'
}

/**
 * Determine whether a value is a symbol.
 *
 * Overloads:
 * - When called with `symbol`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `symbol`.
 *
 * @example
 * ```ts
 * isSymbol(Symbol('s')) // true
 * ```
 */
export function isSymbol(x: symbol): boolean
export function isSymbol(x: unknown): x is symbol
export function isSymbol(x: unknown): boolean {
	return typeof x === 'symbol'
}

/**
 * Determine whether a value is a function.
 *
 * Overloads:
 * - When called with `Function`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to function.
 *
 * @example
 * ```ts
 * isFunction(() => {}) // true
 * ```
 */
export function isFunction(x: (...args: unknown[]) => unknown): boolean
export function isFunction(x: unknown): x is (...args: unknown[]) => unknown
export function isFunction(x: unknown): boolean {
	return typeof x === 'function'
}

/**
 * Heuristic for async functions (native or transpiled).
 *
 * Overloads:
 * - When called with async function type, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to async function type.
 *
 * @example
 * ```ts
 * async function a() {}
 * isAsyncFunction(a) // true
 * ```
 */
export function isAsyncFunction(fn: (...args: unknown[]) => Promise<unknown>): boolean
export function isAsyncFunction(fn: unknown): fn is (...args: unknown[]) => Promise<unknown>
export function isAsyncFunction(fn: unknown): boolean {
	if (!isFunction(fn)) return false
	if (getTag(fn) === '[object AsyncFunction]') return true
	const proto = Object.getPrototypeOf(fn)
	const ctorName = typeof proto?.constructor?.name === 'string' ? proto.constructor.name : undefined
	return ctorName === 'AsyncFunction'
}

/**
 * Determine whether a function takes no declared arguments.
 *
 * @param fn - Function to inspect
 * @returns True if `fn.length === 0`
 * @example
 * ```ts
 * isZeroArg(() => {}) // true
 * ```
 */
export function isZeroArg(fn: (...args: unknown[]) => unknown): fn is () => unknown {
	return fn.length === 0
}

/**
 * Determine whether a value is a Date object.
 *
 * Overloads:
 * - When called with `Date`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `Date`.
 *
 * @example
 * ```ts
 * isDate(new Date()) // true
 * ```
 */
export function isDate(x: Date): boolean
export function isDate(x: unknown): x is Date
export function isDate(x: unknown): boolean {
	return getTag(x) === '[object Date]'
}

/**
 * Determine whether a value is a RegExp object.
 *
 * Overloads:
 * - When called with `RegExp`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `RegExp`.
 *
 * @example
 * ```ts
 * isRegExp(/a/) // true
 * ```
 */
export function isRegExp(x: RegExp): boolean
export function isRegExp(x: unknown): x is RegExp
export function isRegExp(x: unknown): boolean {
	return getTag(x) === '[object RegExp]'
}

/**
 * Determine whether a value is an Error instance.
 *
 * Overloads:
 * - When called with `Error`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `Error`.
 *
 * @example
 * ```ts
 * isError(new Error('e')) // true
 * ```
 */
export function isError(x: Error): boolean
export function isError(x: unknown): x is Error
export function isError(x: unknown): boolean {
	return x instanceof Error
}

/**
 * Determine whether a value is thenable (Promise-like).
 *
 * Overloads:
 * - When called with `PromiseLike<T>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `PromiseLike<T>`.
 *
 * @example
 * ```ts
 * isPromiseLike(Promise.resolve(1)) // true
 * ```
 */
export function isPromiseLike<_T = unknown>(x: PromiseLike<_T>): boolean
export function isPromiseLike<_T = unknown>(x: unknown): x is PromiseLike<_T>
export function isPromiseLike<_T = unknown>(x: unknown): boolean {
	if (x == null) return false
	const t = typeof x
	if (t !== 'object' && t !== 'function') return false
	if (!('then' in (x as object))) return false
	const then = (x as { then?: unknown }).then
	return typeof then === 'function'
}
