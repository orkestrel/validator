import type { Guard } from './types.js'

export function isIterable<T = unknown>(x: unknown): x is Iterable<T> {
  return x != null && typeof (x as { [Symbol.iterator]?: unknown })[Symbol.iterator] === 'function'
}

/**
 * WARNING: This will consume the iterable.
 */
export function iterableOf<T>(elemGuard: Guard<T>): Guard<Iterable<T>> {
  return (x: unknown): x is Iterable<T> => {
    if (!isIterable<T>(x)) return false
    for (const v of x as Iterable<unknown>) {
      if (!elemGuard(v)) return false
    }
    return true
  }
}
