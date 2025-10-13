import type { FromSchema, Guard, GuardsShape, SchemaSpec, GuardType } from './types.js'
import { isFunction } from './primitives.js'

/**
 * Determine whether an object exactly matches a simple schema specification.
 *
 * The `schema` may contain strings (primitive type names), guard functions,
 * or nested schema objects. All keys in `schema` must be present as own
 * properties on `obj` and satisfy the corresponding rule.
 *
 * @param obj - Value to validate
 * @param schema - Schema specification describing required keys and their rules
 * @returns `true` when `obj` is an object that satisfies `schema`
 * @example
 * ```ts
 * hasSchema({ a: 1 }, { a: 'number' }) // true
 * hasSchema({ a: 1 }, { a: x => typeof x === 'number' }) // true
 * ```
 */
export function hasSchema<S extends SchemaSpec>(obj: unknown, schema: S): obj is FromSchema<S> {
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return false
	const o = obj as Record<string, unknown>
	for (const [k, rule] of Object.entries(schema)) {
		if (!Object.prototype.hasOwnProperty.call(o, k)) return false
		const v = o[k]
		if (typeof rule === 'string') {
			if (rule === 'object') {
				if (!(typeof v === 'object' && v !== null && !Array.isArray(v))) return false
			}
			else if (typeof v !== rule) {
				return false
			}
		}
		else if (isFunction(rule)) {
			if (!(rule as Guard<unknown>)(v)) return false
		}
		else {
			if (!hasSchema(v, rule as SchemaSpec)) return false
		}
	}
	return true
}

/**
 * Determine whether an object satisfies the provided schema for any keys it has.
 *
 * This is like `hasSchema` but missing keys on `obj` are allowed; when a
 * key from `schema` exists on `obj` it must satisfy the rule.
 *
 * @param obj - Value to validate
 * @param schema - Schema specification describing optional keys and rules
 * @returns `true` when `obj` is an object and any present schema keys satisfy their rules
 * @example
 * ```ts
 * hasPartialSchema({ a: 1 }, { a: 'number', b: 'string' }) // true
 * hasPartialSchema({}, { a: 'number' }) // true
 * ```
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
			}
			else if (typeof v !== rule) {
				return false
			}
		}
		else if (isFunction(rule)) {
			if (!(rule as Guard<unknown>)(v)) return false
		}
		else {
			if (!hasPartialSchema(v, rule as SchemaSpec)) return false
		}
	}
	return true
}

/**
 * Build an object guard from a shape of property guards.
 *
 * `props` maps property names to guards. `options.optional` may list keys that
 * are allowed to be missing. When `options.exact` is true, additional keys on
 * the object are disallowed. `options.rest` is a guard applied to any extra
 * property values when `exact` is false.
 *
 * @param props - Mapping of property names to guard functions
 * @param options - Optional configuration: `{ optional?: readonly (keyof G)[], exact?: boolean, rest?: Guard<unknown> }`
 * @returns A guard function that validates objects matching `props` with the given options
 * @example
 * ```ts
 * const g = objectOf({ a: (x): x is number => typeof x === 'number' })
 * g({ a: 1 }) // true
 * ```
 */
export function objectOf<const G extends GuardsShape, const Opt extends readonly (keyof G)[] = []>(
	props: G,
	options?: Readonly<{ optional?: Opt, exact?: boolean, rest?: Guard<unknown> }>,
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
		}
		else if (rest) {
			for (const k of Object.keys(obj)) {
				if (!(k in props) && !rest(obj[k])) return false
			}
		}
		return true
	}
}
