import type { Guard } from '../types.js'

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
