import { isRecord } from './objects.js'

/**
 * Generic emptiness check:
 * - string: length === 0
 * - array: length === 0
 * - Map/Set: size === 0
 * - object: no own enumerable string or symbol keys
 * - other values: false
 */
export function isEmpty(x: unknown): boolean {
  if (typeof x === 'string') return x.length === 0
  if (Array.isArray(x)) return x.length === 0
  if (x instanceof Map || x instanceof Set) return x.size === 0
  if (isRecord(x)) {
    if (Object.keys(x).length > 0) return false
    const syms = Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable)
    return syms.length === 0
  }
  return false
}

export function isEmptyString(x: unknown): x is string {
  return typeof x === 'string' && x.length === 0
}

export function isEmptyArray(x: unknown): x is readonly [] {
  return Array.isArray(x) && x.length === 0
}

export function isEmptyObject(x: unknown): x is Record<string | symbol, never> {
  if (!isRecord(x)) return false
  if (Object.keys(x).length > 0) return false
  const syms = Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable)
  return syms.length === 0
}

export function isEmptyMap<K = unknown, V = unknown>(x: unknown): x is ReadonlyMap<K, V> {
  return x instanceof Map && x.size === 0
}

export function isEmptySet<T = unknown>(x: unknown): x is ReadonlySet<T> {
  return x instanceof Set && x.size === 0
}

export function isNonEmptyString(x: unknown): x is string {
  return typeof x === 'string' && x.length > 0
}
export function isNonEmptyArray<T = unknown>(x: unknown): x is ReadonlyArray<T> {
  return Array.isArray(x) && x.length > 0
}
export function isNonEmptyObject(x: unknown): x is Record<string | symbol, unknown> {
  if (!isRecord(x)) return false
  if (Object.keys(x).length > 0) return true
  const syms = Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable)
  return syms.length > 0
}
export function isNonEmptyMap<K = unknown, V = unknown>(x: unknown): x is ReadonlyMap<K, V> {
  return x instanceof Map && x.size > 0
}
export function isNonEmptySet<T = unknown>(x: unknown): x is ReadonlySet<T> {
  return x instanceof Set && x.size > 0
}
