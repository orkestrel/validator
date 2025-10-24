// Core public types for guards and shared options.

// A runtime type guard: returns true when `x` satisfies `T` and narrows the type.
export type Guard<T> = (x: unknown) => x is T

// Extract the guarded type `T` from a `Guard<T>`.
export type GuardType<G> = G extends Guard<infer T> ? T : never

// Mapping from string keys to guard functions for object shapes.
export type GuardsShape = Readonly<Record<string, Guard<unknown>>>

// Resolve a GuardsShape to a readonly object type with guarded property types.
export type FromGuards<G extends GuardsShape> = Readonly<{ [K in keyof G]: GuardType<G[K]> }>

// Create a readonly object type from a GuardsShape where keys in K are optional (value may be undefined).
export type OptionalFromGuards<S extends GuardsShape, K extends readonly (keyof S)[]> = Readonly<{
	[P in keyof S]: P extends K[number] ? FromGuards<S>[P] | undefined : FromGuards<S>[P]
}>

// Map a tuple of element guards to a readonly tuple of their guarded types.
export type TupleFromGuards<Ts extends readonly Guard<unknown>[]> = Readonly<{
	[K in keyof Ts]: GuardType<Ts[K]>
}>

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/**
 * Intersection of the types guarded by a tuple of guards.
 *
 * Useful for `composedOf`/`intersectionOf` combinators to express precise output.
 */
export type IntersectionFromGuards<Gs extends readonly Guard<unknown>[]> = UnionToIntersection<GuardType<Gs[number]>>

// Function helper types for reusable signatures.
export type AnyFunction = (...args: unknown[]) => unknown
export type AnyAsyncFunction = (...args: unknown[]) => Promise<unknown>
export type ZeroArgFunction = () => unknown
export type ZeroArgAsyncFunction = () => Promise<unknown>
