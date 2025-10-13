export type Guard<T> = (x: unknown) => x is T

export type GuardType<G> = G extends Guard<infer T> ? T : never

export type GuardsShape = Readonly<Record<string, Guard<unknown>>>
export type FromGuards<G extends GuardsShape> = Readonly<{ [K in keyof G]: GuardType<G[K]> }>

export type PrimitiveTag =
  | 'string'
  | 'number'
  | 'boolean'
  | 'symbol'
  | 'bigint'
  | 'function'
  | 'object'

export type SchemaSpec = Readonly<{ [k: string]: SchemaSpec | PrimitiveTag | Guard<unknown> }>
export type ResolveRule<R> =
  R extends 'string' ? string
    : R extends 'number' ? number
    : R extends 'boolean' ? boolean
    : R extends 'symbol' ? symbol
    : R extends 'bigint' ? bigint
    : R extends 'function' ? (...args: unknown[]) => unknown
    : R extends 'object' ? Record<string, unknown>
    : R extends Guard<infer U> ? U
    : R extends SchemaSpec ? FromSchema<R>
    : never

export type FromSchema<S extends SchemaSpec> = Readonly<{ [K in keyof S]: ResolveRule<S[K]> }>

export type Result<T, E = Error> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; error: E }>

export type UnionToIntersection<U> =
  (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export type TupleTypes<T extends readonly unknown[]> = T[number]
