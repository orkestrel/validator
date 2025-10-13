import type { Guard } from './types.js'

/**
 * Return the internal [[Class]] tag string for a value.
 *
 * @param x - Value to inspect
 * @returns Tag like "[object Array]" or "[object Date]"
 */
export function getTag(x: unknown): string {
  return Object.prototype.toString.call(x)
}

export function isNull(x: unknown): x is null {
  return x === null
}

export function isUndefined(x: unknown): x is undefined {
  return x === undefined
}

/**
 * Check whether a value is defined (not null/undefined).
 *
 * @param x - Value to check
 * @returns True if x is neither null nor undefined
 */
export function isDefined<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined
}

export function isString(x: unknown): x is string {
  return typeof x === 'string'
}

export function isNumber(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x)
}

export function isInteger(x: unknown): x is number {
  return typeof x === 'number' && Number.isInteger(x)
}

export function isSafeInteger(x: unknown): x is number {
  return typeof x === 'number' && Number.isSafeInteger(x)
}

export function numberInRange(min: number, max: number): Guard<number> {
  return (x: unknown): x is number => isNumber(x) && x >= min && x <= max
}

export function isNonNegativeNumber(x: unknown): x is number {
  return isNumber(x) && x >= 0
}

export function isPositiveNumber(x: unknown): x is number {
  return isNumber(x) && x > 0
}

export function isBoolean(x: unknown): x is boolean {
  return typeof x === 'boolean'
}

export function isBigInt(x: unknown): x is bigint {
  return typeof x === 'bigint'
}

export function isSymbol(x: unknown): x is symbol {
  return typeof x === 'symbol'
}

export function isFunction(x: unknown): x is (...args: unknown[]) => unknown {
  return typeof x === 'function'
}

/**
 * Heuristic for async functions (native or transpiled).
 *
 * @param fn - Value to check
 * @returns True if fn appears to be an async function
 */
export function isAsyncFunction(fn: unknown): fn is (...args: unknown[]) => Promise<unknown> {
  if (!isFunction(fn)) return false
  if (getTag(fn) === '[object AsyncFunction]') return true
  const proto = Object.getPrototypeOf(fn)
  const ctorName = typeof proto?.constructor?.name === 'string' ? proto.constructor.name : undefined
  return ctorName === 'AsyncFunction'
}

export function isZeroArg(fn: (...args: unknown[]) => unknown): fn is () => unknown {
  return fn.length === 0
}

export function isDate(x: unknown): x is Date {
  return getTag(x) === '[object Date]'
}

export function isRegExp(x: unknown): x is RegExp {
  return getTag(x) === '[object RegExp]'
}

export function isError(x: unknown): x is Error {
  return x instanceof Error
}

export function isPromiseLike<T = unknown>(x: unknown): x is PromiseLike<T> {
  if (x == null) return false
  const t = typeof x
  if (t !== 'object' && t !== 'function') return false
  if (!('then' in (x as object))) return false
  const then = (x as { then?: unknown }).then
  return typeof then === 'function'
}
