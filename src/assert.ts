import type { FromSchema, Guard, SchemaSpec, AssertOptions, DeepEqualOptions, DeepCloneCheckOptions, HttpMethod, HexColorOptions, HexStringOptions } from './types.js'
import { createTypeError, extendPath } from './diagnostics.js'
import { isArray } from './arrays.js'
import { isAsyncFunction, isBoolean, isDefined, isFunction, isNumber, isString } from './primitives.js'
import { hasSchema } from './schema.js'
import { isObject, isRecord, hasNo } from './objects.js'
import { deepCompare } from './deep.js'
import { isEmpty, isEmptyArray, isEmptyMap, isEmptyObject, isEmptySet, isEmptyString } from './emptiness.js'
import { isLowercase, isUppercase, isAlphanumeric, isAscii, isHexColor, isIPv4String, isHostnameString } from './strings.js'
import { isUUIDv4, isISODateString, isISODateTimeString, isEmailString, isURLString, isHttpUrlString, isPortNumber, isMimeType, isSlug, isBase64String, isHexString, isSemver, isJsonString, isHttpMethod } from './domains.js'

function fail(expected: string, received: unknown, options?: AssertOptions): never {
	throw createTypeError(expected, received, options)
}

/**
 * Assert that a value satisfies a type guard.
 *
 * Throws a rich TypeError when the guard fails.
 *
 * @param x - Value to validate
 * @param guard - Guard to evaluate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertWithGuard } from '@orkestrel/validator'
 * import { isString } from './primitives.js'
 *
 * const value: unknown = 'ok'
 * assertWithGuard(value, isString)
 * // value is now string
 * ```
 */
export function assertWithGuard<T>(x: unknown, guard: Guard<T>, options?: AssertOptions): asserts x is T {
	if (!guard(x)) fail(options?.label ?? 'value matching guard', x, options)
}

/**
 * Assert that a value is a string.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertString } from '@orkestrel/validator'
 *
 * const name: unknown = 'alice'
 * assertString(name)
 * // name is now string
 * ```
 */
export function assertString(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isString(x)) fail('string', x, options)
}

/**
 * Assert that a value is a finite number.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNumber } from '@orkestrel/validator'
 *
 * const age: unknown = 42
 * assertNumber(age)
 * // age is now number
 * ```
 */
export function assertNumber(x: unknown, options?: AssertOptions): asserts x is number {
	if (!isNumber(x)) fail('finite number', x, options)
}

/**
 * Assert that a value is a boolean.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertBoolean } from '@orkestrel/validator'
 *
 * const flag: unknown = true
 * assertBoolean(flag)
 * // flag is now boolean
 * ```
 */
export function assertBoolean(x: unknown, options?: AssertOptions): asserts x is boolean {
	if (!isBoolean(x)) fail('boolean', x, options)
}

/**
 * Assert that a value is a function.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertFunction } from '@orkestrel/validator'
 *
 * const fn: unknown = () => {}
 * assertFunction(fn)
 * // fn is now (...args: unknown[]) => unknown
 * ```
 */
export function assertFunction(x: unknown, options?: AssertOptions): asserts x is (...args: unknown[]) => unknown {
	if (!isFunction(x)) fail('function', x, options)
}

/**
 * Assert that a value is an async function.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertAsyncFunction } from '@orkestrel/validator'
 *
 * const fn: unknown = async () => 1
 * assertAsyncFunction(fn)
 * // fn is now (...args: unknown[]) => Promise<unknown>
 * ```
 */
export function assertAsyncFunction(x: unknown, options?: AssertOptions): asserts x is (...args: unknown[]) => Promise<unknown> {
	if (!isAsyncFunction(x)) fail('async function', x, options)
}

/**
 * Assert that a value is an object (non-null, array allowed or not?).
 *
 * This checks for `typeof x === 'object' && x !== null`.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertObject } from '@orkestrel/validator'
 *
 * const cfg: unknown = { a: 1 }
 * assertObject(cfg)
 * // cfg is now Record<string, unknown>
 * ```
 */
export function assertObject(x: unknown, options?: AssertOptions): asserts x is Record<string, unknown> {
	if (!isObject(x)) fail('object', x, options)
}

/**
 * Assert that a value is a record (plain, non-array object).
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertRecord } from '@orkestrel/validator'
 *
 * const headers: unknown = { 'content-type': 'text/plain' }
 * assertRecord(headers)
 * // headers is now Record<string, unknown>
 * ```
 */
export function assertRecord(x: unknown, options?: AssertOptions): asserts x is Record<string, unknown> {
	if (!isRecord(x)) fail('record', x, options)
}

/**
 * Assert that a value is an array.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertArray } from '@orkestrel/validator'
 *
 * const items: unknown = [1, 2, 3]
 * assertArray<number>(items)
 * // items is now ReadonlyArray<number>
 * ```
 */
export function assertArray<T = unknown>(x: unknown, options?: AssertOptions): asserts x is ReadonlyArray<T> {
	if (!isArray<T>(x)) fail('array', x, options)
}

/**
 * Assert that a value is an array whose elements satisfy a guard.
 *
 * Pinpoints the first failing index in the error path.
 *
 * @param x - Value to validate
 * @param elem - Guard for elements
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertArrayOf } from '@orkestrel/validator'
 * import { isString } from './primitives.js'
 *
 * const tags: unknown = ['a', 'b']
 * assertArrayOf(tags, isString)
 * // tags is now ReadonlyArray<string>
 * ```
 */
export function assertArrayOf<T>(x: unknown, elem: Guard<T>, options?: AssertOptions): asserts x is ReadonlyArray<T> {
	if (!Array.isArray(x)) fail('array of elements matching guard', x, options)
	for (let i = 0; i < x.length; i++) {
		if (!elem(x[i])) {
			fail('element matching guard', x[i], { ...options, path: extendPath(options?.path, i) })
		}
	}
}

/**
 * Assert that a value is a non-empty array whose elements satisfy a guard.
 *
 * Pinpoints the first failing index in the error path.
 *
 * @param x - Value to validate
 * @param elem - Guard for elements
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNonEmptyArrayOf } from '@orkestrel/validator'
 * import { isNumber } from './primitives.js'
 *
 * const nums: unknown = [1]
 * assertNonEmptyArrayOf(nums, isNumber)
 * // nums is now readonly [number, ...number[]]
 * ```
 */
export function assertNonEmptyArrayOf<T>(x: unknown, elem: Guard<T>, options?: AssertOptions): asserts x is readonly [T, ...T[]] {
	if (!Array.isArray(x) || x.length === 0) fail('non-empty array of elements matching guard', x, options)
	for (let i = 0; i < x.length; i++) {
		if (!elem(x[i])) {
			fail('element matching guard', x[i], { ...options, path: extendPath(options?.path, i) })
		}
	}
}

/**
 * Assert that a value is a tuple whose elements satisfy a list of guards.
 *
 * @param x - Value to validate
 * @param guards - Guards for tuple elements
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertTupleOf } from '@orkestrel/validator'
 * import { isNumber, isString } from './primitives.js'
 *
 * const value: unknown = [1, 'a']
 * assertTupleOf(value, [isNumber, isString])
 * // value is now readonly [number, string]
 * ```
 */
export function assertTupleOf<const Gs extends readonly Guard<unknown>[]>(x: unknown, guards: Gs, options?: AssertOptions): asserts x is { readonly [K in keyof Gs]: Gs[K] extends Guard<infer T> ? T : never } {
	if (!Array.isArray(x) || x.length !== guards.length) {
		fail(`tuple length ${guards.length}`, x, options)
	}
	for (let i = 0; i < guards.length; i++) {
		const guard = guards[i]
		if (!guard || !guard(x[i])) {
			fail(`tuple element ${i} matching guard`, x[i], { ...options, path: extendPath(options?.path, i) })
		}
	}
}

/**
 * Assert that a value is a record whose values satisfy a guard.
 *
 * @param x - Value to validate
 * @param valueGuard - Guard for property values
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertRecordOf } from '@orkestrel/validator'
 * import { isNumber } from './primitives.js'
 *
 * const obj: unknown = { a: 1 }
 * assertRecordOf(obj, isNumber)
 * // obj is now Record<string, number>
 * ```
 */
export function assertRecordOf<T>(x: unknown, valueGuard: Guard<T>, options?: AssertOptions): asserts x is Record<string, T> {
	if (typeof x !== 'object' || x === null || Array.isArray(x)) {
		fail('record of values matching guard', x, options)
	}
	const obj = x as Record<string, unknown>
	for (const k of Object.keys(obj)) {
		const v = obj[k]
		if (!valueGuard(v)) {
			fail('property value matching guard', v, { ...options, path: extendPath(options?.path, k) })
		}
	}
}

function findSchemaViolation(obj: unknown, schema: SchemaSpec, path: (import('./types.js').ValidationPath) = []): { expected: string, received: unknown, path: (import('./types.js').ValidationPath) } | undefined {
	if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
		return { expected: 'object matching schema', received: obj, path }
	}
	const o = obj as Record<string, unknown>
	for (const [k, rule] of Object.entries(schema)) {
		if (!Object.prototype.hasOwnProperty.call(o, k)) {
			return { expected: `property "${k}"`, received: o, path }
		}
		const v = o[k]
		if (typeof rule === 'string') {
			if (rule === 'object') {
				if (!(typeof v === 'object' && v !== null && !Array.isArray(v))) {
					return { expected: `property "${k}" to be object`, received: v, path: extendPath(path, k) }
				}
			}
			else if (typeof v !== rule) {
				return { expected: `property "${k}" of type ${rule}`, received: v, path: extendPath(path, k) }
			}
		}
		else if (typeof rule === 'function') {
			if (!(rule as Guard<unknown>)(v)) {
				return { expected: `property "${k}" matching guard`, received: v, path: extendPath(path, k) }
			}
		}
		else {
			const child: ReturnType<typeof findSchemaViolation> = findSchemaViolation(v, rule, extendPath(path, k))
			if (child) return child
		}
	}
	return undefined
}

/**
 * Assert that a value conforms to a schema specification.
 *
 * The schema supports primitive tags ('string', 'number', ...), guard
 * functions, and nested schema objects.
 *
 * @param x - Value to validate
 * @param schema - Schema spec describing the expected structure
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertSchema } from '@orkestrel/validator'
 *
 * const user: unknown = { id: 'u1', age: 30 }
 * assertSchema(user, { id: 'string', age: 'number' })
 * // user is now { readonly id: string, readonly age: number }
 * ```
 */
export function assertSchema<S extends SchemaSpec>(x: unknown, schema: S, options?: AssertOptions): asserts x is FromSchema<S> {
	if (hasSchema(x, schema)) return
	const failInfo = findSchemaViolation(x, schema, options?.path ?? [])
	if (failInfo) {
		fail(failInfo.expected, failInfo.received, { ...options, path: failInfo.path })
	}
	else {
		fail('value matching schema', x, options)
	}
}

/**
 * Assert that a value is defined (neither `null` nor `undefined`).
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertDefined } from '@orkestrel/validator'
 *
 * let input: string | undefined
 * input = 'value'
 * assertDefined(input)
 * // input is now string
 * ```
 */
export function assertDefined<T>(x: T | null | undefined, options?: AssertOptions): asserts x is T {
	if (!isDefined(x)) fail('defined value', x, options)
}

/**
 * Assert deep structural equality between two values.
 *
 * @param actual - Actual value
 * @param expected - Expected value
 * @param options - Optional deep equal options and diagnostics
 * @example
 * ```ts
 * import { assertDeepEqual } from '@orkestrel/validator'
 *
 * assertDeepEqual({ a: 1 }, { a: 1 }) // passes
 * ```
 */
export function assertDeepEqual(actual: unknown, expected: unknown, options?: AssertOptions & DeepEqualOptions): void {
	const res = deepCompare(actual, expected, { identityMustDiffer: false, opts: options ?? {} })
	if (res.equal) return
	const base = `deep equality to expected value (${res.reason}${res.detail ? `: ${res.detail}` : ''})`
	const fullPath = options?.path ? [...options.path, ...res.path] : res.path
	fail(base, actual, { ...options, path: fullPath })
}

/**
 * Assert that two values are deep clones (deep equal with no shared references).
 *
 * @param actual - Actual value
 * @param expected - Expected value
 * @param options - Optional deep clone check options and diagnostics
 * @example
 * ```ts
 * import { assertDeepClone } from '@orkestrel/validator'
 *
 * const original = { a: [1] }
 * const clone = JSON.parse(JSON.stringify(original))
 * assertDeepClone(clone, original) // passes
 * ```
 */
export function assertDeepClone(actual: unknown, expected: unknown, options?: AssertOptions & DeepCloneCheckOptions): void {
	const res = deepCompare(actual, expected, { identityMustDiffer: true, opts: options ?? {} })
	if (res.equal) return
	const base = `deep clone (deep equality + no shared references) (${res.reason}${res.detail ? `: ${res.detail}` : ''})`
	const fullPath = options?.path ? [...options.path, ...res.path] : res.path
	fail(base, actual, { ...options, path: fullPath })
}

/**
 * Assert the negation of a guard: fails if `guard(x)` is true.
 *
 * @param x - Value to validate
 * @param guard - Guard to negate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNot } from '@orkestrel/validator'
 * import { isNumber } from './primitives.js'
 *
 * const v: unknown = 'x'
 * assertNot(v, isNumber) // passes
 * ```
 */
export function assertNot<T>(x: unknown, guard: Guard<T>, options?: AssertOptions): void {
	if (guard(x)) {
		fail(options?.label ? `not ${options.label}` : 'not matching guard', x, options)
	}
}

/**
 * Assert that an object does not own any of the provided keys.
 *
 * @param obj - Object to inspect
 * @param keysAndMaybeOptions - Keys to forbid and optionally an options object
 * @example
 * ```ts
 * import { assertHasNo } from '@orkestrel/validator'
 *
 * const obj = { a: 1 }
 * assertHasNo(obj, 'b') // passes
 * ```
 */
export function assertHasNo(obj: unknown, ...keysAndMaybeOptions: (PropertyKey | AssertOptions)[]): void {
	const maybeOptions = keysAndMaybeOptions[keysAndMaybeOptions.length - 1]
	const hasOptions = typeof maybeOptions === 'object' && maybeOptions != null && !Array.isArray(maybeOptions) && !('length' in (maybeOptions as object))
	const options = (hasOptions ? maybeOptions : undefined) as AssertOptions | undefined
	const keys = (hasOptions ? keysAndMaybeOptions.slice(0, -1) : keysAndMaybeOptions) as readonly PropertyKey[]
	if (!hasNo(obj, ...keys)) {
		fail(`object without keys: ${keys.map(String).join(', ')}`, obj, options)
	}
}

/**
 * Assert that a value is empty.
 *
 * Strings/arrays require `length === 0`. Map/Set require `size === 0`. Objects
 * require no own enumerable string or symbol keys.
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertEmpty } from '@orkestrel/validator'
 *
 * assertEmpty('')
 * assertEmpty([])
 * ```
 */
export function assertEmpty(x: unknown, options?: AssertOptions): void {
	if (!isEmpty(x)) fail('empty value', x, options)
}

/**
 * Assert that a value is an empty string.
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertEmptyString } from '@orkestrel/validator'
 *
 * const s: unknown = ''
 * assertEmptyString(s)
 * // s is now string (empty)
 * ```
 */
export function assertEmptyString(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isEmptyString(x)) fail('empty string', x, options)
}

/**
 * Assert that a value is an empty array.
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertEmptyArray } from '@orkestrel/validator'
 *
 * const a: unknown = []
 * assertEmptyArray(a)
 * // a is now readonly []
 * ```
 */
export function assertEmptyArray(x: unknown, options?: AssertOptions): asserts x is readonly [] {
	if (!isEmptyArray(x)) fail('empty array', x, options)
}

/**
 * Assert that a value is an empty object (no own enumerable string or symbol keys).
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertEmptyObject } from '@orkestrel/validator'
 *
 * const o: unknown = {}
 * assertEmptyObject(o)
 * // o is now Record<string | symbol, never>
 * ```
 */
export function assertEmptyObject(x: unknown, options?: AssertOptions): asserts x is Record<string | symbol, never> {
	if (!isEmptyObject(x)) fail('empty object', x, options)
}

/**
 * Assert that a value is an empty Map.
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertEmptyMap } from '@orkestrel/validator'
 *
 * const m: unknown = new Map()
 * assertEmptyMap(m)
 * // m is now ReadonlyMap<unknown, unknown>
 * ```
 */
export function assertEmptyMap(x: unknown, options?: AssertOptions): asserts x is ReadonlyMap<unknown, unknown> {
	if (!isEmptyMap(x)) fail('empty map', x, options)
}

/**
 * Assert that a value is an empty Set.
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertEmptySet } from '@orkestrel/validator'
 *
 * const s: unknown = new Set()
 * assertEmptySet(s)
 * // s is now ReadonlySet<unknown>
 * ```
 */
export function assertEmptySet(x: unknown, options?: AssertOptions): asserts x is ReadonlySet<unknown> {
	if (!isEmptySet(x)) fail('empty set', x, options)
}

/**
 * Assert that a value is a lowercase string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'abc'
 * assertLowercase(v)
 * // v: string
 * ```
 */
export function assertLowercase(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isLowercase(x)) fail('lowercase string', x, options)
}

/**
 * Assert that a value is an uppercase string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'ABC'
 * assertUppercase(v)
 * // v: string
 * ```
 */
export function assertUppercase(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isUppercase(x)) fail('uppercase string', x, options)
}

/**
 * Assert that a value is an alphanumeric string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'A1'
 * assertAlphanumeric(v)
 * // v: string
 * ```
 */
export function assertAlphanumeric(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isAlphanumeric(x)) fail('alphanumeric string', x, options)
}

/**
 * Assert that a value is an ASCII string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'Hello'
 * assertAscii(v)
 * // v: string
 * ```
 */
export function assertAscii(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isAscii(x)) fail('ASCII string', x, options)
}

/**
 * Assert that a value is a hex color string.
 * @param x - Value to check
 * @param opts - Options such as allowing a leading '#'
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = '#fff'
 * assertHexColor(v, { allowHash: true })
 * // v: string
 * ```
 */
export function assertHexColor(x: unknown, opts?: HexColorOptions, options?: AssertOptions): asserts x is string {
	if (!isHexColor(x as unknown, opts)) fail('hex color string', x, options)
}

/**
 * Assert that a value is an IPv4 address string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = '127.0.0.1'
 * assertIPv4String(v)
 * // v: string
 * ```
 */
export function assertIPv4String(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isIPv4String(x)) fail('IPv4 address string', x, options)
}

/**
 * Assert that a value is a hostname string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'example.com'
 * assertHostnameString(v)
 * // v: string
 * ```
 */
export function assertHostnameString(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isHostnameString(x)) fail('hostname string', x, options)
}

/**
 * Assert that a value is a UUID v4 string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = '123e4567-e89b-42d3-a456-426614174000'
 * assertUUIDv4(v)
 * // v: string
 * ```
 */
export function assertUUIDv4(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isUUIDv4(x)) fail('UUID v4 string', x, options)
}

/**
 * Assert that a value is an ISO date string (YYYY-MM-DD).
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = '2024-01-02'
 * assertISODateString(v)
 * // v: string
 * ```
 */
export function assertISODateString(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isISODateString(x)) fail('ISO date string (YYYY-MM-DD)', x, options)
}

/**
 * Assert that a value is an ISO date-time string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = '2024-10-12T16:59:32Z'
 * assertISODateTimeString(v)
 * // v: string
 * ```
 */
export function assertISODateTimeString(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isISODateTimeString(x)) fail('ISO date-time string', x, options)
}

/**
 * Assert that a value is an email string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'a@b.com'
 * assertEmail(v)
 * // v: string
 * ```
 */
export function assertEmail(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isEmailString(x)) fail('email address string', x, options)
}

/**
 * Assert that a value is a URL string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'https://example.com'
 * assertURLString(v)
 * // v: string
 * ```
 */
export function assertURLString(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isURLString(x)) fail('URL string', x, options)
}

/**
 * Assert that a value is an http(s) URL string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'https://example.com'
 * assertHttpUrlString(v)
 * // v: string
 * ```
 */
export function assertHttpUrlString(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isHttpUrlString(x)) fail('http(s) URL string', x, options)
}

/**
 * Assert that a value is a port number (1-65535).
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 8080
 * assertPortNumber(v)
 * // v: number
 * ```
 */
export function assertPortNumber(x: unknown, options?: AssertOptions): asserts x is number {
	if (!isPortNumber(x)) fail('port number (1-65535)', x, options)
}

/**
 * Assert that a value is a MIME type string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'text/plain'
 * assertMimeType(v)
 * // v: string
 * ```
 */
export function assertMimeType(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isMimeType(x)) fail('MIME type string', x, options)
}

/**
 * Assert that a value is a slug string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'my-post-1'
 * assertSlug(v)
 * // v: string
 * ```
 */
export function assertSlug(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isSlug(x)) fail('slug string', x, options)
}

/**
 * Assert that a value is a Base64-encoded string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'SGVsbG8='
 * assertBase64String(v)
 * // v: string
 * ```
 */
export function assertBase64String(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isBase64String(x)) fail('Base64-encoded string', x, options)
}

/**
 * Assert that a value is a hex string.
 * @param x - Value to check
 * @param opts - Options to constrain allowed formats (e.g., even length)
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'deadbeef'
 * assertHexString(v, { evenLength: true })
 * // v: string
 * ```
 */
export function assertHexString(x: unknown, opts?: HexStringOptions, options?: AssertOptions): asserts x is string {
	if (!isHexString(x as unknown, opts)) fail('hex string', x, options)
}

/**
 * Assert that a value is a semantic version string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = '1.2.3'
 * assertSemver(v)
 * // v: string
 * ```
 */
export function assertSemver(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isSemver(x)) fail('semantic version string', x, options)
}

/**
 * Assert that a value is a JSON string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = '{"a":1}'
 * assertJsonString(v)
 * // v: string
 * ```
 */
export function assertJsonString(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isJsonString(x)) fail('JSON string', x, options)
}

/**
 * Assert that a value is an HTTP method string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'GET'
 * assertHttpMethod(v)
 * // v: HttpMethod
 * ```
 */
export function assertHttpMethod(x: unknown, options?: AssertOptions): asserts x is HttpMethod {
	if (!isHttpMethod(x)) fail('HTTP method string', x, options)
}
