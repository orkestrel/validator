// Core public types for guards, schemas, results, and shared options.

// A runtime type guard: returns true when `x` satisfies `T` and narrows the type.
export type Guard<T> = (x: unknown) => x is T

// Extract the guarded type `T` from a `Guard<T>`.
export type GuardType<G> = G extends Guard<infer T> ? T : never

// Mapping from string keys to guard functions.
export type GuardsShape = Readonly<Record<string, Guard<unknown>>>

// Resolve a `GuardsShape` to a readonly object of guarded property types.
export type FromGuards<G extends GuardsShape> = Readonly<{ [K in keyof G]: GuardType<G[K]> }>

// Primitive tags supported by schema specifications.
export type PrimitiveTag
	= | 'string'
		| 'number'
		| 'boolean'
		| 'symbol'
		| 'bigint'
		| 'function'
		| 'object'

// Schema specification: values are primitive tags, guard functions, or nested specs.
export type SchemaSpec = Readonly<{ [k: string]: SchemaSpec | PrimitiveTag | Guard<unknown> }>

// Resolve a single schema rule to its static TypeScript type.
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

// Resolve an entire schema spec `S` to a readonly object type.
export type FromSchema<S extends SchemaSpec> = Readonly<{ [K in keyof S]: ResolveRule<S[K]> }>

// Result type used by safe parsing helpers.
export type Result<T, E = Error>
	= | Readonly<{ ok: true, value: T }>
		| Readonly<{ ok: false, error: E }>

// Convert a union type to an intersection type.
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never

// Extract the element union from a tuple/readonly array type.
export type TupleTypes<T extends readonly unknown[]> = T[number]

// Deep comparison options.
export type DeepEqualOptions = {
	readonly compareSetOrder?: boolean // when true, Set order matters
	readonly compareMapOrder?: boolean // when true, Map iteration order matters
	readonly strictNumbers?: boolean // when true, +0/-0/NaN are strictly compared (default)
}

// Deep clone check options (extends deep equal options).
export type DeepCloneCheckOptions = DeepEqualOptions & {
	readonly allowSharedFunctions?: boolean // allow same function reference when checking clone
	readonly allowSharedErrors?: boolean // allow same Error reference when checking clone
}

// Internal deep-compare configuration (used by deep.ts implementation).
export type InternalDeepCompareOptions = { identityMustDiffer: boolean, opts: DeepCloneCheckOptions }

// Result of a deep comparison; includes path/reason when unequal.
export type DeepCompareResult
	= | { equal: true }
		| { equal: false, path: readonly (string | number | symbol)[], reason: string, detail?: string }

// JSON types for domain helpers.
export type JsonValue = null | boolean | number | string | JsonArray | JsonObject
export type JsonArray = ReadonlyArray<JsonValue>
export type JsonObject = Readonly<{ [k: string]: JsonValue }>

// HTTP method string literal union.
export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

// Option bag for hex color parsing (e.g., allow leading '#').
export interface HexColorOptions { readonly allowHash?: boolean }

// Option bag for hex string parsing.
export interface HexStringOptions { readonly evenLength?: boolean, readonly allow0x?: boolean }

// Options for objectOf; `optional` is a list of keys, `exact` disallows extras, `rest` validates extras.
export interface ObjectOfOptions<Opt extends readonly PropertyKey[] = readonly PropertyKey[]> {
	readonly optional?: Opt
	readonly exact?: boolean
	readonly rest?: Guard<unknown>
}

// Parsed absolute URL shape used by the portable URL parser.
export interface ParsedAbsoluteUrl {
	readonly protocol: string // includes trailing ':' (e.g., 'https:')
	readonly host: string
	readonly port: number | undefined
}

// TypedArray union for generic guards and helpers.
export type AnyTypedArray
	= | Int8Array | Uint8Array | Uint8ClampedArray
		| Int16Array | Uint16Array
		| Int32Array | Uint32Array
		| Float32Array | Float64Array
		| BigInt64Array | BigUint64Array

// Function helper types for reusable signatures.
export type AnyFunction = (...args: unknown[]) => unknown
export type AnyAsyncFunction = (...args: unknown[]) => Promise<unknown>
export type ZeroArgFunction = () => unknown
export type ZeroArgAsyncFunction = () => Promise<unknown>
export type PromiseFunction = AnyAsyncFunction // User‑friendly alias: any function that returns a Promise (non‑strict return type).
export type ZeroArgPromiseFunction = ZeroArgAsyncFunction // User‑friendly alias: zero‑argument function that returns a Promise.

/**
 * Empty variant type for common "empty-able" shapes.
 *
 * - `string` → '' (empty string literal)
 * - `ReadonlyArray<T>` → readonly []
 * - `ReadonlyMap<K, V>` → `ReadonlyMap<K, V>` (size not tracked in the type system)
 * - `ReadonlySet<T>` → `ReadonlySet<T>` (size not tracked in the type system)
 * - `Record<string | symbol, unknown>` → `Record<string | symbol, never>`
 */
export type EmptyOf<T>
	= T extends string ? ''
		: T extends ReadonlyArray<unknown> ? readonly []
			: T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<K, V>
				: T extends ReadonlySet<infer U> ? ReadonlySet<U>
					: T extends Record<string | symbol, unknown> ? Record<string | symbol, never>
						: never
