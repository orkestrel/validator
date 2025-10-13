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

// Validation path metadata used by diagnostics.
export type PathSegment = string | number | symbol
export type ValidationPath = ReadonlyArray<PathSegment>

// Options for creating rich TypeErrors.
export interface CreateTypeErrorOptions {
	readonly path?: ValidationPath // path to the failing property
	readonly label?: string // human label for the value (e.g., "user.age")
	readonly message?: string // custom message override
	readonly hint?: string // short hint for remediation
	readonly helpUrl?: string // optional link for more docs
}

// Common assert options accepted by assertion helpers.
export interface AssertOptions {
	readonly path?: ValidationPath // path to the failing property
	readonly label?: string // human label for the value (e.g., "user.age")
	readonly message?: string // custom message override
	readonly hint?: string // short hint for remediation
	readonly helpUrl?: string // optional link for more docs
}

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
