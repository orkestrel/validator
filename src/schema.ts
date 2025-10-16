import type { FromSchema, Guard, SchemaSpec } from './types.js'
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
 * isSchema({ a: 1 }, { a: 'number' }) // true
 * isSchema({ a: 1 }, { a: x => typeof x === 'number' }) // true
 * ```
 */
export function isSchema<S extends SchemaSpec>(obj: unknown, schema: S): obj is FromSchema<S> {
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
			if (!isSchema(v, rule as SchemaSpec)) return false
		}
	}
	return true
}

/**
 * Determine whether an object satisfies the provided schema for any keys it has.
 *
 * This is like `isSchema` but missing keys on `obj` are allowed; when a
 * key from `schema` exists on `obj` it must satisfy the rule.
 *
 * @param obj - Value to validate
 * @param schema - Schema specification describing optional keys and rules
 * @returns `true` when `obj` is an object and any present schema keys satisfy their rules
 * @example
 * ```ts
 * isPartialSchema({ a: 1 }, { a: 'number', b: 'string' }) // true
 * isPartialSchema({}, { a: 'number' }) // true
 * ```
 */
export function isPartialSchema<S extends SchemaSpec>(obj: unknown, schema: S): obj is Partial<FromSchema<S>> {
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
			if (!isPartialSchema(v, rule as SchemaSpec)) return false
		}
	}
	return true
}
