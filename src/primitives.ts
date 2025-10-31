/**
 * Determine whether a value is `null`.
 *
 * Overloads:
 * - When called with `null`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `null`.
 *
 * @param x - Value to test
 * @returns True when `x === null`
 * @example
 * ```ts
 * isNull(null) // true
 * isNull(undefined) // false
 * ```
 */
export function isNull(x: null): boolean;
export function isNull(x: unknown): x is null;
export function isNull(x: unknown): boolean {
	return x === null;
}

/**
 * Determine whether a value is `undefined`.
 *
 * Overloads:
 * - When called with `undefined`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `undefined`.
 *
 * @param x - Value to test
 * @returns True when `x === undefined`
 * @example
 * ```ts
 * isUndefined(undefined) // true
 * isUndefined(null) // false
 * ```
 */
export function isUndefined(x: undefined): boolean;
export function isUndefined(x: unknown): x is undefined;
export function isUndefined(x: unknown): boolean {
	return x === undefined;
}

/**
 * Determine whether a value is defined (neither `null` nor `undefined`).
 *
 * Overloads:
 * - When called with `T`, returns `boolean` (no narrowing).
 * - When called with `T | null | undefined`, returns a type predicate narrowing to `T`.
 *
 * @param x - Value to test
 * @returns True when `x` is neither `null` nor `undefined`
 * @example
 * ```ts
 * isDefined(0) // true
 * isDefined(null) // false
 * ```
 */
export function isDefined<T>(x: T): boolean;
export function isDefined<T>(x: T | null | undefined): x is T;
export function isDefined<T>(x: T | null | undefined): boolean {
	return x !== null && x !== undefined;
}

/**
 * Determine whether a value is a string.
 *
 * Overloads:
 * - When called with `string`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @param x - Value to test
 * @returns True when `typeof x === 'string'`
 * @example
 * ```ts
 * isString('a') // true
 * isString(1) // false
 * ```
 */
export function isString(x: string): boolean;
export function isString(x: unknown): x is string;
export function isString(x: unknown): boolean {
	return typeof x === 'string';
}

/**
 * Determine whether a value is a JavaScript number (typeof check only).
 *
 * Overloads:
 * - When called with `number`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * Note: This checks only `typeof x === 'number'`. Values like `NaN`, `Infinity`, and
 * `-Infinity` are considered numbers. For finite checks, use dedicated number helpers.
 *
 * @param x - Value to test
 * @returns True when `typeof x === 'number'`
 * @example
 * ```ts
 * isNumber(1) // true
 * isNumber(NaN) // true
 * isNumber('1') // false
 * ```
 */
export function isNumber(x: number): boolean;
export function isNumber(x: unknown): x is number;
export function isNumber(x: unknown): boolean {
	return typeof x === 'number';
}

/**
 * Determine whether a value is a boolean.
 *
 * Overloads:
 * - When called with `boolean`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `boolean`.
 *
 * @param x - Value to test
 * @returns True when `typeof x === 'boolean'`
 * @example
 * ```ts
 * isBoolean(true) // true
 * isBoolean(0) // false
 * ```
 */
export function isBoolean(x: boolean): boolean;
export function isBoolean(x: unknown): x is boolean;
export function isBoolean(x: unknown): boolean {
	return typeof x === 'boolean';
}

/**
 * Determine whether a value is a bigint.
 *
 * Overloads:
 * - When called with `bigint`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `bigint`.
 *
 * @param x - Value to test
 * @returns True when `typeof x === 'bigint'`
 * @example
 * ```ts
 * isBigInt(1n) // true
 * isBigInt(1) // false
 * ```
 */
export function isBigInt(x: bigint): boolean;
export function isBigInt(x: unknown): x is bigint;
export function isBigInt(x: unknown): boolean {
	return typeof x === 'bigint';
}

/**
 * Determine whether a value is a symbol.
 *
 * Overloads:
 * - When called with `symbol`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `symbol`.
 *
 * @param x - Value to test
 * @returns True when `typeof x === 'symbol'`
 * @example
 * ```ts
 * isSymbol(Symbol('x')) // true
 * isSymbol('x') // false
 * ```
 */
export function isSymbol(x: symbol): boolean;
export function isSymbol(x: unknown): x is symbol;
export function isSymbol(x: unknown): boolean {
	return typeof x === 'symbol';
}

/**
 * Determine whether a value is a function.
 *
 * Overloads:
 * - When called with function type, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to function.
 *
 * @param x - Value to test
 * @returns True when `typeof x === 'function'`
 * @example
 * ```ts
 * isFunction(() => {}) // true
 * isFunction({}) // false
 * ```
 */
export function isFunction(x: (...args: unknown[]) => unknown): boolean;
export function isFunction(x: unknown): x is (...args: unknown[]) => unknown;
export function isFunction(x: unknown): boolean {
	return typeof x === 'function';
}

/**
 * Determine whether a value is a Date object.
 *
 * Uses `instanceof Date` (no tag checks). Note this may fail across realms.
 *
 * @param x - Value to test
 * @returns True when `x instanceof Date`
 * @example
 * ```ts
 * isDate(new Date()) // true
 * isDate({}) // false
 * ```
 */
export function isDate(x: Date): boolean;
export function isDate(x: unknown): x is Date;
export function isDate(x: unknown): boolean {
	return x instanceof Date;
}

/**
 * Determine whether a value is a RegExp object.
 *
 * Uses `instanceof RegExp` (no tag checks). Note this may fail across realms.
 *
 * @param x - Value to test
 * @returns True when `x instanceof RegExp`
 * @example
 * ```ts
 * isRegExp(/a/) // true
 * isRegExp('a') // false
 * ```
 */
export function isRegExp(x: RegExp): boolean;
export function isRegExp(x: unknown): x is RegExp;
export function isRegExp(x: unknown): boolean {
	return x instanceof RegExp;
}

/**
 * Determine whether a value is an Error instance.
 *
 * Uses `instanceof Error`.
 *
 * @param x - Value to test
 * @returns True when `x instanceof Error`
 * @example
 * ```ts
 * isError(new Error('e')) // true
 * isError({}) // false
 * ```
 */
export function isError(x: Error): boolean;
export function isError(x: unknown): x is Error;
export function isError(x: unknown): boolean {
	return x instanceof Error;
}

/**
 * Determine whether a value is promise-like with `then`, `catch`, and `finally`.
 *
 * This is stricter than a generic thenable and useful when you want parity with the
 * native Promise API without enforcing `instanceof Promise`.
 *
 * @param x - Value to test
 * @returns True when `x` exposes callable `then`, `catch`, and `finally` members
 * @example
 * ```ts
 * isPromiseLike(Promise.resolve(1)) // true
 * isPromiseLike({ then() {}, catch() {}, finally() {} }) // true
 * isPromiseLike({ then() {} }) // false
 * ```
 */
export function isPromiseLike<_T = unknown>(x: unknown): x is Promise<_T> | (PromiseLike<_T> & { catch: unknown; finally: unknown }) {
	if (x == null) return false;
	const t = typeof x;
	if (t !== 'object' && t !== 'function') return false;
	const then = (x as { then?: unknown }).then;
	const c = (x as { catch?: unknown }).catch;
	const f = (x as { finally?: unknown }).finally;
	return typeof then === 'function' && typeof c === 'function' && typeof f === 'function';
}

/**
 * Determine whether a value is a native Promise instance.
 *
 * Uses `instanceof Promise`.
 *
 * @param x - Value to test
 * @returns True when `x instanceof Promise`
 * @example
 * ```ts
 * isPromise(Promise.resolve(1)) // true
 * isPromise({ then() {} } as unknown) // false
 * ```
 */
export function isPromise<_T = unknown>(x: Promise<_T>): boolean;
export function isPromise<_T = unknown>(x: unknown): x is Promise<_T>;
export function isPromise<_T = unknown>(x: unknown): boolean {
	return x instanceof Promise;
}

/**
 * Determine whether a value is an ArrayBuffer.
 *
 * Uses `instanceof ArrayBuffer`.
 *
 * @param x - Value to test
 * @returns True when `x instanceof ArrayBuffer`
 * @example
 * ```ts
 * isArrayBuffer(new ArrayBuffer(8)) // true
 * isArrayBuffer({}) // false
 * ```
 */
export function isArrayBuffer(x: ArrayBuffer): boolean;
export function isArrayBuffer(x: unknown): x is ArrayBuffer;
export function isArrayBuffer(x: unknown): boolean {
	return x instanceof ArrayBuffer;
}

/**
 * Determine whether a value is a SharedArrayBuffer.
 *
 * Checks for global constructor availability, then uses `instanceof`.
 *
 * @param x - Value to test
 * @returns True when `SharedArrayBuffer` exists and `x instanceof SharedArrayBuffer`
 * @example
 * ```ts
 * isSharedArrayBuffer(typeof SharedArrayBuffer !== 'undefined' ? new SharedArrayBuffer(8) : undefined) // true or false
 * ```
 */
export function isSharedArrayBuffer(x: SharedArrayBuffer): boolean;
export function isSharedArrayBuffer(x: unknown): x is SharedArrayBuffer;
export function isSharedArrayBuffer(x: unknown): boolean {
	return typeof SharedArrayBuffer !== 'undefined' && x instanceof SharedArrayBuffer;
}

/**
 * Determine whether a value implements the iterable protocol.
 *
 * A value is considered iterable when it is non-nullish and has a callable `[Symbol.iterator]` method.
 *
 * Overloads:
 * - When called with `Iterable<T>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `Iterable<T>`.
 *
 * @param x - Value to test
 * @returns True when `x` exposes a callable `[Symbol.iterator]`
 * @example
 * ```ts
 * isIterable([1, 2, 3]) // true
 * isIterable(new Set([1])) // true
 * isIterable({}) // false
 * ```
 */
export function isIterable<_T = unknown>(x: Iterable<_T>): boolean;
export function isIterable<_T = unknown>(x: unknown): x is Iterable<_T>;
export function isIterable<_T = unknown>(x: unknown): boolean {
	return x != null && typeof (x as { [Symbol.iterator]?: unknown })[Symbol.iterator] === 'function';
}

/**
 * Determine whether a value implements the async-iterable protocol.
 *
 * A value is considered async-iterable when it is non-nullish and has a callable `[Symbol.asyncIterator]` method.
 *
 * Overloads:
 * - When called with `AsyncIterable<T>`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `AsyncIterable<T>`.
 *
 * @param x - Value to test
 * @returns True when `x` exposes a callable `[Symbol.asyncIterator]`
 * @example
 * ```ts
 * async function* agen() { yield 1 }
 * isAsyncIterator(agen()) // true
 * isAsyncIterator([]) // false
 * ```
 */
export function isAsyncIterator<_T = unknown>(x: AsyncIterable<_T>): boolean;
export function isAsyncIterator<_T = unknown>(x: unknown): x is AsyncIterable<_T>;
export function isAsyncIterator<_T = unknown>(x: unknown): boolean {
	return x != null && typeof (x as { [Symbol.asyncIterator]?: unknown })[Symbol.asyncIterator] === 'function';
}
