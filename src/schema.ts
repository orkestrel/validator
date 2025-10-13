import type { FromSchema, Guard, GuardsShape, SchemaSpec, GuardType } from './types.js'
import { isFunction } from './primitives.js'

export function hasSchema<S extends SchemaSpec>(obj: unknown, schema: S): obj is FromSchema<S> {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false
  const o = obj as Record<string, unknown>
  for (const [k, rule] of Object.entries(schema)) {
    if (!Object.prototype.hasOwnProperty.call(o, k)) return false
    const v = o[k]
    if (typeof rule === 'string') {
      if (rule === 'object') {
        if (!(typeof v === 'object' && v !== null && !Array.isArray(v))) return false
      } else if (typeof v !== rule) {
        return false
      }
    } else if (isFunction(rule)) {
      if (!(rule as Guard<unknown>)(v)) return false
    } else {
      if (!hasSchema(v, rule as SchemaSpec)) return false
    }
  }
  return true
}

/**
 * Validate that object, if it has schema keys, they satisfy the rules.
 * Missing keys are allowed.
 */
export function hasPartialSchema<S extends SchemaSpec>(obj: unknown, schema: S): obj is Partial<FromSchema<S>> {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false
  const o = obj as Record<string, unknown>
  for (const [k, rule] of Object.entries(schema)) {
    if (!Object.prototype.hasOwnProperty.call(o, k)) continue
    const v = o[k]
    if (typeof rule === 'string') {
      if (rule === 'object') {
        if (!(typeof v === 'object' && v !== null && !Array.isArray(v))) return false
      } else if (typeof v !== rule) {
        return false
      }
    } else if (isFunction(rule)) {
      if (!(rule as Guard<unknown>)(v)) return false
    } else {
      if (!hasPartialSchema(v, rule as SchemaSpec)) return false
    }
  }
  return true
}

export function objectOf<const G extends GuardsShape, const Opt extends readonly (keyof G)[] = []>(
  props: G,
  options?: Readonly<{ optional?: Opt; exact?: boolean; rest?: Guard<unknown> }>,
): (x: unknown) => x is Readonly<{ [K in Exclude<keyof G, Opt[number]>]-?: GuardType<G[K]> } & { [K in Opt[number]]?: GuardType<G[K]> }> {
  const optionalSet = new Set<keyof G>(options?.optional as readonly (keyof G)[] | undefined ?? [])
  const exact = options?.exact === true
  const rest = options?.rest
  return (x: unknown): x is Readonly<{ [K in Exclude<keyof G, Opt[number]>]-?: GuardType<G[K]> } & { [K in Opt[number]]?: GuardType<G[K]> }> => {
    if (typeof x !== 'object' || x === null || Array.isArray(x)) return false
    const obj = x as Record<string, unknown>
    for (const [k, g] of Object.entries(props) as [keyof G, Guard<unknown>][]) {
      const present = Object.prototype.hasOwnProperty.call(obj, k as string)
      const isOpt = optionalSet.has(k)
      if (!present && !isOpt) return false
      if (present && !g(obj[k as string])) return false
    }
    if (exact) {
      for (const k of Object.keys(obj)) {
        if (!(k in props)) return false
      }
    } else if (rest) {
      for (const k of Object.keys(obj)) {
        if (!(k in props) && !rest(obj[k])) return false
      }
    }
    return true
  }
}
