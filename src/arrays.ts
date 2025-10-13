import type { Guard } from './types.js'
import { isRecord } from './objects.js'

export function isArray<T = unknown>(x: unknown): x is ReadonlyArray<T> {
  return Array.isArray(x)
}

export function arrayOf<T>(elem: Guard<T>): Guard<ReadonlyArray<T>> {
  return (x: unknown): x is ReadonlyArray<T> => Array.isArray(x) && x.every(elem)
}

export function nonEmptyArrayOf<T>(elem: Guard<T>): Guard<readonly [T, ...T[]]> {
  return (x: unknown): x is readonly [T, ...T[]] => Array.isArray(x) && x.length > 0 && x.every(elem)
}

export function tupleOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<{ readonly [K in keyof Gs]: Gs[K] extends Guard<infer T> ? T : never }> {
  return (x: unknown): x is { readonly [K in keyof Gs]: Gs[K] extends Guard<infer T> ? T : never } => {
    if (!Array.isArray(x) || x.length !== guards.length) return false
    for (let i = 0; i < guards.length; i++) {
      const guard = guards[i]
      if (!guard || !guard(x[i])) return false
    }
    return true
  }
}

export function recordOf<T>(valueGuard: Guard<T>): Guard<Record<string, T>> {
  return (x: unknown): x is Record<string, T> => {
    if (!isRecord(x)) return false
    for (const k of Object.keys(x)) {
      if (!valueGuard((x as Record<string, unknown>)[k])) return false
    }
    return true
  }
}
