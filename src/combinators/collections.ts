import type { Guard } from '../types.js'
import { isWeakMap, isWeakSet } from '../collections.js'

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
export function weakMapOf(): Guard<WeakMap<object, unknown>> {
	return (x: unknown): x is WeakMap<object, unknown> => isWeakMap(x)
}

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
export function weakSetOf(): Guard<WeakSet<object>> {
	return (x: unknown): x is WeakSet<object> => isWeakSet(x)
}
