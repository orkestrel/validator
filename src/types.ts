/*****
 * Core public types for guards, schemas, and results.
 *****/

/**
 * A runtime type guard: returns true when `x` satisfies `T` and narrows the type.
 *
 * @example
 * ```ts
 * const isString: Guard<string> = (x): x is string => typeof x === 'string'
 * ```
 */
export type Guard<T> = (x: unknown) => x is T

/**
 * Extract the guarded type `T` from a `Guard<T>`.
 *
 * @example
 * ```ts
 * type T = GuardType<Guard<number>> // number
 * ```
 */
export type GuardType<G> = G extends Guard<infer T> ? T : never

/**
 * Mapping from string keys to guard functions.
 */
export type GuardsShape = Readonly<Record<string, Guard<unknown>>>

/**
 * Resolve a `GuardsShape` into a readonly object type of guarded property types.
 *
 * @example
 * ```ts
 * type Shape = { id: Guard<string>, age: Guard<number> }
 * type Obj = FromGuards<Shape> // { readonly id: string; readonly age: number }
 * ```
 */
export type FromGuards<G extends GuardsShape> = Readonly<{ [K in keyof G]: GuardType<G[K]> }>

/**
 * Primitive tags supported by schema specifications.
 */
export type PrimitiveTag
	= | 'string'
		| 'number'
		| 'boolean'
		| 'symbol'
		| 'bigint'
		| 'function'
		| 'object'

/**
 * Schema specification format: a readonly object whose values are either
 * primitive tags, guard functions, or nested schema specs.
 *
 * @example
 * ```ts
 * const userSpec = {
 *   id: 'string',
 *   age: 'number',
 *   meta: { active: 'boolean' },
 * } satisfies SchemaSpec
 * ```
 */
export type SchemaSpec = Readonly<{ [k: string]: SchemaSpec | PrimitiveTag | Guard<unknown> }>

/**
 * Resolve a schema rule to its static TypeScript type.
 */
export type ResolveRule<R>
	= R extends 'string' ? string
		: R extends 'number' ? number
			: R extends 'boolean' ? boolean
				: R extends 'symbol' ? symbol
					: R extends 'bigint' ? bigint
						: R extends 'function' ? (...args: unknown[]) => unknown
							: R extends 'object' ? Record<string, unknown>
								: R extends Guard<infer U> ? U
									: R extends SchemaSpec ? FromSchema<R>
										: never

/**
 * Resolve an entire schema spec `S` to a readonly object type.
 *
 * @example
 * ```ts
 * type User = FromSchema<{ id: 'string'; age: 'number' }>
 * // { readonly id: string; readonly age: number }
 * ```
 */
export type FromSchema<S extends SchemaSpec> = Readonly<{ [K in keyof S]: ResolveRule<S[K]> }>

/**
 * Result type used by safe parsing helpers.
 *
 * @example
 * ```ts
 * const ok: Result<number> = { ok: true, value: 1 }
 * const fail: Result<never, TypeError> = { ok: false, error: new TypeError('nope') }
 * ```
 */
export type Result<T, E = Error>
	= | Readonly<{ ok: true, value: T }>
		| Readonly<{ ok: false, error: E }>

/**
 * Convert a union type to an intersection type.
 */
export type UnionToIntersection<U>
	= (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/**
 * Extract the element union from a tuple/readonly array type.
 */
export type TupleTypes<T extends readonly unknown[]> = T[number]
