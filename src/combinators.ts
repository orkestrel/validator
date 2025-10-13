import type { Guard, Result, UnionToIntersection } from './types.js'
import { isRecord } from './objects.js'

export function literalOf<const Literals extends readonly (string | number | boolean)[]>(
  ...literals: Literals
): Guard<Literals[number]> {
  return (x: unknown): x is Literals[number] => literals.includes(x as never)
}

export function and<A, B>(a: Guard<A>, b: Guard<B>): Guard<A & B> {
  return (x: unknown): x is A & B => a(x) && b(x)
}

export function or<A, B>(a: Guard<A>, b: Guard<B>): Guard<A | B> {
  return (x: unknown): x is A | B => a(x) || b(x)
}

/**
 * Negation returns Guard<unknown>; the complement is not representable exactly in TS.
 */
export function not(_g: Guard<unknown>): Guard<unknown> {
  const g = _g as Guard<unknown>
  return (x: unknown): x is unknown => !g(x)
}

/**
 * Alias for not(...) to expose as isNot.
 */
export const isNot = not

export function unionOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<Gs[number] extends Guard<infer T> ? T : never> {
  return (x: unknown): x is Gs[number] extends Guard<infer T> ? T : never => guards.some(g => g(x))
}

export function intersectionOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<UnionToIntersection<Gs[number] extends Guard<infer T> ? T : never>> {
  return (x: unknown): x is UnionToIntersection<Gs[number] extends Guard<infer T> ? T : never> => guards.every(g => g(x))
}

export function optionalOf<T>(g: Guard<T>): Guard<T | undefined> {
  return (x: unknown): x is T | undefined => x === undefined || g(x)
}

export function nullableOf<T>(g: Guard<T>): Guard<T | null> {
  return (x: unknown): x is T | null => x === null || g(x)
}

export function lazy<T>(thunk: () => Guard<T>): Guard<T> {
  return (x: unknown): x is T => thunk()(x)
}

export function refine<T, U extends T>(base: Guard<T>, refineFn: (x: T) => x is U): Guard<U> {
  return (x: unknown): x is U => base(x) && refineFn(x as T)
}

export function safeParse<T, E extends Error = TypeError>(
  x: unknown,
  g: Guard<T>,
  onError?: (x: unknown) => E,
): Result<T, E> {
  if (g(x)) return { ok: true, value: x }
  return { ok: false, error: onError ? onError(x) : new TypeError('Validation failed') as E }
}

export function discriminatedUnion<
  K extends string,
  const M extends Readonly<Record<string, Guard<unknown>>>
>(disc: K, mapping: M): Guard<M[keyof M] extends Guard<infer T> ? T : never> {
  const keys = new Set(Object.keys(mapping))
  return (x: unknown): x is M[keyof M] extends Guard<infer T> ? T : never => {
    if (!isRecord(x)) return false
    const v = x[disc]
    if (typeof v !== 'string') return false
    if (!keys.has(v)) return false
    const g = mapping[v]
    return g ? g(x) : false
  }
}

export function fromNativeEnum<E extends Record<string, string | number>>(e: E): Guard<E[keyof E]> {
  const values = new Set(Object.values(e).filter(v => typeof v === 'string' || typeof v === 'number') as (string | number)[])
  return (x: unknown): x is E[keyof E] => values.has(x as string | number)
}
