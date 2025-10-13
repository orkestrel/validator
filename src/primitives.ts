import type { Guard } from './types.js'

/**
 * Return the internal [[Class]] tag string for a value.
 *
 * @param x - Value to inspect
 * @returns Tag like "[object Array]" or "[object Date]"
 * @example
 * ```ts
 * getTag([]) // "[object Array]"
 * ```
 */
export function getTag(x: unknown): string {
	return Object.prototype.toString.call(x)
}

/**
 * Determine whether a value is `null`.
 *
 * @param x - Value to test
 * @returns True if `x` is `null`
 * @example
 * ```ts
 * isNull(null) // true
 * ```
 */
export function isNull(x: unknown): x is null {
	return x === null
}

/**
 * Determine whether a value is `undefined`.
 *
 * @param x - Value to test
 * @returns True if `x` is `undefined`
 * @example
 * ```ts
 * isUndefined(undefined) // true
 * ```
 */
export function isUndefined(x: unknown): x is undefined {
	return x === undefined
}

/**
 * Determine whether a value is defined (neither `null` nor `undefined`).
 *
 * @param x - Value to test
 * @returns True if `x` is not `null` or `undefined`
 * @example
 * ```ts
 * isDefined(0) // true
 * isDefined(null) // false
 * ```
 */
export function isDefined<T>(x: T | null | undefined): x is T {
	return x !== null && x !== undefined
}

/**
 * Determine whether a value is a string.
 *
 * @param x - Value to test
 * @returns True if `x` is a `string`
 * @example
 * ```ts
 * isString('a') // true
 * ```
 */
export function isString(x: unknown): x is string {
	return typeof x === 'string'
}

/**
 * Determine whether a value is a finite number.
 *
 * @param x - Value to test
 * @returns True if `x` is a finite `number`
 * @example
 * ```ts
 * isNumber(1) // true
 * isNumber(NaN) // false
 * ```
 */
export function isNumber(x: unknown): x is number {
	return typeof x === 'number' && Number.isFinite(x)
}

/**
 * Determine whether a value is an integer.
 *
 * @param x - Value to test
 * @returns True if `x` is an integer number
 * @example
 * ```ts
 * isInteger(2) // true
 * isInteger(2.5) // false
 * ```
 */
export function isInteger(x: unknown): x is number {
	return typeof x === 'number' && Number.isInteger(x)
}

/**
 * Determine whether a value is a safe integer (within JS safe range).
 *
 * @param x - Value to test
 * @returns True if `x` is a safe integer
 * @example
 * ```ts
 * isSafeInteger(Number.MAX_SAFE_INTEGER) // true
 * ```
 */
export function isSafeInteger(x: unknown): x is number {
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
 * @param x - Value to test
 * @returns True if `x` is a finite number `>= 0`
 * @example
 * ```ts
 * isNonNegativeNumber(0) // true
 * ```
 */
export function isNonNegativeNumber(x: unknown): x is number {
	return isNumber(x) && x >= 0
}

/**
 * Determine whether a value is a positive finite number (`> 0`).
 *
 * @param x - Value to test
 * @returns True if `x` is a finite number `> 0`
 * @example
 * ```ts
 * isPositiveNumber(1) // true
 * ```
 */
export function isPositiveNumber(x: unknown): x is number {
	return isNumber(x) && x > 0
}

/**
 * Determine whether a value is a boolean.
 *
 * @param x - Value to test
 * @returns True if `x` is a `boolean`
 * @example
 * ```ts
 * isBoolean(true) // true
 * ```
 */
export function isBoolean(x: unknown): x is boolean {
	return typeof x === 'boolean'
}

/**
 * Determine whether a value is a bigint.
 *
 * @param x - Value to test
 * @returns True if `x` is a `bigint`
 * @example
 * ```ts
 * isBigInt(1n) // true
 * ```
 */
export function isBigInt(x: unknown): x is bigint {
	return typeof x === 'bigint'
}

/**
 * Determine whether a value is a symbol.
 *
 * @param x - Value to test
 * @returns True if `x` is a `symbol`
 * @example
 * ```ts
 * isSymbol(Symbol('s')) // true
 * ```
 */
export function isSymbol(x: unknown): x is symbol {
	return typeof x === 'symbol'
}

/**
 * Determine whether a value is a function.
 *
 * @param x - Value to test
 * @returns True if `x` is a function
 * @example
 * ```ts
 * isFunction(() => {}) // true
 * ```
 */
export function isFunction(x: unknown): x is (...args: unknown[]) => unknown {
	return typeof x === 'function'
}

/**
 * Heuristic for async functions (native or transpiled).
 *
 * @param fn - Value to check
 * @returns True if `fn` appears to be an async function
 * @example
 * ```ts
 * async function a() {}
 * isAsyncFunction(a) // true
 * ```
 */
export function isAsyncFunction(fn: unknown): fn is (...args: unknown[]) => Promise<unknown> {
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
 * @param x - Value to test
 * @returns True if `x` is a `Date`
 * @example
 * ```ts
 * isDate(new Date()) // true
 * ```
 */
export function isDate(x: unknown): x is Date {
	return getTag(x) === '[object Date]'
}

/**
 * Determine whether a value is a RegExp object.
 *
 * @param x - Value to test
 * @returns True if `x` is a `RegExp`
 * @example
 * ```ts
 * isRegExp(/a/) // true
 * ```
 */
export function isRegExp(x: unknown): x is RegExp {
	return getTag(x) === '[object RegExp]'
}

/**
 * Determine whether a value is an Error instance.
 *
 * @param x - Value to test
 * @returns True if `x` is an `Error`
 * @example
 * ```ts
 * isError(new Error('e')) // true
 * ```
 */
export function isError(x: unknown): x is Error {
	return x instanceof Error
}

/**
 * Determine whether a value is thenable (Promise-like).
 *
 * @param x - Value to test
 * @returns True if `x` has a callable `then` property
 * @example
 * ```ts
 * isPromiseLike(Promise.resolve(1)) // true
 * ```
 */
export function isPromiseLike<T = unknown>(x: unknown): x is PromiseLike<T> {
	if (x == null) return false
	const t = typeof x
	if (t !== 'object' && t !== 'function') return false
	if (!('then' in (x as object))) return false
	const then = (x as { then?: unknown }).then
	return typeof then === 'function'
}
