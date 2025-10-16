import type { Guard, Result, UnionToIntersection } from './types.js'
import { isRecord } from './objects.js'

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
 * @returns A guard that validates both `a` and `b`
 * @example
 * ```ts
 * const g = and(isRecord, hasId)
 * g({ id: 1 }) // depends on hasId
 * ```
 */
export function and<A, B>(a: Guard<A>, b: Guard<B>): Guard<A & B> {
	return (x: unknown): x is A & B => a(x) && b(x)
}

/**
 * Combine two guards with logical OR: value may satisfy either guard.
 *
 * @param a - First guard
 * @param b - Second guard
 * @returns A guard that validates `a` or `b`
 * @example
 * ```ts
 * const g = or(isString, isNumber)
 * g(1) // true
 * ```
 */
export function or<A, B>(a: Guard<A>, b: Guard<B>): Guard<A | B> {
	return (x: unknown): x is A | B => a(x) || b(x)
}

/**
 * Negate a guard. Exact complement types are not representable in TypeScript,
 * so the returned guard is typed as `Guard<unknown>`.
 *
 * @param _g - Guard to negate
 * @returns A guard that returns the negation of `_g`
 * @example
 * ```ts
 * const g = not(isString)
 * g(1) // true
 * ```
 */
export function not(_g: Guard<unknown>): Guard<unknown> {
	const g = _g as Guard<unknown>
	return (x: unknown): x is unknown => !g(x)
}

/**
 * Alias for `not` exposed as `isNot`.
 */
export const isNot = not

/**
 * Create a union guard from multiple guards.
 *
 * @param guards - Guards to union
 * @returns A guard that accepts values matching any of the provided guards
 * @example
 * ```ts
 * const g = unionOf(isString, isNumber)
 * g('a') // true
 * ```
 */
export function unionOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<Gs[number] extends Guard<infer T> ? T : never> {
	return (x: unknown): x is Gs[number] extends Guard<infer T> ? T : never => guards.some(g => g(x))
}

/**
 * Create an intersection guard from multiple guards.
 *
 * @param guards - Guards to intersect
 * @returns A guard that accepts values matching all provided guards
 * @example
 * ```ts
 * const g = intersectionOf(hasId, hasName)
 * ```
 */
export function intersectionOf<const Gs extends readonly Guard<unknown>[]>(...guards: Gs): Guard<UnionToIntersection<Gs[number] extends Guard<infer T> ? T : never>> {
	return (x: unknown): x is UnionToIntersection<Gs[number] extends Guard<infer T> ? T : never> => guards.every(g => g(x))
}

/**
 * Create a guard that accepts `undefined` or a value validated by `g`.
 *
 * @param g - Guard for the non-undefined value
 * @returns A guard that allows `undefined` or `T`
 * @example
 * ```ts
 * const g = optionalOf(isNumber)
 * g(undefined) // true
 * ```
 */
export function optionalOf<T>(g: Guard<T>): Guard<T | undefined> {
	return (x: unknown): x is T | undefined => x === undefined || g(x)
}

/**
 * Create a guard that accepts `null` or a value validated by `g`.
 *
 * @param g - Guard for the non-null value
 * @returns A guard that allows `null` or `T`
 * @example
 * ```ts
 * const g = nullableOf(isString)
 * g(null) // true
 * ```
 */
export function nullableOf<T>(g: Guard<T>): Guard<T | null> {
	return (x: unknown): x is T | null => x === null || g(x)
}

/**
 * Lazy guard that defers creation until first use. Useful for recursive types.
 *
 * @param thunk - Function that returns the actual guard
 * @returns A guard which calls `thunk()` when invoked
 * @example
 * ```ts
 * const node = lazy(() => object({ next: optionalOf(node) }))
 * ```
 */
export function lazy<T>(thunk: () => Guard<T>): Guard<T> {
	return (x: unknown): x is T => thunk()(x)
}

/**
 * Create a refined guard that narrows `T` to `U` using `refineFn`.
 *
 * @param base - Base guard for `T`
 * @param refineFn - Type predicate that narrows `T` to `U`
 * @returns A guard for `U`
 * @example
 * ```ts
 * const g = refine(isNumber, (n): n is 1 | 2 => n === 1 || n === 2)
 * ```
 */
export function refine<T, U extends T>(base: Guard<T>, refineFn: (x: T) => x is U): Guard<U> {
	return (x: unknown): x is U => (base(x) ? refineFn(x) : false)
}

/**
 * Safely parse a value with a guard, returning a Result with either the value
 * or an Error.
 *
 * @param x - Value to validate
 * @param g - Guard to apply
 * @param onError - Optional function to produce a custom error when validation fails
 * @returns Result containing the validated value or an error
 * @example
 * ```ts
 * import { safeParse } from '@orkestrel/validator'
 * import { isNumber } from './primitives.js'
 *
 * const ok = safeParse(1, isNumber)
 * if (ok.ok) {
 *   ok.value // number
 * }
 * ```
 */
export function safeParse<T, E extends Error = TypeError>(
	x: unknown,
	g: Guard<T>,
	onError?: (x: unknown) => E,
): Result<T, E> {
	if (g(x)) return { ok: true, value: x }
	return { ok: false, error: onError ? onError(x) : new TypeError('Validation failed') as E }
}

/**
 * Create a discriminated union guard from a mapping of discriminator values to guards.
 *
 * @param disc - Property name used as discriminator
 * @param mapping - Record mapping discriminator values to guards
 * @returns A guard that validates the discriminated union
 * @example
 * ```ts
 * const g = discriminatedUnion('type', { a: isA, b: isB })
 * ```
 */
export function discriminatedUnion<
	K extends string,
	const M extends Readonly<Record<string, Guard<unknown>>>,
>(disc: K, mapping: M): Guard<M[keyof M] extends Guard<infer T> ? T : never> {
	const keys = new Set(Object.keys(mapping))
	return (x: unknown): x is M[keyof M] extends Guard<infer T> ? T : never => {
		if (!isRecord(x)) return false
		const v = x[disc]
		// Avoid typeof check; rely on key membership in mapping
		if (!keys.has(v as string)) return false
		const g = mapping[v as keyof M]
		return g ? g(x) : false
	}
}

/**
 * Create a guard from a native enum (object of string/number values).
 *
 * @param e - Enum-like object
 * @returns A guard that validates values in the enum
 * @example
 * ```ts
 * enum E { A = 'a' }
 * fromNativeEnum(E)('a') // true
 * ```
 */
export function fromNativeEnum<E extends Record<string, string | number>>(e: E): Guard<E[keyof E]> {
	const values = new Set(Object.values(e) as (string | number)[])
	return (x: unknown): x is E[keyof E] => values.has(x as string | number)
}
