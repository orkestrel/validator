import type {
	Guard, GuardsShape, FromGuards, OptionalFromGuards, TupleFromGuards, GuardType, IntersectionFromGuards, AnyConstructor,
} from './types.js';
import { isArray } from './arrays.js';
import { isMap, isObject, isRecord, isSet } from './collections.js';
import { isIterable, isNumber, isString, isSymbol } from './primitives.js';

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
export function arrayOf<T>(elem: Guard<T>): Guard<readonly T[]>;
export function arrayOf(elem: (x: unknown) => boolean): Guard<readonly unknown[]>;
export function arrayOf(elem: (x: unknown) => boolean): Guard<readonly unknown[]> {
	return (x: unknown): x is readonly unknown[] => isArray(x) && x.every(elem);
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
export function tupleOf<const Gs extends ReadonlyArray<Guard<unknown>>>(
	...guards: Gs
): Guard<TupleFromGuards<Gs>>;
export function tupleOf(...predicates: ReadonlyArray<(x: unknown) => boolean>): Guard<readonly unknown[]>;
export function tupleOf(...guardsOrPreds: ReadonlyArray<(x: unknown) => boolean>): Guard<readonly unknown[]> {
	return (x: unknown): x is readonly unknown[] => {
		if (!Array.isArray(x) || x.length !== guardsOrPreds.length) return false;
		for (let i = 0; i < guardsOrPreds.length; i++) {
			const guard = guardsOrPreds[i];
			if (!guard?.(x[i])) return false;
		}
		return true;
	};
}

export function objectOf<S extends GuardsShape>(shape: S): Guard<FromGuards<S>>;
export function objectOf<S extends GuardsShape, K extends ReadonlyArray<keyof S & string>>(
	shape: S,
	optional: K,
): Guard<OptionalFromGuards<S, K>>;
export function objectOf<S extends GuardsShape>(
	shape: S,
	optional: true,
): Guard<Readonly<{ [P in keyof S]: FromGuards<S>[P] | undefined }>>;

/**
 * Compose a guard for an object with a fixed set of properties, each validated by its own guard.
 * Extra keys are rejected. A second parameter can mark properties as optional; all others remain required.
 *
 * @typeParam S - Shape mapping keys to guards
 * @typeParam K - Optional keys subset
 * @param shape - Guards per property
 * @param optional - Either `true` to mark all keys optional, or a readonly array of keys that are optional
 * @returns Guard that narrows to a readonly object with required and optional keys
 * @example
 * ```ts
 * const User = objectOf({ id: isString, age: isNumber })
 * const UserWithOptionalNote = objectOf({ id: isString, note: isString }, ['note'] as const)
 * const PartialUser = objectOf({ id: isString, age: isNumber }, true)
 * ```
 */
export function objectOf<S extends GuardsShape, K extends ReadonlyArray<keyof S & string> | true | undefined>(
	shape: S,
	optional?: K,
): Guard<
	K extends true
		? Readonly<{ [P in keyof S]: FromGuards<S>[P] | undefined }>
		: K extends ReadonlyArray<keyof S & string>
			? OptionalFromGuards<S, K>
			: FromGuards<S>
> {
	const keys = Object.keys(shape) as ReadonlyArray<keyof S & string>;
	const optionalSet: Set<string>
		= optional === true
			? new Set<string>(keys as readonly string[])
			: new Set<string>(((optional as readonly string[] | undefined)) ?? []);
	return ((x: unknown): x is never => {
		if (!isRecord(x)) return false;
		const ownKeys: Array<string | symbol> = [
			...Object.keys(x),
			...Object.getOwnPropertySymbols(x).filter(s => Object.getOwnPropertyDescriptor(x, s)?.enumerable),
		];
		for (const k of ownKeys) {
			if (typeof k === 'string' && !keys.includes(k as keyof S & string)) return false;
		}
		for (const k of keys) {
			const present = k in x;
			if (!optionalSet.has(k) && !present) return false;
			if (present) {
				const g = shape[k];
				if (!g((x)[k])) return false;
			}
		}
		return true;
	}) as unknown as Guard<
		K extends true
			? Readonly<{ [P in keyof S]: FromGuards<S>[P] | undefined }>
			: K extends ReadonlyArray<keyof S & string>
				? OptionalFromGuards<S, K>
				: FromGuards<S>
	>;
}

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
export function literalOf<const Literals extends ReadonlyArray<string | number | boolean>>(
	...literals: Literals
): Guard<Literals[number]> {
	return (x: unknown): x is Literals[number] => literals.some(l => Object.is(l, x));
}

/**
	* Guard that accepts instances created by the provided constructor (via `instanceof`).
	*
	* Overloads:
	* - instanceOf(ctor) → `Guard<InstanceType<typeof ctor>>`
	*
	* Notes
	* - Cross‑realm instances (different iframes/workers) may fail `instanceof`.
	* - Prefer structural guards (e.g., `objectOf`) for plain shapes; use this for nominal class checks.
	*
	* @typeParam C - Constructor type
	* @param ctor - Class/constructor function
	* @returns Guard narrowing to `InstanceType<C>` when `value instanceof ctor`
	* @example
	* ```ts
	* class Box { constructor(readonly v: number) {} }
	* const IsBox = instanceOf(Box)
	* IsBox(new Box(1)) // true
	* IsBox({} as unknown) // false
	* ```
	*/
export function instanceOf<C>(ctor: C): Guard<InstanceType<C & AnyConstructor<object>>> {
	return (x: unknown): x is InstanceType<C & AnyConstructor<object>> =>
		typeof ctor === 'function' && isObject(x) && x instanceof ctor;
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
	const values = new Set(Object.values(e));
	return (x: unknown): x is E[keyof E] => values.has(x as string | number);
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
export function setOf<T>(elemGuard: Guard<T>): Guard<ReadonlySet<T>>;
export function setOf(elemPredicate: (x: unknown) => boolean): Guard<ReadonlySet<unknown>>;
export function setOf(elemGuardOrPred: (x: unknown) => boolean): Guard<ReadonlySet<unknown>> {
	return (x: unknown): x is ReadonlySet<unknown> => {
		if (!isSet(x)) return false;
		for (const v of x as Set<unknown>) {
			if (!elemGuardOrPred(v)) return false;
		}
		return true;
	};
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
export function mapOf<K, V>(keyGuard: Guard<K>, valueGuard: Guard<V>): Guard<ReadonlyMap<K, V>>;
export function mapOf(keyPredicate: (x: unknown) => boolean, valuePredicate: (x: unknown) => boolean): Guard<ReadonlyMap<unknown, unknown>>;
export function mapOf(keyGuardOrPred: (x: unknown) => boolean, valueGuardOrPred: (x: unknown) => boolean): Guard<ReadonlyMap<unknown, unknown>> {
	return (x: unknown): x is ReadonlyMap<unknown, unknown> => {
		if (!isMap(x)) return false;
		for (const [k, v] of x as Map<unknown, unknown>) {
			if (!keyGuardOrPred(k) || !valueGuardOrPred(v)) return false;
		}
		return true;
	};
}

export function recordOf<S extends GuardsShape>(shape: S): Guard<FromGuards<S>>;
export function recordOf<S extends GuardsShape, K extends ReadonlyArray<keyof S & string>>(
	shape: S,
	optional: K,
): Guard<OptionalFromGuards<S, K>>;
export function recordOf<S extends GuardsShape>(
	shape: S,
	optional: true,
): Guard<Readonly<{ [P in keyof S]: FromGuards<S>[P] | undefined }>>;

/**
 * Compose a guard for a record with a fixed set of string properties, each validated by its own guard.
 * Extra keys are rejected. Symbol keys are not validated (string keys only).
 * A second parameter can mark properties as optional; all others remain required.
 *
 * @typeParam S - Shape mapping keys to guards
 * @typeParam K - Optional keys subset
 * @param shape - Guards per property
 * @param optional - Either `true` to mark all keys optional, or a readonly array of keys that are optional
 * @returns Guard that narrows to a readonly record with required and optional string keys
 * @example
 * ```ts
 * const User = recordOf({ id: isString, age: isNumber })
 * const UserWithOptionalNote = recordOf({ id: isString, note: isString }, ['note'] as const)
 * const PartialUser = recordOf({ id: isString, age: isNumber }, true)
 * ```
 */
export function recordOf<S extends GuardsShape, K extends ReadonlyArray<keyof S & string> | true | undefined>(
	shape: S,
	optional?: K,
): Guard<
	K extends true
		? Readonly<{ [P in keyof S]: FromGuards<S>[P] | undefined }>
		: K extends ReadonlyArray<keyof S & string>
			? OptionalFromGuards<S, K>
			: FromGuards<S>
> {
	const keys = Object.keys(shape) as ReadonlyArray<keyof S & string>;
	const optionalSet: Set<string>
		= optional === true
			? new Set<string>(keys as readonly string[])
			: new Set<string>(((optional as readonly string[] | undefined)) ?? []);
	return ((x: unknown): x is never => {
		if (!isRecord(x)) return false;
		// Get all enumerable own string keys (no symbols, unlike objectOf)
		const ownKeys = Object.keys(x);
		// Reject extra keys
		for (const k of ownKeys) {
			if (!keys.includes(k as keyof S & string)) return false;
		}
		// Check required and optional keys
		for (const k of keys) {
			const present = k in x;
			if (!optionalSet.has(k) && !present) return false;
			if (present) {
				const g = shape[k];
				if (!g(x[k])) return false;
			}
		}
		return true;
	}) as unknown as Guard<
		K extends true
			? Readonly<{ [P in keyof S]: FromGuards<S>[P] | undefined }>
			: K extends ReadonlyArray<keyof S & string>
				? OptionalFromGuards<S, K>
				: FromGuards<S>
	>;
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
export function iterableOf<T>(elemGuard: Guard<T>): Guard<Iterable<T>>;
export function iterableOf(elemPredicate: (x: unknown) => boolean): Guard<Iterable<unknown>>;
export function iterableOf(elemGuardOrPred: (x: unknown) => boolean): Guard<Iterable<unknown>> {
	return (x: unknown): x is Iterable<unknown> => {
		if (!isIterable(x)) return false;
		for (const v of x) {
			if (!elemGuardOrPred(v)) return false;
		}
		return true;
	};
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
	return (x: unknown): x is keyof O => (isString(x) || isSymbol(x) || isNumber(x)) && x in obj;
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
export function pickOf<S extends GuardsShape, K extends ReadonlyArray<keyof S>>(shape: S, keys: K): Pick<S, K[number]> {
	const out: Record<string, Guard<unknown>> = {};
	for (const k of keys as ReadonlyArray<keyof S & string>) {
		if (Object.prototype.hasOwnProperty.call(shape, k)) out[k] = shape[k];
	}
	return out as Pick<S, K[number]>;
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
export function omitOf<S extends GuardsShape, K extends ReadonlyArray<keyof S>>(shape: S, keys: K): Omit<S, K[number]> {
	const skip = new Set<PropertyKey>(keys as readonly PropertyKey[]);
	const out: Record<string, Guard<unknown>> = {};
	for (const k of Object.keys(shape)) {
		if (!skip.has(k)) out[k] = shape[k];
	}
	return out as Omit<S, K[number]>;
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
export function andOf<A, B>(a: Guard<A>, b: Guard<B>): Guard<A & B>;
export function andOf<T, U extends T>(a: Guard<T>, b: (x: T) => x is U): Guard<U>;
export function andOf<T>(a: Guard<T>, b: (x: T) => boolean): Guard<T>;
export function andOf(a: (x: unknown) => boolean, b: (x: unknown) => boolean): Guard<unknown>;
export function andOf(a: (x: unknown) => boolean, b: (x: unknown) => boolean): Guard<unknown> {
	return (x: unknown): x is unknown => a(x) && b(x);
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
export function orOf<A, B>(a: Guard<A>, b: Guard<B>): Guard<A | B>;
export function orOf(a: (x: unknown) => boolean, b: (x: unknown) => boolean): Guard<unknown>;
export function orOf(a: (x: unknown) => boolean, b: (x: unknown) => boolean): Guard<unknown> {
	return (x: unknown): x is unknown => a(x) || b(x);
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
	return (x: unknown): x is unknown => !g(x);
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
	return (x: unknown): x is Exclude<TBase, TExclude> => base(x) && !(exclude as (x: unknown) => boolean)(x);
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
export function unionOf<const Gs extends ReadonlyArray<Guard<unknown>>>(...guards: Gs): Guard<GuardType<Gs[number]>>;
export function unionOf(...predicates: ReadonlyArray<(x: unknown) => boolean>): Guard<unknown>;
export function unionOf(...guardsOrPreds: ReadonlyArray<(x: unknown) => boolean>): Guard<unknown> {
	return (x: unknown): x is unknown => guardsOrPreds.some(g => g(x));
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
export function intersectionOf<const Gs extends ReadonlyArray<Guard<unknown>>>(...guards: Gs): Guard<IntersectionFromGuards<Gs>>;
export function intersectionOf(...predicates: ReadonlyArray<(x: unknown) => boolean>): Guard<unknown>;
export function intersectionOf(...guardsOrPreds: ReadonlyArray<(x: unknown) => boolean>): Guard<unknown> {
	return (x: unknown): x is unknown => guardsOrPreds.every(g => g(x));
}

/**
 * Compose multiple guards via logical AND. All must pass.
 *
 * Overloads:
 * - composedOf(...guards) → typed intersection guard
 * - composedOf(...predicates) → untyped guard (no TS narrowing)
 *
 * @param guards - Guards or predicates to combine
 * @returns Guard for the intersection of all guarded types
 * @example
 * ```ts
 * const alpha2 = composedOf(
 *   (x: unknown): x is string => typeof x === 'string' && /^[A-Za-z]+$/.test(x),
 *   (x: unknown): x is string => typeof x === 'string' && x.length === 2,
 * )
 * alpha2('ab') // true
 * alpha2('a1') // false
 * ```
 */
export function composedOf<const Gs extends ReadonlyArray<Guard<unknown>>>(...guards: Gs): Guard<IntersectionFromGuards<Gs>>;
export function composedOf(...predicates: ReadonlyArray<(x: unknown) => boolean>): Guard<unknown>;
export function composedOf(...guardsOrPreds: ReadonlyArray<(x: unknown) => boolean>): Guard<unknown> {
	return (x: unknown): x is unknown => {
		for (const g of guardsOrPreds) if (!g(x)) return false;
		return true;
	};
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
export function whereOf<T>(base: Guard<T>, predicate: (x: T) => boolean): Guard<T>;
export function whereOf<T, _U extends T>(base: Guard<T>, predicate: (x: T) => x is _U): Guard<T>;
export function whereOf<T>(base: Guard<T>, predicate: (x: T) => boolean): Guard<T> {
	return (x: unknown): x is T => {
		if (!base(x)) return false;
		return predicate(x);
	};
}

/**
 * Lazy guard that defers creation until first use. Useful for recursive types.
 *
 * @param thunk - Function that returns the actual guard
 * @returns Guard produced by invoking `thunk`
 * @example
 * ```ts
 * type Tree = { v: number; children?: readonly Tree[] }
 * const isTree: Guard<Tree> = lazyOf(() => objectOf({ v: isNumber, children: arrayOf(lazyOf(() => isTree)) }, ['children'] as const))
 * isTree({ v: 1, children: [{ v: 2 }] }) // true
 * ```
 */
export function lazyOf<T>(thunk: () => Guard<T>): Guard<T> {
	return (x: unknown): x is T => thunk()(x);
}

/**
 * Transform and validate: when `base(x)` passes, compute `project(x)` and validate the result with `to`.
 * Pure and deterministic. Use this to derive and validate a property, a normalized value, etc.
 *
 * @param base - Base guard to check first
 * @param project - Transform that converts the base value to another value for validation
 * @param to - Guard to validate the projected value
 * @returns Guard that validates the original value type after ensuring the projection passes
 * @example
 * ```ts
 * const g = transformOf(isString, s => s.length, (n: unknown): n is number => typeof n === 'number' && n > 0)
 * g('abc') // true
 * g('') // false
 * ```
 */
export function transformOf<T, U>(base: Guard<T>, project: ((x: T) => U) | ((x: T) => (arg: T) => U), to: Guard<U>): Guard<T>;
export function transformOf<T, _U>(base: Guard<T>, project: (x: T) => unknown, to: (x: unknown) => boolean): Guard<T> {
	return (x: unknown): x is T => {
		if (!base(x)) return false;
		const projected = project(x);
		const value = typeof projected === 'function' ? (projected as (arg: unknown) => unknown)(x) : projected;
		return to(value);
	};
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
	return (x: unknown): x is T | null => x === null || g(x);
}
