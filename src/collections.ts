import type { Guard } from './types.js'

export function isMap<K = unknown, V = unknown>(x: unknown): x is ReadonlyMap<K, V> {
  return x instanceof Map
}

export function isSet<T = unknown>(x: unknown): x is ReadonlySet<T> {
  return x instanceof Set
}

export function isWeakMap(x: unknown): x is WeakMap<object, unknown> {
  return x instanceof WeakMap
}

export function isWeakSet(x: unknown): x is WeakSet<object> {
  return x instanceof WeakSet
}

export function mapOf<K, V>(keyGuard: Guard<K>, valueGuard: Guard<V>): Guard<ReadonlyMap<K, V>> {
  return (x: unknown): x is ReadonlyMap<K, V> => {
    if (!(x instanceof Map)) return false
    for (const [k, v] of x as Map<unknown, unknown>) {
      if (!keyGuard(k) || !valueGuard(v)) return false
    }
    return true
  }
}

export function setOf<T>(elemGuard: Guard<T>): Guard<ReadonlySet<T>> {
  return (x: unknown): x is ReadonlySet<T> => {
    if (!(x instanceof Set)) return false
    for (const v of x as Set<unknown>) {
      if (!elemGuard(v)) return false
    }
    return true
  }
}

export function nonEmptySetOf<T>(elemGuard: Guard<T>): Guard<ReadonlySet<T>> {
  return (x: unknown): x is ReadonlySet<T> => {
    if (!(x instanceof Set) || x.size === 0) return false
    for (const v of x as Set<unknown>) {
      if (!elemGuard(v)) return false
    }
    return true
  }
}
