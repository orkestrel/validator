import type { Guard, Result, UnionToIntersection, GuardsShape, EmptyOf, ObjectOfOptions, FromGuardsWithOptional } from './types.js'
import { isRecord, isCount } from './objects.js'
import { isString, isNumber, isIterable } from './primitives.js'
import { isLength } from './arrays.js'
import { isSize } from './collections.js'
import { isEmpty } from './emptiness.js'
import { countEnumerableProperties } from './helpers.js'

/**
 * Create a guard that accepts one of the provided literal values.
 *
 * @param literals - List of literal values to accept
 * @returns A guard that validates the given literals
 * @example
 * ```ts
 * const g = literalOf('a', 'b', 1)
 * g('a') // true
 * g('c') // false
 * ```
 */
export function literalOf<const Literals extends readonly (string | number | boolean)[]>(
	...literals: Literals
): Guard<Literals[number]> {
	return (x: unknown): x is Literals[number] => literals.includes(x as never)
}

/**
 * Combine two guards with logical AND: value must satisfy both guards.
 *
 * @param a - First guard
 * @param b - Second guard
 * @returns Guard that validates both `a` and `b`
 * @example
 * ```ts
 * const g = andOf(isString, (s: string): s is string => s.length > 0)
 * g('x') // true
 * g('') // false
 * ```
 */
export function andOf<A, B>(a: Guard<A>, b: Guard<B>): Guard<A & B> {
	return (x: unknown): x is A & B => a(x) && b(x)
}

/**
 * Combine two guards with logical OR: value may satisfy either guard.
 *
 * @param a - First guard
 * @param b - Second guard
 * @returns Guard that validates `a` or `b`
 * @example
 * ```ts
 * const g = orOf(isString, isNumber)
 * g(1) // true
 * g('a') // true
 * g(true) // false
 * ```
 */
export function orOf<A, B>(a: Guard<A>, b: Guard<B>): Guard<A | B> {
	return (x: unknown): x is A | B => a(x) || b(x)
}

/**
 * Negate a guard.
 *
 * Overloads:
 * - `notOf(exclude)` → `Guard<unknown>`
 * - `notOf(base, exclude)` → `Guard<Exclude<Base, Excluded>>`
 *
 * @param a - Exclude guard or base guard when two-arg form
 * @param b - Excluded guard when two-arg form
 * @returns Negated guard
 * @example
 * ```ts
 * const notString = notOf(isString)
 * notString(123) // true
 * notString('abc') // false
 * ```
 */
export function notOf(a: Guard<unknown>, b?: undefined): Guard<unknown>
export function notOf<TBase, TExclude extends TBase>(a: Guard<TBase>, b: Guard<TExclude>): Guard<Exclude<TBase, TExclude>>
export function notOf<TBase, TExclude extends TBase>(a: Guard<TBase> | Guard<unknown>, b?: Guard<TExclude>): Guard<Exclude<TBase, TExclude>> | Guard<unknown> {
	if (b) {
		const base = a as Guard<TBase>
		const exclude = b
		return (x: unknown): x is Exclude<TBase, TExclude> => base(x) && !exclude(x)
	}
	const exclude = a as Guard<unknown>
	return (x: unknown): x is unknown => !exclude(x)
}

/**
 * Create a union guard from multiple guards.
 *
 * @param guards - Guards to union
 * @returns Guard that accepts values matching any provided guard
 * @example
 * ```ts
 * const g = unionOf(isString, isNumber)
 * g('a') // true
 * g(1) // true
 * g(true) // false
 * ```
 */
export function unionOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<Gs[number] extends Guard<infer T> ? T : never> {
	return (x: unknown): x is Gs[number] extends Guard<infer T> ? T : never => guards.some(g => g(x))
}

/**
 * Create an intersection guard from multiple guards.
 *
 * @param guards - Guards to intersect
 * @returns Guard that accepts values matching all provided guards
 * @example
 * ```ts
 * const g = intersectionOf(isString as (x: unknown) => x is string, (s: string): s is string => s.length > 0)
 * g('x') // true
 * g('') // false
 * ```
 */
export function intersectionOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<UnionToIntersection<Gs[number] extends Guard<infer T> ? T : never>> {
	return (x: unknown): x is UnionToIntersection<Gs[number] extends Guard<infer T> ? T : never> => guards.every(g => g(x))
}

/**
 * Create a guard that accepts `undefined` or a value validated by `g`.
 *
 * @param g - Guard for the non-undefined value
 * @returns Guard allowing `undefined` or `T`
 * @example
 * ```ts
 * optionalOf(isNumber)(undefined) // true
 * optionalOf(isNumber)(123) // true
 * optionalOf(isNumber)('abc') // false
 * ```
 */
export function optionalOf<T>(g: Guard<T>): Guard<T | undefined> {
	return (x: unknown): x is T | undefined => x === undefined || g(x)
}

/**
 * Create a guard that accepts `null` or a value validated by `g`.
 *
 * @param g - Guard for the non-null value
 * @returns Guard allowing `null` or `T`
 * @example
 * ```ts
 * nullableOf(isString)(null) // true
 * nullableOf(isString)('hello') // true
 * nullableOf(isString)(123) // false
 * ```
 */
export function nullableOf<T>(g: Guard<T>): Guard<T | null> {
	return (x: unknown): x is T | null => x === null || g(x)
}

/**
 * Lazy guard that defers creation until first use. Useful for recursive types.
 *
 * @param thunk - Function producing the guard
 * @returns Guard that invokes `thunk()` on call
 * @example
 * ```ts
 * type Node = { value: number, next?: Node }
 * const isNode = lazyOf(() => objectOf({ value: isNumber, next: optionalOf(isNode) }))
 * ```
 */
export function lazyOf<T>(thunk: () => Guard<T>): Guard<T> {
	return (x: unknown): x is T => thunk()(x)
}

/**
 * Create a refined guard that narrows `T` to `U` using `refineFn`.
 *
 * @param base - Base guard for `T`
 * @param refineFn - Type predicate that narrows `T` to `U`
 * @returns Guard for `U`
 * @example
 * ```ts
 * const g = refineOf(isNumber, (n): n is 1 | 2 => n === 1 || n === 2)
 * ```
 */
export function refineOf<T, U extends T>(base: Guard<T>, refineFn: (x: T) => x is U): Guard<U> {
	return (x: unknown): x is U => (base(x) ? refineFn(x) : false)
}

/**
 * Safely parse a value with a guard, returning a Result with either the value or an Error.
 *
 * @param x - Value to validate
 * @param g - Guard to apply
 * @param onError - Optional error factory
 * @returns Result containing the validated value or an error
 * @example
 * ```ts
 * const ok = safeParse(1, isNumber)
 * ```
 */
export function safeParse<T, E extends Error = TypeError>(
	x: unknown,
	g: Guard<T>,
	onError?: (x: unknown) => E,
): Result<T, E> {
	if (g(x)) return { ok: true, value: x }
	return { ok: false, error: (onError ? onError(x) : new TypeError('Validation failed')) as E }
}

/**
 * Create a discriminated union guard from a mapping of discriminator values to guards.
 *
 * @param disc - Property name used as discriminator
 * @param mapping - Record mapping discriminator values to guards
 * @returns Guard that validates the discriminated union
 * @example
 * ```ts
 * const g = discriminatedUnionOf('type', { a: A, b: B })
 * ```
 */
export function discriminatedUnionOf<
	K extends string,
	const M extends Readonly<Record<string, Guard<unknown>>>,
>(disc: K, mapping: M): Guard<M[keyof M] extends Guard<infer T> ? T : never> {
	const keys = new Set(Object.keys(mapping))
	return (x: unknown): x is M[keyof M] extends Guard<infer T> ? T : never => {
		if (!isRecord(x)) return false
		const v = x[disc]
		if (!keys.has(v as string)) return false
		const g = mapping[v as keyof M]
		return g ? g(x) : false
	}
}

/**
 * Create a guard from a native enum (object of string/number values).
 *
 * @param e - Enum-like object
 * @returns Guard for the enum values
 * @example
 * ```ts
 * enum E { A = 'a' }
 * nativeEnumOf(E)('a') // true
 * ```
 */
export function enumOf<E extends Record<string, string | number>>(e: E): Guard<E[keyof E]> {
	const values = new Set(Object.values(e) as (string | number)[])
	return (x: unknown): x is E[keyof E] => values.has(x as string | number)
}

/**
 * Build a composable guard from a shape of property guards.
 *
 * Use `objectOf` for composable object validation with options for:
 * - optional fields: keys listed in options.optional may be missing
 * - exact key validation: when exact is true, no additional keys are allowed
 * - rest property validation: when exact is false and rest is provided, any
 *   extra property values must satisfy the rest guard
 *
 * Typing: keys listed in options.optional are reflected as optional properties
 * in the returned guard's type, so the narrowed type matches the runtime behavior.
 *
 * @param props - Mapping of property names to guard functions
 * @param options - Optional configuration (optional/exact/rest)
 * @remarks
 * Options:
 * - optional — readonly array of keys from `props` that may be missing
 * - exact — when true, additional keys on the object are disallowed
 * - rest — guard applied to additional property values when `exact` is false
 * @returns Guard validating objects that satisfy the provided shape
 * @example
 * ```ts
 * import { objectOf, isString, isNumber } from '@orkestrel/validator'
 * const User = objectOf(
 *   { id: isString, age: isNumber },
 *   { optional: ['age' as const], exact: true }
 * )
 * // Type narrows to: { readonly id: string; readonly age?: number }
 * ```
 * @example
 * ```ts
 * // Allow extras that match the rest guard
 * const Bag = objectOf({ id: isString }, { rest: isNumber })
 * Bag({ id: 'b-1', a: 1, b: 2 })  // true
 * Bag({ id: 'b-1', a: 'nope' })   // false
 * ```
 */
export function objectOf<
	const P extends GuardsShape,
	const Opt extends readonly (keyof P)[],
>(
	props: P,
	options: ObjectOfOptions<Opt> = {},
): Guard<FromGuardsWithOptional<P, Opt>> {
	const declaredKeys = Object.keys(props) as readonly (keyof P & string)[]
	const optional = new Set<PropertyKey>(options.optional as readonly PropertyKey[] | undefined)
	const exact = options.exact === true
	const rest = options.rest

	return (x: unknown): x is FromGuardsWithOptional<P, Opt> => {
		if (!isRecord(x)) return false
		const obj = x as Record<string, unknown>

		// Validate declared keys (presence + value guards)
		for (const k of declaredKeys) {
			const has = Object.prototype.hasOwnProperty.call(obj, k)
			if (!has) {
				if (!optional.has(k)) return false
				continue
			}
			const g = props[k]
			const v = obj[k as string]
			if (!(g as Guard<unknown>)(v)) return false
		}

		// Validate extras inline (no helpers): enforce exact/rest
		for (const k of Object.keys(obj)) {
			if (Object.prototype.hasOwnProperty.call(props, k)) continue
			if (exact) return false
			if (rest && !(rest as Guard<unknown>)(obj[k])) return false
		}

		return true
	}
}

// ------------------------------------------------------------
// Emptiness-aware combinators
// ------------------------------------------------------------

/**
 * Create a guard that allows an "empty" value for common empty-able shapes or a value validated by `g`.
 *
 * Emptiness semantics match `isEmpty` (empty string, empty array, empty Map/Set, object with no own enumerable keys/symbols).
 * For other types (e.g., numbers), emptiness never applies and this behaves like `g`.
 *
 * @param g - Base guard for the non-empty value
 * @returns Guard allowing an empty shape or `T`
 * @example
 * ```ts
 * const isNumbers = arrayOf(isNumber)
 * const isNumbersOrEmpty = allowEmptyOf(isNumbers)
 * isNumbersOrEmpty([]) // true
 * isNumbersOrEmpty([1, 2]) // true
 * isNumbersOrEmpty(['x'] as unknown) // false
 * ```
 */
export function emptyOf<T>(g: Guard<T>): Guard<T | EmptyOf<T>> {
	return (x: unknown): x is T | EmptyOf<T> => isEmpty(x) || g(x)
}

/**
 * Create a guard that requires non-emptiness for common empty-able shapes, in addition to passing `g`.
 *
 * For non empty-able types (e.g., numbers), this reduces to `g`.
 *
 * @param g - Base guard for the value
 * @returns Guard that accepts values passing `g` and not empty when emptiness applies
 * @example
 * ```ts
 * const nonEmptyNumbers = nonEmptyOf(arrayOf(isNumber))
 * nonEmptyNumbers([]) // false
 * nonEmptyNumbers([1]) // true
 * nonEmptyNumbers(['x'] as unknown) // false
 * ```
 */
export function nonEmptyOf<T>(g: Guard<T>): Guard<T> {
	return (x: unknown): x is T => {
		// Arrays
		if (Array.isArray(x)) return x.length > 0 && g(x)
		// Strings (also Iterable, but treat specially)
		if (typeof x === 'string') return x.length > 0 && g(x)
		// Maps/Sets
		if (x instanceof Map || x instanceof Set) return x.size > 0 && g(x)
		// Generic Iterables (e.g., generators). Handle before record to avoid classifying generators as objects.
		if (isIterable(x)) {
			const it = (x as Iterable<unknown>)[Symbol.iterator]()
			const first = it.next()
			if (first.done) return false
			const replay: Iterable<unknown> = {
				[Symbol.iterator](): Iterator<unknown> {
					let yieldedFirst = false
					return {
						next(): IteratorResult<unknown> {
							if (!yieldedFirst) {
								yieldedFirst = true
								return { value: first.value, done: false }
							}
							return it.next()
						},
					}
				},
			}
			return g(replay as unknown as T)
		}
		// Plain objects
		if (isRecord(x)) {
			if (Object.keys(x).length === 0) {
				const syms = Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable)
				if (syms.length === 0) return false
			}
			return g(x)
		}
		// Other types: non-empty constraint does not apply; rely on base guard
		return g(x)
	}
}

// ------------------------------------------------------------
// Consolidated element/collection/string/number/object combinators
// ------------------------------------------------------------

/**
 * Create a guard for an array whose elements satisfy the provided element guard.
 *
 * @param elem - Guard to validate each element
 * @returns Guard that accepts arrays of `T`
 * @example
 * ```ts
 * const g = arrayOf(isNumber)
 * g([1, 2, 3]) // true
 * g([1, 'a']) // false
 * ```
 */
export function arrayOf<T>(elem: Guard<T>): Guard<ReadonlyArray<T>> {
	return (x: unknown): x is ReadonlyArray<T> => Array.isArray(x) && x.every(elem)
}

/**
 * Create a guard for a fixed-length tuple with per-index guards.
 *
 * @param guards - Guards for each tuple element
 * @returns Guard that accepts tuples matching the provided guards
 * @example
 * ```ts
 * const g = tupleOf(isString, isNumber)
 * g(['a', 1]) // true
 * g(['a']) // false
 * ```
 */
export function tupleOf<const Gs extends readonly Guard<unknown>[]>(
	...guards: Gs
): Guard<{ readonly [K in keyof Gs]: Gs[K] extends Guard<infer T> ? T : never }> {
	return (x: unknown): x is { readonly [K in keyof Gs]: Gs[K] extends Guard<infer T> ? T : never } => {
		if (!Array.isArray(x) || x.length !== guards.length) return false
		for (let i = 0; i < guards.length; i++) {
			const guard = guards[i]
			if (!guard || !guard(x[i])) return false
		}
		return true
	}
}

/**
 * Create a guard that accepts strings matching the provided regular expression.
 *
 * @param re - Regular expression to test against
 * @returns Guard that checks string values
 * @example
 * ```ts
 * const g = stringMatchOf(/^a/)
 * g('abc') // true
 * g('xbc') // false
 * ```
 */
export function stringMatchOf(re: RegExp): Guard<string> {
	return (x: unknown): x is string => isString(x) && re.test(x)
}

/**
 * Create a guard that matches an exact string value.
 *
 * @param s - Exact string to match
 * @returns Guard that accepts only the exact string `s`
 * @example
 * ```ts
 * const g = stringOf('ok')
 * g('ok') // true
 * g('nope') // false
 * ```
 */
export function stringOf<const S extends string>(s: S): Guard<S> {
	return (x: unknown): x is S => x === s
}

/**
 * Create a guard that matches an exact number value.
 *
 * @param n - Exact number to match
 * @returns Guard that accepts only the exact number `n`
 * @example
 * ```ts
 * const g = numberOf(42)
 * g(42) // true
 * g(41) // false
 * ```
 */
export function numberOf<const N extends number>(n: N): Guard<N> {
	return (x: unknown): x is N => typeof x === 'number' && x === n
}

// ------------------------------------------------------------
// Unified range/limit comparators (length/size/count aware)
// ------------------------------------------------------------

/**
 * Validate the exact length of strings and arrays.
 *
 * @param n - Exact required length
 * @returns Guard for strings/arrays with length exactly `n`
 * @example
 * ```ts
 * lengthOf(2)('ab') // true
 * lengthOf(3)(['a','b','c']) // true
 * lengthOf(2)('abc') // false
 * ```
 */
export function lengthOf(n: number): Guard<string | ReadonlyArray<unknown>> {
	return (x: unknown): x is string | ReadonlyArray<unknown> => isLength(x, n)
}

/**
 * Validate the exact size of Maps and Sets.
 *
 * @param n - Exact required size
 * @returns Guard for Map/Set with size exactly `n`
 * @example
 * ```ts
 * sizeOf(2)(new Set([1,2])) // true
 * sizeOf(1)(new Map([[1, 'a']])) // true
 * ```
 */
export function sizeOf(n: number): Guard<ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>> {
	return (x: unknown): x is ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> => isSize(x, n)
}

/**
 * Validate the exact property count of plain objects (own enumerable keys + enumerable symbols).
 *
 * @param n - Exact required count
 * @returns Guard for plain objects with count exactly `n`
 * @example
 * ```ts
 * const o = { a: 1 }
 * countOf(1)(o) // true
 * ```
 */
export function countOf(n: number): Guard<Record<string | symbol, unknown>> {
	return (x: unknown): x is Record<string | symbol, unknown> => isCount(x, n)
}

// Remove shared measure; implement comparators directly per-shape

/**
 * Guard enforcing a minimum value/size across supported shapes:
 * - number → value
 * - string/array → length
 * - Map/Set → size
 * - plain object → own enumerable keys + enumerable symbols count
 *
 * @param min - Minimum inclusive boundary
 * @returns Guard that accepts values whose measure is `>= min`
 * @example
 * ```ts
 * const atLeast2 = minOf(2)
 * atLeast2(5) // true
 * atLeast2('a') // false
 * atLeast2([1, 2]) // true
 * ```
 */
export function minOf(min: number): Guard<number | string | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>> {
	return (x: unknown): x is number | string | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> => {
		if (typeof x === 'number') return x >= min
		if (typeof x === 'string') return x.length >= min
		if (Array.isArray(x)) return x.length >= min
		if (x instanceof Map) return x.size >= min
		if (x instanceof Set) return x.size >= min
		if (isRecord(x)) return countEnumerableProperties(x) >= min
		return false
	}
}

/**
 * Guard enforcing a maximum value/size across supported shapes (see {@link minOf}).
 *
 * @param max - Maximum inclusive boundary
 * @returns Guard that accepts values whose measure is `<= max`
 * @example
 * ```ts
 * const atMost3 = maxOf(3)
 * atMost3(2) // true
 * atMost3('abcd') // false
 * atMost3(new Set([1,2,3])) // true
 * ```
 */
export function maxOf(max: number): Guard<number | string | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>> {
	return (x: unknown): x is number | string | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> => {
		if (typeof x === 'number') return x <= max
		if (typeof x === 'string') return x.length <= max
		if (Array.isArray(x)) return x.length <= max
		if (x instanceof Map) return x.size <= max
		if (x instanceof Set) return x.size <= max
		if (isRecord(x)) return countEnumerableProperties(x) <= max
		return false
	}
}

/**
 * Guard enforcing an inclusive range across supported shapes (see {@link minOf}).
 *
 * @param min - Minimum inclusive boundary
 * @param max - Maximum inclusive boundary
 * @returns Guard that accepts values whose measure is within `[min, max]`
 * @example
 * ```ts
 * const between2and4 = rangeOf(2, 4)
 * between2and4('abc') // true
 * between2and4(5) // false
 * between2and4(new Map([[1, 'a'], [2, 'b']])) // true
 * ```
 */
export function rangeOf(min: number, max: number): Guard<number | string | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>> {
	return (x: unknown): x is number | string | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> => {
		if (typeof x === 'number') return x >= min && x <= max
		if (typeof x === 'string') return x.length >= min && x.length <= max
		if (Array.isArray(x)) return x.length >= min && x.length <= max
		if (x instanceof Map) return x.size >= min && x.size <= max
		if (x instanceof Set) return x.size >= min && x.size <= max
		if (isRecord(x)) {
			const c = countEnumerableProperties(x)
			return c >= min && c <= max
		}
		return false
	}
}

/**
 * Create a guard that checks whether a number is a multiple of `m`.
 *
 * @param m - The non-zero finite modulus to test against
 * @returns Guard that returns true when `x` is a number and `x % m === 0`
 * @example
 * ```ts
 * const g = multipleOf(3)
 * g(9) // true
 * g(10) // false
 * ```
 */
export function multipleOf(m: number): Guard<number> {
	return (x: unknown): x is number => isNumber(x) && Number.isFinite(m) && m !== 0 && x % m === 0
}

/**
 * Create a guard for a Map whose keys and values satisfy the given guards.
 *
 * @param keyGuard - Guard that validates map keys
 * @param valueGuard - Guard that validates map values
 * @returns Guard that checks a ReadonlyMap with validated keys and values
 * @example
 * ```ts
 * const g = mapOf(isString, isNumber)
 * g(new Map([["a", 1]])) // true
 * g(new Map([["a", "b"]])) // false
 * ```
 */
export function mapOf<K, V>(keyGuard: Guard<K>, valueGuard: Guard<V>): Guard<ReadonlyMap<K, V>> {
	return (x: unknown): x is ReadonlyMap<K, V> => {
		if (!(x instanceof Map)) return false
		for (const [k, v] of x as Map<unknown, unknown>) {
			if (!keyGuard(k) || !valueGuard(v)) return false
		}
		return true
	}
}

/**
 * Create a guard for a Set whose elements satisfy the given guard.
 *
 * @param elemGuard - Guard that validates set elements
 * @returns Guard that checks a ReadonlySet with validated elements
 * @example
 * ```ts
 * const g = setOf(isNumber)
 * g(new Set([1, 2])) // true
 * g(new Set([1, 'a'])) // false
 * ```
 */
export function setOf<T>(elemGuard: Guard<T>): Guard<ReadonlySet<T>> {
	return (x: unknown): x is ReadonlySet<T> => {
		if (!(x instanceof Set)) return false
		for (const v of x as Set<unknown>) {
			if (!elemGuard(v)) return false
		}
		return true
	}
}

/**
 * Create a guard that tests membership in the keys of a provided object literal.
 *
 * @param obj - Object to derive keys from
 * @returns Guard that returns true for values that are keys of `obj`
 * @example
 * ```ts
 * const g = keyOf({ a: 1, b: 2 } as const)
 * g('a') // true
 * g('c') // false
 * ```
 */
export function keyOf<const O extends Readonly<Record<PropertyKey, unknown>>>(obj: O): Guard<keyof O> {
	return (x: unknown): x is keyof O => (typeof x === 'string' || typeof x === 'symbol' || typeof x === 'number') && x in obj
}

/**
 * Create a guard for a plain-object record whose values match a guard.
 *
 * @param valueGuard - Guard for property values
 * @returns Guard that accepts records of `T`
 * @example
 * ```ts
 * const g = recordOf(isNumber)
 * g({ a: 1, b: 2 }) // true
 * g({ a: 1, b: 'x' }) // false
 * ```
 */
export function recordOf<T>(valueGuard: Guard<T>): Guard<Record<string, T>> {
	return (x: unknown): x is Record<string, T> => {
		if (!isRecord(x)) return false
		for (const k of Object.keys(x)) {
			if (!valueGuard((x as Record<string, unknown>)[k])) return false
		}
		return true
	}
}

// Iterables
/**
 * Create a guard that validates every element of an iterable using the provided element guard.
 *
 * @param elemGuard - Guard used to validate each element
 * @returns Guard that accepts iterables whose elements all pass `elemGuard`
 * @example
 * ```ts
 * const g = iterableOf(isNumber)
 * g([1, 2, 3].values()) // true
 * g([1, 'a'].values()) // false
 * ```
 */
export function iterableOf<T>(elemGuard: Guard<T>): Guard<Iterable<T>> {
	return (x: unknown): x is Iterable<T> => {
		if (!isIterable(x)) return false
		for (const v of x) {
			if (!elemGuard(v)) return false
		}
		return true
	}
}

/**
 * Create a guard that validates a function with a specific return type.
 *
 * This checks that the value is a function and is intended to be composed with
 * additional runtime checks when needed. The return type validation cannot be
 * enforced at runtime without calling the function.
 *
 * @param _returnGuard - Guard for the function's return type (not enforced at runtime, type-level only)
 * @returns Guard that accepts functions expected to return `T`
 * @example
 * ```ts
 * const g = functionOf(isNumber)
 * g(() => 42) // true
 * g({}) // false
 * ```
 */
export function functionOf<T>(_returnGuard: Guard<T>): Guard<(...args: unknown[]) => T> {
	return (x: unknown): x is (...args: unknown[]) => T => typeof x === 'function'
}

/**
 * Create a guard that accepts values whose unified measure equals `n`.
 *
 * Measure rules:
 * - number → value
 * - string/array → length
 * - Map/Set → size
 * - plain object → own enumerable keys + enumerable symbols count
 *
 * @param n - Exact required measure
 * @returns Guard across supported shapes whose measure equals `n`
 * @example
 * ```ts
 * measureOf(2)('ab') // true
 * measureOf(3)(new Set([1,2,3])) // true
 * measureOf(1)({ a: 1 }) // true
 * ```
 */
export function measureOf(n: number): Guard<number | string | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown>> {
	const byNum = numberOf(n)
	const byLen = lengthOf(n)
	const bySize = sizeOf(n)
	const byCount = countOf(n)
	return (x: unknown): x is number | string | ReadonlyArray<unknown> | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | Record<string | symbol, unknown> =>
		byNum(x) || byLen(x) || bySize(x) || byCount(x)
}
