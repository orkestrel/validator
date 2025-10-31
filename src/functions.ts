import { isFunction } from './primitives.js';
import type {
	AnyAsyncFunction, AnyFunction, ZeroArgFunction,
	ZeroArgAsyncFunction,
} from './types.js';

/**
 * Determine whether a function takes no declared arguments.
 *
 * Overloads:
 * - When called with a zero‑arg function subtype, preserves the original type.
 * - When called with a general function, narrows to a zero‑arg function.
 *
 * @param fn - Function to inspect
 * @returns True if `fn.length === 0`
 * @example
 * ```ts
 * isZeroArg(() => 1) // true
 * isZeroArg((a: number) => a) // false
 * ```
 */
export function isZeroArg<F extends ZeroArgFunction>(fn: F): fn is F;
export function isZeroArg(fn: AnyFunction): fn is ZeroArgFunction;
export function isZeroArg(fn: AnyFunction): boolean {
	return fn.length === 0;
}

/**
 * Determine whether a function is an async function (native shape).
 *
 * Uses the function constructor name heuristic (`'AsyncFunction'`). This does not call the function
 * and will not detect transpiled async functions.
 *
 * Overloads:
 * - When called with an async function type (or a subtype), returns a type predicate preserving the original type.
 * - When called with `unknown`, returns a type predicate narrowing to a generic async function type.
 *
 * @param fn - Function to test
 * @returns True when `fn` is a native async function
 * @example
 * ```ts
 * isAsyncFunction(async () => 1) // true
 * isAsyncFunction(() => Promise.resolve(1)) // false
 * ```
 */
export function isAsyncFunction<F extends AnyAsyncFunction>(fn: F): fn is F;
export function isAsyncFunction(fn: unknown): fn is AnyAsyncFunction;
export function isAsyncFunction(fn: unknown): boolean {
	if (!isFunction(fn)) return false;
	return fn.constructor.name === 'AsyncFunction';
}

/**
 * Determine whether a function is a generator function.
 *
 * Uses the function constructor name heuristic (`'GeneratorFunction'`). Does not call the function.
 *
 * Overloads:
 * - When called with a generator function subtype, preserves the original type.
 * - When called with `unknown`, narrows to a generic generator function type.
 *
 * @param fn - Function to test
 * @returns True when `fn` is a generator function
 * @example
 * ```ts
 * function* gen() { yield 1 }
 * isGeneratorFunction(gen) // true
 * ```
 */
export function isGeneratorFunction<F extends (...args: unknown[]) => Generator<unknown, unknown, unknown>>(fn: F): fn is F;
export function isGeneratorFunction(fn: unknown): fn is (...args: unknown[]) => Generator<unknown, unknown, unknown>;
export function isGeneratorFunction(fn: unknown): boolean {
	if (!isFunction(fn)) return false;
	return fn.constructor.name === 'GeneratorFunction';
}

/**
 * Determine whether a function is an async generator function.
 *
 * Uses the function constructor name heuristic (`'AsyncGeneratorFunction'`). Does not call the function.
 *
 * Overloads:
 * - When called with an async generator function subtype, preserves the original type.
 * - When called with `unknown`, narrows to a generic async generator function type.
 *
 * @param fn - Function to test
 * @returns True when `fn` is an async generator function
 * @example
 * ```ts
 * async function* agen() { yield 1 }
 * isAsyncGeneratorFunction(agen) // true
 * ```
 */
export function isAsyncGeneratorFunction<F extends (...args: unknown[]) => AsyncGenerator<unknown, unknown, unknown>>(fn: F): fn is F;
export function isAsyncGeneratorFunction(fn: unknown): fn is (...args: unknown[]) => AsyncGenerator<unknown, unknown, unknown>;
export function isAsyncGeneratorFunction(fn: unknown): boolean {
	if (!isFunction(fn)) return false;
	return fn.constructor.name === 'AsyncGeneratorFunction';
}

/**
 * Determine whether a function is a zero‑argument native async function.
 *
 * Overloads:
 * - When called with a zero‑arg async function subtype, preserves the original type.
 * - When called with `unknown`, narrows to a zero‑arg async function type.
 *
 * @param fn - Function to test
 * @returns True when `fn` is native async and `fn.length === 0`
 * @example
 * ```ts
 * isZeroArgAsync(async () => 1) // true
 * isZeroArgAsync(async (x: number) => x) // false
 * isZeroArgAsync(() => Promise.resolve(1)) // false
 * ```
 */
export function isZeroArgAsync<F extends ZeroArgAsyncFunction>(fn: F): fn is F;
export function isZeroArgAsync(fn: unknown): fn is () => Promise<unknown>;
export function isZeroArgAsync(fn: unknown): boolean {
	if (!isFunction(fn)) return false;
	return isZeroArg(fn) && isAsyncFunction(fn);
}

/**
 * Determine whether a function is a zero‑argument generator function.
 *
 * Overloads:
 * - When called with a zero‑arg generator function subtype, preserves the original type.
 * - When called with `unknown`, narrows to a zero‑arg generator function type.
 *
 * @param fn - Function to test
 * @returns True when `fn` is a generator and `fn.length === 0`
 * @example
 * ```ts
 * function* gen() { yield 1 }
 * isZeroArgGenerator(gen) // true
 * ```
 */
export function isZeroArgGenerator<F extends (...args: unknown[]) => Generator<unknown, unknown, unknown>>(fn: F): fn is F;
export function isZeroArgGenerator(fn: unknown): fn is () => Generator<unknown, unknown, unknown>;
export function isZeroArgGenerator(fn: unknown): boolean {
	if (!isFunction(fn)) return false;
	return isZeroArg(fn) && isGeneratorFunction(fn);
}

/**
 * Determine whether a function is a zero‑argument async generator function.
 *
 * Overloads:
 * - When called with a zero‑arg async generator function subtype, preserves the original type.
 * - When called with `unknown`, narrows to a zero‑arg async generator function type.
 *
 * @param fn - Function to test
 * @returns True when `fn` is an async generator and `fn.length === 0`
 * @example
 * ```ts
 * async function* agen() { yield 1 }
 * isZeroArgAsyncGenerator(agen) // true
 * ```
 */
export function isZeroArgAsyncGenerator<F extends (...args: unknown[]) => AsyncGenerator<unknown, unknown, unknown>>(fn: F): fn is F;
export function isZeroArgAsyncGenerator(fn: unknown): fn is () => AsyncGenerator<unknown, unknown, unknown>;
export function isZeroArgAsyncGenerator(fn: unknown): boolean {
	if (!isFunction(fn)) return false;
	return isZeroArg(fn) && isAsyncGeneratorFunction(fn);
}
