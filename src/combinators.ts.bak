import type { Guard, GuardsShape, EmptyOf, FromGuardsWithOptional, GuardType, GuardedIntersection, GuardedTuple, MeasureKind, HttpMethod, HexColorOptions, HexStringOptions } from './types.js'
import { isRecord } from './objects.js'
import { isString, isIterable, isNumber, isFunction, isSymbol, isBoolean, isBigInt, isDate, isRegExp, isError, isPromise, isArrayBuffer, isSharedArrayBuffer, isPrimitive, isAsyncIterator } from './primitives.js'
import { isArray, isArrayBufferView, isTypedArray, isInt8Array, isUint8Array, isUint8ClampedArray, isInt16Array, isUint16Array, isInt32Array, isUint32Array, isFloat32Array, isFloat64Array, isBigInt64Array, isBigUint64Array } from './arrays.js'
import { isSet, isMap, isWeakMap, isWeakSet } from './collections.js'
import { isEmpty } from './emptiness.js'
import { countEnumerableProperties, peekIterable } from './helpers.js'
import {
	isCount,
	isCountMax,
	isCountMin,
	isCountRange,
	isLength,
	isLengthMax,
	isLengthMin,
	isLengthRange,
	isSize,
	isSizeMax,
	isSizeMin,
	isSizeRange,
	isMeasure,
	isMin,
	isMax,
	isRange,
} from './measurements.js'
import { isFiniteNumber } from './numbers.js'
import {
	isUUIDv4,
	isISODate,
	isISODateTime,
	isEmail,
	isURL,
	isPort,
	isMIMEType,
	isSlug,
	isBase64,
	isHex,
	isSemver,
	isJsonString,
	isJsonValue,
	isHTTPMethod,
	isIdentifier,
	isHost,
	isAscii,
	isHexColor,
	isIPv4String,
	isIPv6String,
	isHostnameString,
} from './domains.js'

// ------------------------------------------------------------
// Literals and exact matches (primitives)
// ------------------------------------------------------------

/**
 * Create a guard that accepts one of the provided literal values.
 *
 * @param literals - Allowed literal values
 * @returns Guard that narrows to the union of provided literal values
 * @example
 * ```ts
 * const g = literalOf('a', 'b', 1 as const)
 * g('a') // true
 * g('c') // false
 * ```
 */
export function literalOf<const Literals extends readonly (string | number | boolean)[]>(
	...literals: Literals
): Guard<Literals[number]> {
	return (x: unknown): x is Literals[number] => literals.some(l => Object.is(l, x))
}

/**
 * Guard for the `string` type (accepts any string).
 *
 * @returns Guard for strings
 * @example
 * ```ts
 * const g = stringOf()
 * g('ok') // true
 * g(123 as unknown) // false
 * ```
 */
export function stringOf(): Guard<string> {
	return (x: unknown) => isString(x)
}

/**
 * Guard for the `number` type (accepts any number).
 *
 * @returns Guard for numbers
 * @example
 * ```ts
 * const g = numberOf()
 * g(42) // true
 * g('42' as unknown) // false
 * ```
 */
export function numberOf(): Guard<number> {
	return (x: unknown) => isNumber(x)
}

/**
 * Guard for the `symbol` type.
 *
 * @returns Guard for symbols
 * @example
 * ```ts
 * const g = symbolOf()
 * g(Symbol('x')) // true
 * g(42 as unknown) // false
 * g('42' as unknown) // false
 * ```
 */
export function symbolOf(): Guard<symbol> {
	return (x: unknown) => isSymbol(x)
}

/**
 * Guard for `boolean` values.
 *
 * @returns Guard for booleans
 * @example
 * ```ts
 * const g = booleanOf()
 * g(true) // true
 * g(false) // true
 * g(0 as unknown) // false
 * ```
 */
export function booleanOf(): Guard<boolean> {
	return (x: unknown) => isBoolean(x)
}

/**
 * Guard for `bigint` values.
 *
 * @returns Guard for bigint
 * @example
 * ```ts
 * bigIntOf()(1n) // true
 * bigIntOf()('1' as unknown) // false
 * ```
 */
export function bigIntOf(): Guard<bigint> {
	return (x: unknown) => isBigInt(x)
}

/** Guard for `null` only. */
export function nullOf(): Guard<null> {
	return (x: unknown): x is null => x === null
}

/** Guard for `undefined` only. */
export function undefinedOf(): Guard<undefined> {
	return (x: unknown): x is undefined => x === undefined
}

/** Guard for Date objects. */
export function dateOf(): Guard<Date> {
	return (x: unknown) => isDate(x)
}

/** Guard for RegExp objects. */
export function regExpOf(): Guard<RegExp> {
	return (x: unknown) => isRegExp(x)
}

/** Guard for Error objects. */
export function errorOf(): Guard<Error> {
	return (x: unknown) => isError(x)
}

/** Guard for ArrayBuffer instances. */
export function arrayBufferOf(): Guard<ArrayBuffer> {
	return (x: unknown) => isArrayBuffer(x)
}

/** Guard for SharedArrayBuffer instances (feature-detected). */
export function sharedArrayBufferOf(): Guard<SharedArrayBuffer> {
	return (x: unknown) => isSharedArrayBuffer(x)
}

/** Guard for any ArrayBuffer view (TypedArray or DataView). */
export function arrayBufferViewOf(): Guard<ArrayBufferView> {
	return (x: unknown): x is ArrayBufferView => isArrayBufferView(x)
}

/** Guard for any concrete TypedArray instance. */
export function typedArrayOf(): Guard<Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array> {
	return (x: unknown) => isTypedArray(x)
}

/** Guard for Int8Array. */
export function int8ArrayOf(): Guard<Int8Array> { return (x: unknown) => isInt8Array(x) }
/** Guard for Uint8Array. */
export function uint8ArrayOf(): Guard<Uint8Array> { return (x: unknown) => isUint8Array(x) }
/** Guard for Uint8ClampedArray. */
export function uint8ClampedArrayOf(): Guard<Uint8ClampedArray> { return (x: unknown) => isUint8ClampedArray(x) }
/** Guard for Int16Array. */
export function int16ArrayOf(): Guard<Int16Array> { return (x: unknown) => isInt16Array(x) }
/** Guard for Uint16Array. */
export function uint16ArrayOf(): Guard<Uint16Array> { return (x: unknown) => isUint16Array(x) }
/** Guard for Int32Array. */
export function int32ArrayOf(): Guard<Int32Array> { return (x: unknown) => isInt32Array(x) }
/** Guard for Uint32Array. */
export function uint32ArrayOf(): Guard<Uint32Array> { return (x: unknown) => isUint32Array(x) }
/** Guard for Float32Array. */
export function float32ArrayOf(): Guard<Float32Array> { return (x: unknown) => isFloat32Array(x) }
/** Guard for Float64Array. */
export function float64ArrayOf(): Guard<Float64Array> { return (x: unknown) => isFloat64Array(x) }
/** Guard for BigInt64Array. */
export function bigInt64ArrayOf(): Guard<BigInt64Array> { return (x: unknown) => isBigInt64Array(x) }
/** Guard for BigUint64Array. */
export function bigUint64ArrayOf(): Guard<BigUint64Array> { return (x: unknown) => isBigUint64Array(x) }

/**
 * Guard for primitive values per `typeof` (string, number, boolean, symbol, bigint) and function.
 *
 * @returns Guard for primitive or function values
 * @example
 * ```ts
 * primitiveOf()('hello') // true
 * primitiveOf()({} as unknown) // false
 * ```
 */
export function primitiveOf(): Guard<string | number | boolean | symbol | bigint | ((...args: unknown[]) => unknown)> {
	return (x: unknown): x is string | number | boolean | symbol | bigint | ((...args: unknown[]) => unknown) => isPrimitive(x)
}

/**
 * Guard for AsyncIterable values.
 *
 * @returns Guard for `AsyncIterable<unknown>`
 * @example
 * ```ts
 * async function* agen() { yield 1 }
 * asyncIteratorOf()(agen()) // true
 * ```
 */
export function asyncIteratorOf(): Guard<AsyncIterable<unknown>> {
	return (x: unknown): x is AsyncIterable<unknown> => isAsyncIterator(x)
}

/**
 * Combine two guards (or predicates) with logical AND: value must satisfy both.
 *
 * Overloads:
 * - andOf(guardA, guardB) → typed intersection guard
 * - andOf(base, refine) → refinement where `refine` accepts `base` type and narrows it further
 * - andOf(predicateA, predicateB) → untyped guard (no TS narrowing)
 *
 * @param a - First guard or boolean predicate
 * @param b - Second guard, refinement, or boolean predicate
 * @returns Guard for the intersection/refinement (or an untyped guard for predicates)
 * @example
 * ```ts
 * const nonEmpty = andOf(isString, (s: string): s is string => s.length > 0)
 * nonEmpty('a') // true
 * nonEmpty('') // false
 * ```
 */
export function andOf<A, B>(a: Guard<A>, b: Guard<B>): Guard<A & B>
export function andOf<T, U extends T>(a: Guard<T>, b: (x: T) => x is U): Guard<U>
export function andOf<T>(a: Guard<T>, b: (x: T) => boolean): Guard<T>
export function andOf(a: (x: unknown) => boolean, b: (x: unknown) => boolean): Guard<unknown>
export function andOf(a: (x: unknown) => boolean, b: (x: unknown) => boolean): Guard<unknown> {
	return (x: unknown): x is unknown => a(x) && b(x)
}

/**
 * Combine two guards (or predicates) with logical OR: value may satisfy either.
 *
 * Overloads:
 * - orOf(guardA, guardB) → typed union guard
 * - orOf(predicateA, predicateB) → untyped guard (no TS narrowing)
 *
 * @param a - First guard or boolean predicate
 * @param b - Second guard or boolean predicate
 * @returns Guard for the union of both types (or an untyped guard for predicates)
 * @example
 * ```ts
 * const g = orOf(literalOf('a' as const), literalOf('b' as const))
 * g('a') // true
 * g('c') // false
 * ```
 */
export function orOf<A, B>(a: Guard<A>, b: Guard<B>): Guard<A | B>
export function orOf(a: (x: unknown) => boolean, b: (x: unknown) => boolean): Guard<unknown>
export function orOf(a: (x: unknown) => boolean, b: (x: unknown) => boolean): Guard<unknown> {
	return (x: unknown): x is unknown => a(x) || b(x)
}

/**
 * Negate a guard/predicate.
 *
 * @param g - Guard or boolean predicate to negate
 * @returns Guard that accepts values where `g(x)` is false
 * @example
 * ```ts
 * const notString = notOf(isString)
 * notString('x') // false
 * notString(1) // true
 * ```
 */
export function notOf(g: (x: unknown) => boolean): Guard<unknown> {
	return (x: unknown): x is unknown => !g(x)
}

/**
 * Set complement within a base set: from a base guard, exclude a subset guard/predicate.
 *
 * Carefully typed: preserves the base type minus the excluded variant using `Exclude<Base, Excluded>`.
 *
 * @param base - Base guard that defines the superset
 * @param exclude - Guard or refinement predicate identifying the subset to remove
 * @returns Guard for values in `base` that do not satisfy `exclude`
 * @example
 * ```ts
 * const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber })
 * const isRect   = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber })
 * const isShape  = unionOf(isCircle, isRect)
 * const notCircle = complementOf(isShape, isCircle) // Guard<{ kind: 'rect', w: number, h: number }>
 * notCircle({ kind: 'rect', w: 1, h: 2 }) // true
 * notCircle({ kind: 'circle', r: 3 }) // false
 * ```
 */
export function complementOf<TBase, TExclude extends TBase>(
	base: Guard<TBase>,
	exclude: Guard<TExclude> | ((x: TBase) => x is TExclude),
): Guard<Exclude<TBase, TExclude>> {
	return (x: unknown): x is Exclude<TBase, TExclude> => base(x) && !(exclude as (x: unknown) => boolean)(x)
}

/**
 * Create a union guard from multiple guards or predicates.
 *
 * Overloads:
 * - unionOf(...guards) → typed union guard
 * - unionOf(...predicates) → untyped guard (no TS narrowing)
 *
 * @param guards - Guards or predicates to union
 * @returns Guard for the union of all guarded types
 * @example
 * ```ts
 * const AB = unionOf(literalOf('a' as const), literalOf('b' as const))
 * AB('a') // true
 * AB('c' as unknown) // false
 * ```
 */
export function unionOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<GuardType<Gs[number]>>
export function unionOf(...predicates: readonly ((x: unknown) => boolean)[]): Guard<unknown>
export function unionOf(...guardsOrPreds: readonly ((x: unknown) => boolean)[]): Guard<unknown> {
	return (x: unknown): x is unknown => guardsOrPreds.some(g => g(x))
}

/**
 * Create an intersection guard from multiple guards or predicates.
 *
 * Overloads:
 * - intersectionOf(...guards) → typed intersection guard
 * - intersectionOf(...predicates) → untyped guard (no TS narrowing)
 *
 * @param guards - Guards or predicates to intersect
 * @returns Guard for the intersection of all guarded types
 * @example
 * ```ts
 * const nonEmptyString = intersectionOf(isString, whereOf(isString, s => s.length > 0))
 * nonEmptyString('x') // true
 * nonEmptyString('') // false
 * ```
 */
export function intersectionOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<GuardedIntersection<Gs>>
export function intersectionOf(...predicates: readonly ((x: unknown) => boolean)[]): Guard<unknown>
export function intersectionOf(...guardsOrPreds: readonly ((x: unknown) => boolean)[]): Guard<unknown> {
	return (x: unknown): x is unknown => guardsOrPreds.every(g => g(x))
}

/**
 * Compose multiple guards via logical AND. All must pass.
 *
 * Overloads:
 * - allOf(...guards) → typed intersection guard
 * - allOf(...predicates) → untyped guard (no TS narrowing)
 *
 * @param guards - Guards or predicates to combine
 * @returns Guard for the intersection of all guarded types
 * @example
 * ```ts
 * const alpha2 = allOf(
 *   (x: unknown): x is string => typeof x === 'string' && /^[A-Za-z]+$/.test(x),
 *   (x: unknown): x is string => typeof x === 'string' && x.length === 2,
 * )
 * alpha2('ab') // true
 * alpha2('a1') // false
 * ```
 */
export function allOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<GuardedIntersection<Gs>>
export function allOf(...predicates: readonly ((x: unknown) => boolean)[]): Guard<unknown>
export function allOf(...guardsOrPreds: readonly ((x: unknown) => boolean)[]): Guard<unknown> {
	return (x: unknown): x is unknown => {
		for (const g of guardsOrPreds) if (!g(x)) return false
		return true
	}
}

/**
 * Where-clause style refinement: require that `predicate(x)` returns true after `base(x)` passes.
 * Preserves the original type `T` (no further narrowing), making it ideal for confirming facts about `T`.
 *
 * @param base - Base guard to check first
 * @param predicate - Boolean predicate evaluated on the same value after `base` passes
 * @returns Guard that accepts values of type `T` satisfying `predicate`
 * @example
 * ```ts
 * const nonEmpty = whereOf(isString, s => s.length > 0)
 * nonEmpty('a') // true
 * nonEmpty('') // false
 * ```
 */
export function whereOf<T>(base: Guard<T>, predicate: (x: T) => boolean): Guard<T>
export function whereOf<T, _U extends T>(base: Guard<T>, predicate: (x: T) => x is _U): Guard<T>
export function whereOf<T>(base: Guard<T>, predicate: (x: T) => boolean): Guard<T> {
	return (x: unknown): x is T => {
		if (!base(x)) return false
		return predicate(x as T)
	}
}

/**
 * Lazy guard that defers creation until first use. Useful for recursive types.
 *
 * @param thunk - Function that returns the actual guard
 * @returns Guard produced by invoking `thunk`
 * @example Lazy creation for recursive structures
 * ```ts
 * type Tree = { v: number; children?: readonly Tree[] }
 * const isTree: Guard<Tree> = lazyOf(() => objectOf({ v: isNumber, children: optionalOf(arrayOf(lazyOf(() => isTree))) }))
 * isTree({ v: 1, children: [{ v: 2 }] }) // true
 * ```
 */
export function lazyOf<T>(thunk: () => Guard<T>): Guard<T> {
	return (x: unknown): x is T => thunk()(x)
}

/**
 * Transform and validate: when `base(x)` passes, compute `project(x)` and validate the result with `to`.
 * Pure and deterministic. Use this to derive and validate a property, a normalized value, etc.
 *
 * @param base - Base guard to check first
 * @param project - Projection function applied to `x` after base passes
 * @param to - Guard that validates the projected value
 * @returns Guard that accepts values for which `base` passes and the projected value matches `to`
 * @example
 * ```ts
 * const hasIdString = transformOf(
 *   objectOf({ id: isString }),
 *   (o) => o.id,
 *   isString,
 * )
 * hasIdString({ id: 'x' }) // true
 * hasIdString({ id: 1 } as unknown) // false
 * ```
 */
export function transformOf<T, U>(base: Guard<T>, project: ((x: T) => U) | ((x: T) => (arg: T) => U), to: Guard<U>): Guard<T>
export function transformOf<T, _U>(base: Guard<T>, project: (x: T) => unknown, to: (x: unknown) => boolean): Guard<T> {
	return (x: unknown): x is T => {
		if (!base(x)) return false
		const projected = project(x)
		const value = typeof projected === 'function' ? (projected as (arg: unknown) => unknown)(x) : projected
		return to(value)
	}
}

// ------------------------------------------------------------
// Optionality, nullability, and emptiness
// ------------------------------------------------------------

/**
 * Allow `undefined` in addition to values accepted by `g`.
 *
 * @param g - Base guard
 * @returns Guard for `T | undefined`
 */
export function optionalOf<T>(g: Guard<T>): Guard<T | undefined>
/**
 * Object-shape convenience: mark selected keys as optional and validate exactly those keys.
 * Extras are disallowed by default. To allow extras that satisfy a value guard, pass `options.rest`.
 *
 * @param shape - Mapping from keys to guards
 * @param optionalKeys - Keys to make optional
 * @param options - Optional configuration
 * @remarks
 * options:
 * - rest — Guard<unknown> applied to extra keys' values; when omitted, extra keys are rejected (exact by default)
 * @returns Guard for an exact object with specified optional keys
 * @example
 * ```ts
 * const Guard = optionalOf({ id: isString, note: isString }, ['note' as const], { rest: isNumber })
 * Guard({ id: 'x', a: 1 }) // true
 * Guard({ id: 'x', a: 'nope' } as unknown) // false
 * ```
 */
export function optionalOf<
	S extends GuardsShape,
	OK extends readonly (keyof S)[],
>(shape: S, optionalKeys: OK, options?: Readonly<{ rest?: Guard<unknown> }>): Guard<FromGuardsWithOptional<S, OK>>
export function optionalOf<T>(a: Guard<T> | GuardsShape, b?: readonly (string | number | symbol)[], c?: Readonly<{ rest?: Guard<unknown> }>): Guard<unknown> {
	if (typeof a === 'function') {
		const g = a as Guard<T>
		return ((x: unknown): x is T | undefined => x === undefined || g(x)) as Guard<unknown>
	}
	const shape = a as GuardsShape
	const opt = new Set<PropertyKey>(b ?? [])
	const declared = Object.keys(shape) as string[]
	const rest = c?.rest
	return ((x: unknown): x is FromGuardsWithOptional<typeof shape, readonly (keyof typeof shape)[]> => {
		if (!isRecord(x)) return false
		const obj = x as Record<string, unknown>
		// Validate declared keys
		for (const k of declared) {
			const has = Object.prototype.hasOwnProperty.call(obj, k)
			if (!has) {
				if (!opt.has(k)) return false
				continue
			}
			const g = shape[k] as Guard<unknown>
			if (!g(obj[k])) return false
		}
		// Validate extras
		for (const k of Object.keys(obj)) {
			if (Object.prototype.hasOwnProperty.call(shape, k)) continue
			if (!rest) return false
			if (!rest(obj[k])) return false
		}
		return true
	}) as Guard<unknown>
}

/**
 * Allow `null` in addition to values accepted by `g`.
 *
 * @param g - Base guard
 * @returns Guard for `T | null`
 * @example
 * ```ts
 * const maybeString = nullableOf(isString)
 * maybeString(null) // true
 * ```
 */
export function nullableOf<T>(g: Guard<T>): Guard<T | null> {
	return (x: unknown): x is T | null => x === null || g(x)
}

/**
 * Allow an "empty" value for common empty-able shapes in addition to values accepted by `g`.
 *
 * @param g - Base guard applied to non-empty values
 * @returns Guard that accepts empty values for supported shapes or values matching `g`
 * @example
 * ```ts
 * const NumbersOrEmpty = emptyOf(arrayOf(isNumber))
 * NumbersOrEmpty([]) // true
 * NumbersOrEmpty([1]) // true
 * ```
 */
export function emptyOf<T>(g: Guard<T>): Guard<T | EmptyOf<T>> {
	return (x: unknown): x is T | EmptyOf<T> => isEmpty(x) || g(x)
}

/**
 * Require non-emptiness for empty-able shapes, then apply `g`.
 * Uses a small iterator peek for generic Iterables.
 *
 * @param g - Base guard applied after non-emptiness is established
 * @returns Guard for non-empty values matching `g`
 * @example
 * ```ts
 * const NonEmptyNumbers = nonEmptyOf(arrayOf(isNumber))
 * NonEmptyNumbers([1]) // true
 * NonEmptyNumbers([]) // false
 * ```
 */
export function nonEmptyOf<T>(g: Guard<T>): Guard<T> {
	return (x: unknown): x is T => {
		// Strings
		if (typeof x === 'string') return x.length > 0 && g(x)
		// Arrays
		if (Array.isArray(x)) return x.length > 0 && g(x)
		// Map/Set
		if (x instanceof Map) return x.size > 0 && g(x)
		if (x instanceof Set) return x.size > 0 && g(x)
		// Generic Iterable (custom types)
		if (isIterable(x)) {
			const { empty, replay } = peekIterable(x)
			return !empty && g(replay as unknown as T)
		}
		// Plain objects: require at least one own enumerable key/symbol
		if (isRecord(x)) return countEnumerableProperties(x) > 0 && g(x)
		// Other shapes: pass through
		return g(x)
	}
}

// ------------------------------------------------------------
// Object shapes, records, discriminated unions, and enums
// ------------------------------------------------------------

/**
 * Build a guard from a shape of property guards. Exact by default: extra own keys are rejected.
 * To allow additional keys, provide a `rest` guard that validates extra property values.
 * Use {@link optionalOf} with a shape to mark selected keys as optional.
 *
 * @param props - Mapping from property names to guards
 * @param options - Optional configuration object
 * @remarks
 * options:
 * - rest — Guard<unknown> applied to extra keys' values; when omitted, extra keys are rejected (exact by default)
 * @returns Guard for an exact object matching `props` (plus extras validated by `rest` if provided)
 * @example
 * ```ts
 * const User = objectOf({ id: isString })
 * User({ id: 'x' }) // true
 * User({ id: 'x', extra: 1 }) // false
 * ```
 * @example
 * ```ts
 * const Bag = objectOf({ id: isString }, { rest: isNumber })
 * Bag({ id: 'b', a: 1 }) // true
 * Bag({ id: 'b', a: 'x' }) // false
 * ```
 */
export function objectOf<const P extends GuardsShape>(
	props: P,
	options: Readonly<{ rest?: Guard<unknown> }> = {},
): Guard<Readonly<{ [K in keyof P]: GuardType<P[K]> }>> {
	const declaredKeys = Object.keys(props) as readonly (keyof P & string)[]
	const rest = options.rest
	return (x: unknown): x is Readonly<{ [K in keyof P]: GuardType<P[K]> }> => {
		if (!isRecord(x)) return false
		const obj = x as Record<string, unknown>
		// Validate declared keys (presence + value)
		for (const k of declaredKeys) {
			if (!Object.prototype.hasOwnProperty.call(obj, k)) return false
			const g = props[k] as Guard<unknown>
			if (!g(obj[k as string])) return false
		}
		// Extras
		for (const k of Object.keys(obj)) {
			if (Object.prototype.hasOwnProperty.call(props, k)) continue
			if (!rest) return false
			if (!rest(obj[k])) return false
		}
		return true
	}
}

/**
 * Build a sub-shape by picking keys from an existing shape.
 *
 * @param shape - Source shape
 * @param keys - Keys to pick
 * @returns A new shape containing only `keys`
 * @example
 * ```ts
 * const base = { id: isString, age: isNumber, name: isString } as const
 * const picked = pickOf(base, ['id' as const, 'name' as const])
 * ```
 */
export function pickOf<S extends GuardsShape, K extends readonly (keyof S)[]>(shape: S, keys: K): Pick<S, K[number]> {
	const out: Record<string, Guard<unknown>> = {}
	for (const k of keys as readonly (keyof S & string)[]) {
		if (Object.prototype.hasOwnProperty.call(shape, k)) out[k] = shape[k]
	}
	return out as Pick<S, K[number]>
}

/**
 * Build a sub-shape by omitting keys from an existing shape.
 *
 * @param shape - Source shape
 * @param keys - Keys to omit
 * @returns A new shape excluding `keys`
 * @example
 * ```ts
 * const base = { id: isString, age: isNumber, name: isString } as const
 * const omitted = omitOf(base, ['age' as const])
 * ```
 */
export function omitOf<S extends GuardsShape, K extends readonly (keyof S)[]>(shape: S, keys: K): Omit<S, K[number]> {
	const skip = new Set<PropertyKey>(keys as readonly PropertyKey[])
	const out: Record<string, Guard<unknown>> = {}
	for (const k of Object.keys(shape)) {
		if (!skip.has(k)) out[k] = shape[k]
	}
	return out as Omit<S, K[number]>
}

/**
 * Convenience: make every key in `shape` optional (exact by default, no extras).
 *
 * @param shape - Source shape
 * @returns Guard for an object where all keys of `shape` are optional
 * @example
 * ```ts
 * const PartialUser = partialOf({ id: isString, age: isNumber })
 * PartialUser({}) // true
 * ```
 */
export function partialOf<S extends GuardsShape>(shape: S): Guard<FromGuardsWithOptional<S, readonly (keyof S)[]>> {
	return optionalOf(shape, Object.keys(shape) as readonly (keyof S)[])
}

/**
 * Create a discriminated union guard from a mapping of discriminator values to guards.
 * Keys must be strings; non-string discriminator values are rejected.
 *
 * @param disc - Discriminator key on the value (string property)
 * @param mapping - Map from discriminator string to guard for that variant
 * @returns Guard for the union of all variant guarded types
 * @example
 * ```ts
 * const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber })
 * const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber })
 * const isShape = discriminatedUnionOf('kind', { circle: isCircle, rect: isRect } as const)
 * isShape({ kind: 'rect', w: 2, h: 3 }) // true
 * ```
 */
export function discriminatedUnionOf<
	K extends string,
	const M extends Readonly<Record<string, Guard<unknown>>>,
>(disc: K, mapping: M): Guard<GuardType<M[keyof M]>> {
	const keys = new Set(Object.keys(mapping))
	return (x: unknown): x is GuardType<M[keyof M]> => {
		if (!isRecord(x)) return false
		const tag = x[disc as string]
		if (!isString(tag)) return false
		if (!keys.has(tag)) return false
		const g = mapping[tag as keyof M]
		return g ? (g as Guard<unknown>)(x) : false
	}
}

/**
 * Guard from a native enum (object of string/number values).
 *
 * @param e - Enum object
 * @returns Guard that accepts any value of the enum
 * @example
 * ```ts
 * enum Color { Red = 'RED', Blue = 'BLUE' }
 * const isColor = enumOf(Color)
 * isColor('RED') // true
 * ```
 */
export function enumOf<E extends Record<string, string | number>>(e: E): Guard<E[keyof E]> {
	const values = new Set(Object.values(e) as (string | number)[])
	return (x: unknown): x is E[keyof E] => values.has(x as string | number)
}

/**
 * Guard for a plain-object record whose values match a guard or predicate.
 *
 * Overloads:
 * - recordOf(guard) → typed record guard
 * - recordOf(predicate) → untyped record guard (no TS narrowing)
 *
 * @param valueGuard - Guard/predicate applied to each property value
 * @returns Guard for a record of values matching `valueGuard`
 * @example
 * ```ts
 * const NumbersByKey = recordOf(isNumber)
 * NumbersByKey({ a: 1 }) // true
 * ```
 */
export function recordOf<T>(valueGuard: Guard<T>): Guard<Record<string, T>>
export function recordOf(valuePredicate: (x: unknown) => boolean): Guard<Record<string, unknown>>
export function recordOf(valueGuardOrPred: (x: unknown) => boolean): Guard<Record<string, unknown>> {
	return (x: unknown): x is Record<string, unknown> => {
		if (!isRecord(x)) return false
		for (const k of Object.keys(x)) {
			if (!valueGuardOrPred((x as Record<string, unknown>)[k])) return false
		}
		return true
	}
}

/**
 * Guard that tests membership in the keys of a provided object literal.
 *
 * @param obj - Object whose keys form the allowed set
 * @returns Guard that accepts keys of `obj`
 * @example
 * ```ts
 * const Key = keyOf({ a: 1, b: 2 } as const)
 * Key('a') // true
 * Key('c' as unknown as string) // false
 * ```
 */
export function keyOf<const O extends Readonly<Record<PropertyKey, unknown>>>(obj: O): Guard<keyof O> {
	return (x: unknown): x is keyof O => unionOf(stringOf(), symbolOf(), numberOf())(x) && x in obj
}

// ------------------------------------------------------------
// Sequences (arrays/tuples/iterables) and collections (Set/Map)
// ------------------------------------------------------------

/**
 * Guard for an array whose elements satisfy the provided element guard or predicate.
 *
 * Overloads:
 * - arrayOf(guard) → typed element array guard
 * - arrayOf(predicate) → untyped array guard (no TS narrowing for elements)
 *
 * @param elem - Element guard or boolean predicate
 * @returns Guard for `ReadonlyArray<T>` (or `ReadonlyArray<unknown>` when using a predicate)
 * @example
 * ```ts
 * const Strings = arrayOf(isString)
 * Strings(['a']) // true
 * ```
 */
export function arrayOf<T>(elem: Guard<T>): Guard<ReadonlyArray<T>>
export function arrayOf(elem: (x: unknown) => boolean): Guard<ReadonlyArray<unknown>>
export function arrayOf(elem: (x: unknown) => boolean): Guard<ReadonlyArray<unknown>> {
	return (x: unknown): x is ReadonlyArray<unknown> => Array.isArray(x) && x.every(elem)
}

/**
 * Guard for a fixed-length tuple with per-index guards or predicates.
 *
 * Overloads:
 * - tupleOf(...guards) → typed readonly tuple guard
 * - tupleOf(...predicates) → untyped readonly array guard (exact length at runtime; no TS tuple narrowing)
 *
 * @param guards - Per-index guards/predicates for the tuple
 * @returns Guard for a readonly tuple of guarded types (or `readonly unknown[]` for predicates)
 * @example
 * ```ts
 * const T = tupleOf(isNumber, isString)
 * T([1, 'x']) // true
 * ```
 */
export function tupleOf<const Gs extends readonly Guard<unknown>[]>(
	...guards: Gs
): Guard<GuardedTuple<Gs>>
export function tupleOf(...predicates: readonly ((x: unknown) => boolean)[]): Guard<readonly unknown[]>
export function tupleOf(...guardsOrPreds: readonly ((x: unknown) => boolean)[]): Guard<readonly unknown[]> {
	return (x: unknown): x is readonly unknown[] => {
		if (!Array.isArray(x) || x.length !== guardsOrPreds.length) return false
		for (let i = 0; i < guardsOrPreds.length; i++) {
			const guard = guardsOrPreds[i]
			if (!guard || !guard(x[i])) return false
		}
		return true
	}
}

/**
 * Guard that validates every element of an iterable using the provided element guard or predicate.
 *
 * Overloads:
 * - iterableOf(guard) → typed iterable guard
 * - iterableOf(predicate) → untyped iterable guard (no TS element narrowing)
 *
 * @param elemGuard - Guard/predicate applied to each iterated element
 * @returns Guard for `Iterable<T>` (or `Iterable<unknown>` for predicates)
 * @example
 * ```ts
 * function* gen() { yield 1; yield 2 }
 * const G = iterableOf(isNumber)
 * G(gen()) // true
 * ```
 */
export function iterableOf<T>(elemGuard: Guard<T>): Guard<Iterable<T>>
export function iterableOf(elemPredicate: (x: unknown) => boolean): Guard<Iterable<unknown>>
export function iterableOf(elemGuardOrPred: (x: unknown) => boolean): Guard<Iterable<unknown>> {
	return (x: unknown): x is Iterable<unknown> => {
		if (!isIterable(x)) return false
		for (const v of x) {
			if (!elemGuardOrPred(v)) return false
		}
		return true
	}
}

/**
 * Guard for a Set whose elements satisfy the given guard or predicate.
 *
 * Overloads:
 * - setOf(guard) → typed set guard
 * - setOf(predicate) → untyped set guard (no TS element narrowing)
 *
 * @param elemGuard - Guard/predicate for Set elements
 * @returns Guard for `ReadonlySet<T>` (or `ReadonlySet<unknown>` for predicates)
 * @example
 * ```ts
 * const NumSet = setOf(isNumber)
 * NumSet(new Set([1])) // true
 * ```
 */
export function setOf<T>(elemGuard: Guard<T>): Guard<ReadonlySet<T>>
export function setOf(elemPredicate: (x: unknown) => boolean): Guard<ReadonlySet<unknown>>
export function setOf(elemGuardOrPred: (x: unknown) => boolean): Guard<ReadonlySet<unknown>> {
	return (x: unknown): x is ReadonlySet<unknown> => {
		if (!(x instanceof Set)) return false
		for (const v of x as Set<unknown>) {
			if (!elemGuardOrPred(v)) return false
		}
		return true
	}
}

/**
 * Guard for a Map whose keys and values satisfy the given guards or predicates.
 *
 * Overloads:
 * - mapOf(keyGuard, valueGuard) → typed map guard
 * - mapOf(keyPredicate, valuePredicate) → untyped map guard (no TS key/value narrowing)
 *
 * @param keyGuard - Guard/predicate for Map keys
 * @param valueGuard - Guard/predicate for Map values
 * @returns Guard for `ReadonlyMap<K, V>` (or `ReadonlyMap<unknown, unknown>` for predicates)
 * @example
 * ```ts
 * const M = mapOf(isString, isNumber)
 * M(new Map([['a', 1]])) // true
 * ```
 */
export function mapOf<K, V>(keyGuard: Guard<K>, valueGuard: Guard<V>): Guard<ReadonlyMap<K, V>>
export function mapOf(keyPredicate: (x: unknown) => boolean, valuePredicate: (x: unknown) => boolean): Guard<ReadonlyMap<unknown, unknown>>
export function mapOf(keyGuardOrPred: (x: unknown) => boolean, valueGuardOrPred: (x: unknown) => boolean): Guard<ReadonlyMap<unknown, unknown>> {
	return (x: unknown): x is ReadonlyMap<unknown, unknown> => {
		if (!(x instanceof Map)) return false
		for (const [k, v] of x as Map<unknown, unknown>) {
			if (!keyGuardOrPred(k) || !valueGuardOrPred(v)) return false
		}
		return true
	}
}

/**
 * Guard for WeakMap instances.
 *
 * @returns Guard for `WeakMap<object, unknown>`
 * @example
 * ```ts
 * weakMapOf()(new WeakMap()) // true
 * weakMapOf()({} as unknown) // false
 * ```
 */
export function weakMapOf(): Guard<WeakMap<object, unknown>> { return (x: unknown): x is WeakMap<object, unknown> => isWeakMap(x) }

/**
 * Guard for WeakSet instances.
 *
 * @returns Guard for `WeakSet<object>`
 * @example
 * ```ts
 * weakSetOf()(new WeakSet()) // true
 * weakSetOf()([] as unknown) // false
 * ```
 */
export function weakSetOf(): Guard<WeakSet<object>> { return (x: unknown): x is WeakSet<object> => isWeakSet(x) }

/**
 * Guard that accepts strings matching the provided regular expression.
 *
 * Overloads:
 * - matchOf(re) → Guard<string>
 * - matchOf(base, re) → Guard<T> (preserves the base string subtype)
 *
 * @example
 * ```ts
 * matchOf(/^[a-z]+$/)('abc') // true
 * ```
 */
export function matchOf(re: RegExp): Guard<string>
export function matchOf<T extends string>(base: Guard<T>, re: RegExp): Guard<T>
export function matchOf<T extends string>(reOrBase: RegExp | Guard<T>, re?: RegExp): Guard<string> | Guard<T> {
	if (re instanceof RegExp && typeof reOrBase === 'function') {
		const base = reOrBase as Guard<T>
		return (x: unknown): x is T => base(x) && re.test(x as string)
	}
	const onlyRe = reOrBase as RegExp
	return (x: unknown): x is string => isString(x) && onlyRe.test(x)
}

// Starting-with string guard
export function startingWithOf(prefix: string): Guard<string>
export function startingWithOf<T extends string>(base: Guard<T>, prefix: string): Guard<T>
/**
 * Guard for strings that start with a specific prefix.
 *
 * Overloads:
 * - startingWithOf(prefix) → Guard<string>
 * - startingWithOf(base, prefix) → Guard<T> (preserves the base string subtype)
 *
 * @param prefixOrBase - Either the literal prefix (string), or a base guard for composition
 * @param prefix - When composing with a base guard, the required prefix to check
 * @returns Guard<string> for the simple form, or Guard<T> when composed with a base guard
 * @example
 * ```ts
 * const g = startingWithOf('pre')
 * g('prefix') // true
 * g('suffix') // false
 * ```
 */
export function startingWithOf<T extends string>(prefixOrBase: string | Guard<T>, prefix?: string): Guard<string> | Guard<T> {
	if (typeof prefixOrBase === 'function' && typeof prefix === 'string') {
		const base = prefixOrBase as Guard<T>
		return (x: unknown): x is T => base(x) && (x as string).startsWith(prefix)
	}
	const p = prefixOrBase as string
	return (x: unknown): x is string => isString(x) && x.startsWith(p)
}

/**
 * Guard for strings that end with a specific suffix.
 *
 * Overloads:
 * - endingWithOf(suffix) → Guard<string>
 * - endingWithOf(base, suffix) → Guard<T> (preserves the base string subtype)
 *
 * @param suffixOrBase - Either the literal suffix (string), or a base guard for composition
 * @param suffix - When composing with a base guard, the required suffix to check
 * @returns Guard<string> for the simple form, or Guard<T> when composed with a base guard
 * @example
 * ```ts
 * const g = endingWithOf('fix')
 * g('prefix') // true
 * g('suf') // false
 * ```
 */
export function endingWithOf<T extends string>(suffixOrBase: string | Guard<T>, suffix?: string): Guard<string> | Guard<T> {
	if (typeof suffixOrBase === 'function' && typeof suffix === 'string') {
		const base = suffixOrBase as Guard<T>
		return (x: unknown): x is T => base(x) && (x as string).endsWith(suffix)
	}
	const s = suffixOrBase as string
	return (x: unknown): x is string => isString(x) && x.endsWith(s)
}

export function containingOf(substr: string): Guard<string>
export function containingOf<T extends string>(base: Guard<T>, substr: string): Guard<T>
/**
 * Guard for strings that contain a specific substring.
 *
 * Overloads:
 * - containingOf(substr) → Guard<string>
 * - containingOf(base, substr) → Guard<T> (preserves the base string subtype)
 *
 * @param substrOrBase - Either the literal substring (string), or a base guard for composition
 * @param substr - When composing with a base guard, the required substring to search for
 * @returns Guard<string> for the simple form, or Guard<T> when composed with a base guard
 * @example
 * ```ts
 * const g = containingOf('mid')
 * g('admin') // true
 * g('user') // false
 * ```
 */
export function containingOf<T extends string>(substrOrBase: string | Guard<T>, substr?: string): Guard<string> | Guard<T> {
	if (typeof substrOrBase === 'function' && typeof substr === 'string') {
		const base = substrOrBase as Guard<T>
		return (x: unknown): x is T => base(x) && (x as string).includes(substr)
	}
	const s = substrOrBase as string
	return (x: unknown): x is string => isString(x) && x.includes(s)
}

// ------------------------------------------------------------
// Callable values (functions, promises) and constraints
// ------------------------------------------------------------

/**
 * Base function guard. No kind/arity/return checks.
 *
 * @returns Guard for functions
 * @example
 * ```ts
 * const isFn = functionOf()
 * isFn(() => 1) // true
 * ```
 */
export function functionOf<A extends readonly unknown[] = readonly unknown[], R = unknown>(): Guard<(...args: A) => R> {
	return (u: unknown): u is (...args: A) => R => typeof u === 'function'
}

/**
 * Async functions only (native async).
 *
 * @returns Guard for async functions
 * @example
 * ```ts
 * const g = asyncFunctionOf()
 * g(async () => 1) // true
 * ```
 */
export function asyncFunctionOf(): Guard<(...args: readonly unknown[]) => Promise<unknown>> {
	return (u: unknown): u is (...args: readonly unknown[]) => Promise<unknown> => {
		if (typeof u !== 'function') return false
		const ctorName = (u as { constructor?: { name?: unknown } }).constructor?.name
		return ctorName === 'AsyncFunction'
	}
}

/**
 * Generator functions only.
 *
 * @returns Guard for generator functions
 * @example
 * ```ts
 * function* gen() { yield 1 }
 * const g = generatorFunctionOf()
 * g(gen) // true
 * ```
 */
export function generatorFunctionOf(): Guard<(...args: readonly unknown[]) => Generator<unknown, unknown, unknown>> {
	return (u: unknown): u is (...args: readonly unknown[]) => Generator<unknown, unknown, unknown> => {
		if (typeof u !== 'function') return false
		const ctorName = (u as { constructor?: { name?: unknown } }).constructor?.name
		return ctorName === 'GeneratorFunction'
	}
}

/**
 * Async generator functions only.
 *
 * @returns Guard for async generator functions
 * @example
 * ```ts
 * async function* agen() { yield 1 }
 * const g = asyncGeneratorFunctionOf()
 * g(agen) // true
 * ```
 */
export function asyncGeneratorFunctionOf(): Guard<(...args: readonly unknown[]) => AsyncGenerator<unknown, unknown, unknown>> {
	return (u: unknown): u is (...args: readonly unknown[]) => AsyncGenerator<unknown, unknown, unknown> => {
		if (typeof u !== 'function') return false
		const ctorName = (u as { constructor?: { name?: unknown } }).constructor?.name
		return ctorName === 'AsyncGeneratorFunction'
	}
}

/**
 * Side‑effecting check: invokes the function once with `args` and validates the return.
 * Synchronous only: thenables/async iterables are rejected.
 *
 * @param args - Single invocation arguments
 * @param resultGuard - Guard that validates the return value
 * @returns Guard for functions that synchronously return a value matching `resultGuard`
 * @example
 * ```ts
 * const returnsNumber = returnsOf([], (x: unknown): x is number => typeof x === 'number')
 * returnsNumber(() => 42) // true
 * ```
 */
export function returnsOf<A extends readonly unknown[], R>(
	args: Readonly<A>,
	resultGuard: Guard<R>,
): Guard<(...fnArgs: A) => R> {
	return (u: unknown): u is (...fnArgs: A) => R => {
		if (typeof u !== 'function') return false
		try {
			const res = (u as (...a: unknown[]) => unknown)(...(args as readonly unknown[]))
			if (typeof res === 'object' && res !== null) {
				if (typeof (res as { then?: unknown }).then === 'function') return false
				if (Symbol.asyncIterator in (res as object)) return false
			}
			return resultGuard(res)
		}
		catch {
			return false
		}
	}
}

/**
 * Guard for native Promises (strict).
 *
 * @returns Guard for `Promise<unknown>`
 * @example
 * ```ts
 * const g = promiseOf()
 * g(Promise.resolve(1)) // true
 * ```
 */
export function promiseOf(): Guard<Promise<unknown>> {
	return (u: unknown): u is Promise<unknown> => u instanceof Promise
}

/**
 * Guard for thenables (Promise‑like). Does not await.
 *
 * @returns Guard for `PromiseLike<unknown>`
 * @example
 * ```ts
 * const g = promiseLikeOf()
 * g({ then(){} }) // true
 * ```
 */
export function promiseLikeOf(): Guard<PromiseLike<unknown>> {
	return (u: unknown): u is PromiseLike<unknown> => {
		if (u == null) return false
		const then = (u as { then?: unknown }).then
		return typeof then === 'function'
	}
}

// ------------------------------------------------------------
// Unified range/limit comparators (length/size/count aware) and numeric checks
// ------------------------------------------------------------

/**
 * Validate the exact length of strings, arrays, and function arity (via `.length`).
 *
 * @param n - Exact length
 * @returns Guard for strings/arrays/functions with length exactly `n`
 * @example
 * ```ts
 * lengthOf(2)('ab') // true
 * ```
 */
export function lengthOf(n: number): Guard<string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown>> {
	return (x: unknown): x is string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> => isLength(x, n)
}

/**
 * Validate the exact size of Maps and Sets.
 *
 * @param n - Exact size
 * @returns Guard for Map/Set with size exactly `n`
 * @example
 * ```ts
 * sizeOf(2)(new Set([1,2])) // true
 * ```
 */
export function sizeOf(n: number): Guard<ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>> {
	return (x: unknown): x is ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> => isSize(x, n)
}

/**
 * Validate the exact property count of plain objects (own enumerable keys + enumerable symbols).
 *
 * @param n - Exact property count
 * @returns Guard for objects with exactly `n` enumerable properties
 * @example
 * ```ts
 * const sym = Symbol('s'); const obj: Record<string|symbol, unknown> = { a: 1 }; Object.defineProperty(obj, sym, { value: 1, enumerable: true })
 * countOf(2)(obj) // true
 * ```
 */
export function countOf(n: number): Guard<Record<string | symbol, unknown>> {
	return (x: unknown): x is Record<string | symbol, unknown> => isCount(x, n)
}

// Minimum measure comparator (unified or composed)
export function minOf(min: number): Guard<number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>>
export function minOf<T>(base: Guard<T>, kind: MeasureKind, min: number): Guard<T>
/**
 * Minimum measure across supported shapes (number value, string/array length, Map/Set size, object count),
 * or compose with a base guard and a specific measure kind.
 *
 * Overloads:
 * - minOf(min) → unified guard for numbers/lengths/sizes/counts
 * - minOf(base, kind, min) → refined guard preserving base type
 *
 * @param a - Either the minimum number (unified mode), or the base guard (composed mode)
 * @param kind - When composing with a base guard, the measure kind to compare (e.g., 'length' | 'size' | 'count' | 'value')
 * @param min - When composing with a base guard, the minimum to enforce for the given kind
 * @returns Guard that accepts values whose measure is at least `min`
 * @example
 * ```ts
 * minOf(2)('ab') // true
 * minOf(objectOf({ id: isString }), 'count', 1)({ id: 'x' }) // true
 * ```
 */
export function minOf<T>(a: number | Guard<T>, kind?: MeasureKind, min?: number): Guard<unknown> {
	if (typeof a === 'function' && kind && typeof min === 'number') {
		const base = a as Guard<T>
		return (x: unknown): x is T => base(x) && isMin(x, kind, min)
	}
	const m = a as number
	return (x: unknown): x is number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> => {
		if (typeof x === 'number') return x >= m
		if (unionOf(isString, isFunction, isArray)(x)) return isLengthMin(x, m)
		if (unionOf(isMap, isSet)(x)) return isSizeMin(x, m)
		if (isRecord(x)) return isCountMin(x, m)
		return false
	}
}

// Maximum measure comparator (unified or composed)
export function maxOf(max: number): Guard<number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>>
export function maxOf<T>(base: Guard<T>, kind: MeasureKind, max: number): Guard<T>
/**
 * Maximum measure across supported shapes (number value, string/array length, Map/Set size, object count),
 * or compose with a base guard and a specific measure kind.
 *
 * Overloads:
 * - maxOf(max) → unified guard for numbers/lengths/sizes/counts
 * - maxOf(base, kind, max) → refined guard preserving base type
 *
 * @param a - Either the maximum number (unified mode), or the base guard (composed mode)
 * @param kind - When composing with a base guard, the measure kind to compare (e.g., 'length' | 'size' | 'count' | 'value')
 * @param max - When composing with a base guard, the maximum to enforce for the given kind
 * @returns Guard that accepts values whose measure is at most `max`
 * @example
 * ```ts
 * maxOf(2)('abc') // false
 * maxOf(arrayOf(isNumber), 'length', 1)([1]) // true
 * ```
 */
export function maxOf<T>(a: number | Guard<T>, kind?: MeasureKind, max?: number): Guard<unknown> {
	if (typeof a === 'function' && kind && typeof max === 'number') {
		const base = a as Guard<T>
		return (x: unknown): x is T => base(x) && isMax(x, kind, max)
	}
	const m = a as number
	return (x: unknown): x is number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> => {
		if (typeof x === 'number') return x <= m
		if (unionOf(isString, isFunction, isArray)(x)) return isLengthMax(x, m)
		if (unionOf(isMap, isSet)(x)) return isSizeMax(x, m)
		if (isRecord(x)) return isCountMax(x, m)
		return false
	}
}

// Inclusive range comparator (unified or composed)
export function rangeOf(min: number, max: number): Guard<number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>>
export function rangeOf<T>(base: Guard<T>, kind: MeasureKind, min: number, max: number): Guard<T>
/**
 * Inclusive range across supported shapes (number value, string/array length, Map/Set size, object count),
 * or compose with a base guard and a specific measure kind.
 *
 * Overloads:
 * - rangeOf(min, max) → unified guard for numbers/lengths/sizes/counts
 * - rangeOf(base, kind, min, max) → refined guard preserving base type
 *
 * @param a - Either the minimum number (unified mode) or the base guard (composed mode)
 * @param b - Either the maximum number (unified mode) or the measure kind when composing with a base guard
 * @param c - When composing with a base guard, the inclusive minimum for the given kind
 * @param d - When composing with a base guard, the inclusive maximum for the given kind
 * @returns Guard that accepts values whose measure is within the inclusive range
 * @example
 * ```ts
 * rangeOf(1, 3)(2) // true
 * rangeOf(stringOf(), 'length', 2, 3)('abc') // true
 * ```
 */
export function rangeOf<T>(a: number | Guard<T>, b: number | MeasureKind, c?: number, d?: number): Guard<unknown> {
	if (typeof a === 'function' && typeof b === 'string' && typeof c === 'number' && typeof d === 'number') {
		const base = a as Guard<T>
		const kind = b as MeasureKind
		return (x: unknown): x is T => base(x) && isRange(x, kind, c, d)
	}
	const min = a as number
	const max = b as number
	return (x: unknown): x is number | string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> => {
		if (typeof x === 'number') return x >= min && x <= max
		if (unionOf(isString, isFunction, isArray)(x)) return isLengthRange(x, min, max)
		if (unionOf(isMap, isSet)(x)) return isSizeRange(x, min, max)
		if (isRecord(x)) return isCountRange(x, min, max)
		return false
	}
}

/**
 * Number multiple check.
 *
 * @param m - Divisor (must be finite and non-zero)
 * @returns Guard for numbers that are exact multiples of `m`
 * @example
 * ```ts
 * multipleOf(3)(9) // true
 * multipleOf(3)(10) // false
 * ```
 */
export function multipleOf(m: number): Guard<number> {
	return (x: unknown): x is number => isFiniteNumber(x) && m !== 0 && x % m === 0
}

/**
 * Create a guard that accepts values whose unified measure equals `n`,
 * or compose with a base guard and a specific measure kind.
 *
 * Overloads:
 * - measureOf(n) → unified guard for numbers/lengths/sizes/counts equal to `n`
 * - measureOf(base, kind, n) → refined guard preserving base type
 *
 * Measure rules:
 * - number → value
 * - string/array → length
 * - Map/Set → size
 * - plain object → own enumerable keys + enumerable symbols count
 *
 * @param a - Either the exact measure to match (unified mode), or the base guard (composed mode)
 * @param kind - When composing with a base guard, the measure kind to compare (e.g., 'length' | 'size' | 'count' | 'value')
 * @param n - When composing with a base guard, the exact measure to require for the given kind
 * @returns Guard that accepts values whose measure equals `n`
 * @example
 * ```ts
 * const m2 = measureOf(2)
 * m2('ab') // true
 * m2(new Set([1, 2])) // true
 * ```
 */
export function measureOf(n: number): Guard<string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>>
export function measureOf<T>(base: Guard<T>, kind: MeasureKind, n: number): Guard<T>
/**
 * Create a guard that accepts values whose unified measure equals `n`,
 * or compose with a base guard and a specific measure kind.
 *
 * Overloads:
 * - measureOf(n) → unified guard for numbers/lengths/sizes/counts equal to `n`
 * - measureOf(base, kind, n) → refined guard preserving base type
 *
 * Measure rules:
 * - number → value
 * - string/array → length
 * - Map/Set → size
 * - plain object → own enumerable keys + enumerable symbols count
 *
 * @param a - Either the exact measure to match (unified mode), or the base guard (composed mode)
 * @param kind - When composing with a base guard, the measure kind to compare (e.g., 'length' | 'size' | 'count' | 'value')
 * @param n - When composing with a base guard, the exact measure to require for the given kind
 * @returns Guard that accepts values whose measure equals `n`
 * @example
 * ```ts
 * const m2 = measureOf(2)
 * m2('ab') // true
 * m2(new Set([1, 2])) // true
 * ```
 */
export function measureOf<T>(a: number | Guard<T>, kind?: MeasureKind, n?: number): Guard<unknown> {
	if (typeof a === 'function' && kind && typeof n === 'number') {
		const base = a as Guard<T>
		return (x: unknown): x is T => base(x) && isMeasure(x, kind, n)
	}
	const exact = a as number
	const byLen = lengthOf(exact)
	const bySize = sizeOf(exact)
	const byCount = countOf(exact)
	return (x: unknown): x is string | ((...args: ReadonlyArray<unknown>) => unknown) | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> =>
		(typeof x === 'number' && x === exact) || byLen(x) || bySize(x) || byCount(x)
}

// ------------------------------------------------------------
// Domain wrappers (ergonomic combinators over domain validators)
// ------------------------------------------------------------

/** Domain wrappers returning guards for common string formats and tokens. */
/**
 * Guard for RFC4122 version 4 UUID strings.
 * @returns Guard that accepts UUID v4 strings
 * @example
 * ```ts
 * uuidV4Of()('123e4567-e89b-42d3-a456-426614174000') // true
 * ```
 */
export function uuidV4Of(): Guard<string> {
	return (x: unknown): x is string => isUUIDv4(x) 
}
/**
 * Guard for ISO date strings (YYYY-MM-DD).
 * @returns Guard that accepts ISO dates
 * @example
 * ```ts
 * isoDateOf()('2020-01-02') // true
 * ```
 */
export function isoDateOf(): Guard<string> {
	return (x: unknown): x is string => isISODate(x) 
}
/**
 * Guard for ISO date-time strings (RFC3339 subset).
 * @returns Guard that accepts ISO date-time strings
 * @example
 * ```ts
 * isoDateTimeOf()('2020-01-02T12:34:56Z') // true
 * ```
 */
export function isoDateTimeOf(): Guard<string> {
	return (x: unknown): x is string => isISODateTime(x) 
}
/**
 * Guard for simple email address strings.
 * @returns Guard that accepts emails like "alice@example.com"
 * @example
 */
export function emailOf(): Guard<string> {
	return (x: unknown): x is string => isEmail(x) 
}
/**
 * Guard for parseable absolute URL strings.
 * @returns Guard that accepts absolute URLs
 * @example
 */
export function urlOf(): Guard<string> {
	return (x: unknown): x is string => isURL(x) 
}
/**
 * Guard for valid TCP/UDP port numbers (1..65535).
 * @returns Guard that accepts a valid port number
 * @example
 */
export function portOf(): Guard<number> {
	return (x: unknown): x is number => isPort(x) 
}
/**
 * Guard for MIME type strings (type/subtype).
 * @returns Guard that accepts MIME types like "application/json"
 * @example
 */
export function mimeTypeOf(): Guard<string> {
	return (x: unknown): x is string => isMIMEType(x) 
}
/**
 * Guard for slug strings (lowercase alphanumerics with dashes).
 * @returns Guard that accepts slug strings
 * @example
 */
export function slugOf(): Guard<string> {
	return (x: unknown): x is string => isSlug(x) 
}
/**
 * Guard for Base64-encoded strings.
 * @returns Guard that accepts Base64 strings
 * @example
 */
export function base64Of(): Guard<string> {
	return (x: unknown): x is string => isBase64(x) 
}
/**
 * Guard for hex strings with options.
 * @param opts - Options controlling even length and 0x prefix
 * @returns Guard that accepts hex strings per options
 * @example
 * ```ts
 * hexStringOf({ allow0x: true, evenLength: true })('0xdeadbeef') // true
 * ```
 */
export function hexStringOf(opts?: HexStringOptions): Guard<string> {
	return (x: unknown): x is string => isHex(x, opts) 
}
/**
 * Guard for semantic version strings.
 * @returns Guard that accepts semver strings
 * @example
 */
export function semverOf(): Guard<string> {
	return (x: unknown): x is string => isSemver(x) 
}
/**
 * Guard for JSON-parseable strings.
 * @returns Guard that accepts JSON strings
 * @example
 */
export function jsonStringOf(): Guard<string> {
	return (x: unknown): x is string => isJsonString(x) 
}
/**
 * Guard for JSON values (recursively valid for JSON.stringify).
 * @returns Guard that accepts JSON values
 * @example
 */
export function jsonValueOf(): Guard<unknown> {
	return (x: unknown): x is unknown => isJsonValue(x) 
}
/**
 * Guard for HTTP method strings.
 * @returns Guard narrowing to HttpMethod
 * @example
 */
export function httpMethodOf(): Guard<HttpMethod> {
	return (x: unknown): x is HttpMethod => isHTTPMethod(x) 
}
/**
 * Guard for JavaScript identifier strings.
 * @returns Guard that accepts identifier-like strings
 * @example
 */
export function identifierOf(): Guard<string> {
	return (x: unknown): x is string => isIdentifier(x) 
}
/**
 * Guard for host tokens (hostname, IPv4, bracketed IPv6).
 * @returns Guard that accepts host strings
 * @example
 */
export function hostOf(): Guard<string> {
	return (x: unknown): x is string => isHost(x) 
}
/**
 * Guard for ASCII-only strings.
 * @returns Guard that accepts ASCII strings
 * @example
 */
export function asciiOf(): Guard<string> {
	return (x: unknown): x is string => isAscii(x) 
}
/**
 * Guard for hex colors (#RGB | #RRGGBB | #RRGGBBAA) with options.
 * @param opts - Options such as allowHash
 * @returns Guard that accepts hex color strings
 * @example
 */
export function hexColorOf(opts?: HexColorOptions): Guard<string> {
	return (x: unknown): x is string => isHexColor(x, opts) 
}
/**
 * Guard for IPv4 dotted-decimal strings.
 * @returns Guard that accepts IPv4 strings
 * @example
 */
export function ipv4StringOf(): Guard<string> {
	return (x: unknown): x is string => isIPv4String(x) 
}
/**
 * Guard for IPv6 strings (subset).
 * @returns Guard that accepts IPv6 strings
 * @example
 */
export function ipv6StringOf(): Guard<string> {
	return (x: unknown): x is string => isIPv6String(x) 
}
/**
 * Guard for hostname strings.
 * @returns Guard that accepts hostnames
 * @example
 */
export function hostnameStringOf(): Guard<string> {
	return (x: unknown): x is string => isHostnameString(x) 
}
