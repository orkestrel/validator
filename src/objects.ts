import type { Guard } from './types.js'

export function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

export function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x)
}

/**
 * hasOwn with overloads that preserve the original type where known.
 *
 * @param obj - Value to check
 * @param key - One or more keys to require on the object
 */
export function hasOwn<K extends PropertyKey>(obj: unknown, key: K): obj is Record<K, unknown>
export function hasOwn<Ks extends readonly PropertyKey[]>(obj: unknown, ...keys: Ks): obj is { [P in Ks[number]]: unknown }
export function hasOwn<T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown>
export function hasOwn<T extends object, Ks extends readonly PropertyKey[]>(obj: T, ...keys: Ks): obj is T & { [P in Ks[number]]: unknown }
export function hasOwn(obj: unknown, ...keys: readonly PropertyKey[]): boolean {
  if (!isRecord(obj)) return false
  for (const k of keys) if (!Object.prototype.hasOwnProperty.call(obj, k)) return false
  return true
}

/**
 * Object must own only the specified keys (no extras).
 *
 * @param obj - Value to check
 * @param keys - Exact allowed keys
 */
export function hasOnlyKeys<Ks extends readonly PropertyKey[]>(obj: unknown, ...keys: Ks): obj is { [P in Ks[number]]: unknown } {
  if (!isRecord(obj)) return false
  const objKeys = Object.keys(obj)
  if (objKeys.length !== keys.length) return false
  for (const k of keys) if (!Object.prototype.hasOwnProperty.call(obj, k)) return false
  return true
}

/**
 * Guard for keyof a given object literal (by membership).
 *
 * @param obj - Object to derive keys from
 */
export function keyOf<const O extends Readonly<Record<PropertyKey, unknown>>>(obj: O): Guard<keyof O> {
  return (x: unknown): x is keyof O => (typeof x === 'string' || typeof x === 'symbol' || typeof x === 'number') && x in obj
}

/**
 * Opposite of hasOwn: returns true if object owns none of the provided keys.
 *
 * @param obj - Value to check
 * @param keys - Keys that must not be present
 */
export function hasNo(obj: unknown, ...keys: readonly PropertyKey[]): boolean {
  if (!isRecord(obj)) return false
  for (const k of keys) if (Object.prototype.hasOwnProperty.call(obj, k)) return false
  return true
}
