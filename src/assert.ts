import type {
	FromSchema,
	Guard,
	SchemaSpec,
	AssertOptions,
	DeepEqualOptions,
	DeepCloneCheckOptions,
	HttpMethod,
	HexColorOptions,
	HexStringOptions,
	ValidationPath, AnyTypedArray, JsonValue,
} from './types.js'
import { createTypeError, extendPath } from './diagnostics.js'
import { isArray, isDataView, isTypedArray, isInt8Array, isUint8Array, isUint8ClampedArray, isInt16Array, isUint16Array, isInt32Array, isUint32Array, isFloat32Array, isFloat64Array, isBigInt64Array, isBigUint64Array } from './arrays.js'
import { isAsyncFunction, isBoolean, isDefined, isFunction, isNumber, isString, isNull, isUndefined, isBigInt, isSymbol, isInteger, isSafeInteger, isDate, isRegExp, isError, isPromiseLike, isZeroArg, isNonNegativeNumber, isPositiveNumber } from './primitives.js'
import { hasSchema } from './schema.js'
import { isObject, isRecord, hasNo } from './objects.js'
import { deepCompare } from './deep.js'
import { isEmpty, isEmptyArray, isEmptyMap, isEmptyObject, isEmptySet, isEmptyString, isNonEmptyString, isNonEmptyArray, isNonEmptyObject, isNonEmptyMap, isNonEmptySet } from './emptiness.js'
import { isLowercase, isUppercase, isAlphanumeric, isAscii, isHexColor, isIPv4String, isIPv6String, isHostnameString } from './strings.js'
import { isUUIDv4, isISODateString, isISODateTimeString, isEmailString, isURLString, isHttpUrlString, isPortNumber, isMimeType, isSlug, isBase64String, isHexString, isSemver, isJsonString, isJsonValue, isHttpMethod, isValidHost, isValidIdent } from './domains.js'
import { isMap, isSet, isWeakMap, isWeakSet } from './collections.js'
import { isNegativeNumber, isMultipleOf } from './numbers.js'
import { isIterable } from './iterables.js'

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

function findSchemaViolation(obj: unknown, schema: SchemaSpec, path: ValidationPath = []): { expected: string, received: unknown, path: (import('./types.js').ValidationPath) } | undefined {
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

/**
 * Assert that a value is null.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNull } from '@orkestrel/validator'
 *
 * const value: unknown = null
 * assertNull(value)
 * // value is now null
 * ```
 */
export function assertNull(x: unknown, options?: AssertOptions): asserts x is null {
	if (!isNull(x)) fail('null', x, options)
}

/**
 * Assert that a value is undefined.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertUndefined } from '@orkestrel/validator'
 *
 * const value: unknown = undefined
 * assertUndefined(value)
 * // value is now undefined
 * ```
 */
export function assertUndefined(x: unknown, options?: AssertOptions): asserts x is undefined {
	if (!isUndefined(x)) fail('undefined', x, options)
}

/**
 * Assert that a value is a bigint.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertBigInt } from '@orkestrel/validator'
 *
 * const value: unknown = 1n
 * assertBigInt(value)
 * // value is now bigint
 * ```
 */
export function assertBigInt(x: unknown, options?: AssertOptions): asserts x is bigint {
	if (!isBigInt(x)) fail('bigint', x, options)
}

/**
 * Assert that a value is a symbol.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertSymbol } from '@orkestrel/validator'
 *
 * const value: unknown = Symbol('x')
 * assertSymbol(value)
 * // value is now symbol
 * ```
 */
export function assertSymbol(x: unknown, options?: AssertOptions): asserts x is symbol {
	if (!isSymbol(x)) fail('symbol', x, options)
}

/**
 * Assert that a value is an integer.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertInteger } from '@orkestrel/validator'
 *
 * const value: unknown = 42
 * assertInteger(value)
 * // value is now number (integer)
 * ```
 */
export function assertInteger(x: unknown, options?: AssertOptions): asserts x is number {
	if (!isInteger(x)) fail('integer', x, options)
}

/**
 * Assert that a value is a safe integer.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertSafeInteger } from '@orkestrel/validator'
 *
 * const value: unknown = 123
 * assertSafeInteger(value)
 * // value is now number (safe integer)
 * ```
 */
export function assertSafeInteger(x: unknown, options?: AssertOptions): asserts x is number {
	if (!isSafeInteger(x)) fail('safe integer', x, options)
}

/**
 * Assert that a value is a non-negative finite number.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNonNegativeNumber } from '@orkestrel/validator'
 *
 * const value: unknown = 0
 * assertNonNegativeNumber(value)
 * // value is now number (>= 0)
 * ```
 */
export function assertNonNegativeNumber(x: unknown, options?: AssertOptions): asserts x is number {
	if (!isNonNegativeNumber(x)) fail('non-negative number', x, options)
}

/**
 * Assert that a value is a positive finite number.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertPositiveNumber } from '@orkestrel/validator'
 *
 * const value: unknown = 1
 * assertPositiveNumber(value)
 * // value is now number (> 0)
 * ```
 */
export function assertPositiveNumber(x: unknown, options?: AssertOptions): asserts x is number {
	if (!isPositiveNumber(x)) fail('positive number', x, options)
}

/**
 * Assert that a value is a negative finite number.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNegativeNumber } from '@orkestrel/validator'
 *
 * const value: unknown = -1
 * assertNegativeNumber(value)
 * // value is now number (< 0)
 * ```
 */
export function assertNegativeNumber(x: unknown, options?: AssertOptions): asserts x is number {
	if (!isNegativeNumber(x)) fail('negative number', x, options)
}

/**
 * Assert that a value is a Date object.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertDate } from '@orkestrel/validator'
 *
 * const value: unknown = new Date()
 * assertDate(value)
 * // value is now Date
 * ```
 */
export function assertDate(x: unknown, options?: AssertOptions): asserts x is Date {
	if (!isDate(x)) fail('Date object', x, options)
}

/**
 * Assert that a value is a RegExp object.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertRegExp } from '@orkestrel/validator'
 *
 * const value: unknown = /abc/
 * assertRegExp(value)
 * // value is now RegExp
 * ```
 */
export function assertRegExp(x: unknown, options?: AssertOptions): asserts x is RegExp {
	if (!isRegExp(x)) fail('RegExp object', x, options)
}

/**
 * Assert that a value is an Error instance.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertError } from '@orkestrel/validator'
 *
 * const value: unknown = new Error('test')
 * assertError(value)
 * // value is now Error
 * ```
 */
export function assertError(x: unknown, options?: AssertOptions): asserts x is Error {
	if (!isError(x)) fail('Error instance', x, options)
}

/**
 * Assert that a value is thenable (Promise-like).
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertPromiseLike } from '@orkestrel/validator'
 *
 * const value: unknown = Promise.resolve(1)
 * assertPromiseLike(value)
 * // value is now PromiseLike<unknown>
 * ```
 */
export function assertPromiseLike<T = unknown>(x: unknown, options?: AssertOptions): asserts x is PromiseLike<T> {
	if (!isPromiseLike<T>(x)) fail('Promise-like (thenable)', x, options)
}

/**
 * Assert that a function takes no declared arguments.
 *
 * @param fn - Function to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertZeroArg } from '@orkestrel/validator'
 *
 * const fn: unknown = () => 42
 * assertZeroArg(fn)
 * // fn is now () => unknown
 * ```
 */
export function assertZeroArg(fn: unknown, options?: AssertOptions): asserts fn is () => unknown {
	if (!isZeroArg(fn as (...args: unknown[]) => unknown)) fail('zero-argument function', fn, options)
}

/**
 * Assert that a value is a DataView.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertDataView } from '@orkestrel/validator'
 *
 * const buf = new ArrayBuffer(8)
 * const view: unknown = new DataView(buf)
 * assertDataView(view)
 * // view is now DataView<ArrayBufferLike>
 * ```
 */
export function assertDataView(x: unknown, options?: AssertOptions): asserts x is DataView<ArrayBufferLike> {
	if (!isDataView(x)) fail('DataView', x, options)
}

/**
 * Assert that a value is a typed array (any variant).
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertTypedArray } from '@orkestrel/validator'
 *
 * const arr: unknown = new Uint8Array(4)
 * assertTypedArray(arr)
 * // arr is now AnyTypedArray
 * ```
 */
export function assertTypedArray(x: unknown, options?: AssertOptions): asserts x is AnyTypedArray {
	if (!isTypedArray(x)) fail('typed array', x, options)
}

/**
 * Assert that a value is an Int8Array.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new Int8Array(4)
 * assertInt8Array(v)
 * // v: Int8Array
 * ```
 */
export function assertInt8Array(x: unknown, options?: AssertOptions): asserts x is Int8Array {
	if (!isInt8Array(x)) fail('Int8Array', x, options)
}

/**
 * Assert that a value is a Uint8Array.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new Uint8Array(4)
 * assertUint8Array(v)
 * // v: Uint8Array
 * ```
 */
export function assertUint8Array(x: unknown, options?: AssertOptions): asserts x is Uint8Array {
	if (!isUint8Array(x)) fail('Uint8Array', x, options)
}

/**
 * Assert that a value is a Uint8ClampedArray.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new Uint8ClampedArray(4)
 * assertUint8ClampedArray(v)
 * // v: Uint8ClampedArray
 * ```
 */
export function assertUint8ClampedArray(x: unknown, options?: AssertOptions): asserts x is Uint8ClampedArray {
	if (!isUint8ClampedArray(x)) fail('Uint8ClampedArray', x, options)
}

/**
 * Assert that a value is an Int16Array.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new Int16Array(4)
 * assertInt16Array(v)
 * // v: Int16Array
 * ```
 */
export function assertInt16Array(x: unknown, options?: AssertOptions): asserts x is Int16Array {
	if (!isInt16Array(x)) fail('Int16Array', x, options)
}

/**
 * Assert that a value is a Uint16Array.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new Uint16Array(4)
 * assertUint16Array(v)
 * // v: Uint16Array
 * ```
 */
export function assertUint16Array(x: unknown, options?: AssertOptions): asserts x is Uint16Array {
	if (!isUint16Array(x)) fail('Uint16Array', x, options)
}

/**
 * Assert that a value is an Int32Array.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new Int32Array(4)
 * assertInt32Array(v)
 * // v: Int32Array
 * ```
 */
export function assertInt32Array(x: unknown, options?: AssertOptions): asserts x is Int32Array {
	if (!isInt32Array(x)) fail('Int32Array', x, options)
}

/**
 * Assert that a value is a Uint32Array.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new Uint32Array(4)
 * assertUint32Array(v)
 * // v: Uint32Array
 * ```
 */
export function assertUint32Array(x: unknown, options?: AssertOptions): asserts x is Uint32Array {
	if (!isUint32Array(x)) fail('Uint32Array', x, options)
}

/**
 * Assert that a value is a Float32Array.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new Float32Array(4)
 * assertFloat32Array(v)
 * // v: Float32Array
 * ```
 */
export function assertFloat32Array(x: unknown, options?: AssertOptions): asserts x is Float32Array {
	if (!isFloat32Array(x)) fail('Float32Array', x, options)
}

/**
 * Assert that a value is a Float64Array.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new Float64Array(4)
 * assertFloat64Array(v)
 * // v: Float64Array
 * ```
 */
export function assertFloat64Array(x: unknown, options?: AssertOptions): asserts x is Float64Array {
	if (!isFloat64Array(x)) fail('Float64Array', x, options)
}

/**
 * Assert that a value is a BigInt64Array.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new BigInt64Array(4)
 * assertBigInt64Array(v)
 * // v: BigInt64Array
 * ```
 */
export function assertBigInt64Array(x: unknown, options?: AssertOptions): asserts x is BigInt64Array {
	if (!isBigInt64Array(x)) fail('BigInt64Array', x, options)
}

/**
 * Assert that a value is a BigUint64Array.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = new BigUint64Array(4)
 * assertBigUint64Array(v)
 * // v: BigUint64Array
 * ```
 */
export function assertBigUint64Array(x: unknown, options?: AssertOptions): asserts x is BigUint64Array {
	if (!isBigUint64Array(x)) fail('BigUint64Array', x, options)
}

/**
 * Assert that a value is a Map.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertMap } from '@orkestrel/validator'
 *
 * const value: unknown = new Map()
 * assertMap(value)
 * // value is now ReadonlyMap<unknown, unknown>
 * ```
 */
export function assertMap<K = unknown, V = unknown>(x: unknown, options?: AssertOptions): asserts x is ReadonlyMap<K, V> {
	if (!isMap<K, V>(x)) fail('Map', x, options)
}

/**
 * Assert that a value is a Set.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertSet } from '@orkestrel/validator'
 *
 * const value: unknown = new Set()
 * assertSet(value)
 * // value is now ReadonlySet<unknown>
 * ```
 */
export function assertSet<T = unknown>(x: unknown, options?: AssertOptions): asserts x is ReadonlySet<T> {
	if (!isSet<T>(x)) fail('Set', x, options)
}

/**
 * Assert that a value is a WeakMap.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertWeakMap } from '@orkestrel/validator'
 *
 * const value: unknown = new WeakMap()
 * assertWeakMap(value)
 * // value is now WeakMap<object, unknown>
 * ```
 */
export function assertWeakMap(x: unknown, options?: AssertOptions): asserts x is WeakMap<object, unknown> {
	if (!isWeakMap(x)) fail('WeakMap', x, options)
}

/**
 * Assert that a value is a WeakSet.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertWeakSet } from '@orkestrel/validator'
 *
 * const value: unknown = new WeakSet()
 * assertWeakSet(value)
 * // value is now WeakSet<object>
 * ```
 */
export function assertWeakSet(x: unknown, options?: AssertOptions): asserts x is WeakSet<object> {
	if (!isWeakSet(x)) fail('WeakSet', x, options)
}

/**
 * Assert that a value is a non-empty string.
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNonEmptyString } from '@orkestrel/validator'
 *
 * const s: unknown = 'hello'
 * assertNonEmptyString(s)
 * // s is now string (non-empty)
 * ```
 */
export function assertNonEmptyString(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isNonEmptyString(x)) fail('non-empty string', x, options)
}

/**
 * Assert that a value is a non-empty array.
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNonEmptyArray } from '@orkestrel/validator'
 *
 * const a: unknown = [1, 2]
 * assertNonEmptyArray(a)
 * // a is now readonly [unknown, ...unknown[]]
 * ```
 */
export function assertNonEmptyArray<T = unknown>(x: unknown, options?: AssertOptions): asserts x is readonly [T, ...T[]] {
	if (!isNonEmptyArray<T>(x)) fail('non-empty array', x, options)
}

/**
 * Assert that a value is a non-empty object (has at least one own enumerable key).
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNonEmptyObject } from '@orkestrel/validator'
 *
 * const o: unknown = { a: 1 }
 * assertNonEmptyObject(o)
 * // o is now Record<string, unknown>
 * ```
 */
export function assertNonEmptyObject(x: unknown, options?: AssertOptions): asserts x is Record<string, unknown> {
	if (!isNonEmptyObject(x)) fail('non-empty object', x, options)
}

/**
 * Assert that a value is a non-empty Map.
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNonEmptyMap } from '@orkestrel/validator'
 *
 * const m: unknown = new Map([['a', 1]])
 * assertNonEmptyMap(m)
 * // m is now ReadonlyMap<unknown, unknown>
 * ```
 */
export function assertNonEmptyMap<K = unknown, V = unknown>(x: unknown, options?: AssertOptions): asserts x is ReadonlyMap<K, V> {
	if (!isNonEmptyMap<K, V>(x)) fail('non-empty Map', x, options)
}

/**
 * Assert that a value is a non-empty Set.
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertNonEmptySet } from '@orkestrel/validator'
 *
 * const s: unknown = new Set([1, 2])
 * assertNonEmptySet(s)
 * // s is now ReadonlySet<unknown>
 * ```
 */
export function assertNonEmptySet<T = unknown>(x: unknown, options?: AssertOptions): asserts x is ReadonlySet<T> {
	if (!isNonEmptySet<T>(x)) fail('non-empty Set', x, options)
}

/**
 * Assert that a value is an IPv6 address string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = '::1'
 * assertIPv6String(v)
 * // v: string
 * ```
 */
export function assertIPv6String(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isIPv6String(x)) fail('IPv6 address string', x, options)
}

/**
 * Assert that a value is an email address string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'user@example.com'
 * assertEmailString(v)
 * // v: string
 * ```
 */
export function assertEmailString(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isEmailString(x)) fail('email address string', x, options)
}

/**
 * Assert that a value is a valid host string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'example.com'
 * assertValidHost(v)
 * // v: string
 * ```
 */
export function assertValidHost(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isValidHost(x)) fail('valid host string', x, options)
}

/**
 * Assert that a value is a valid JavaScript identifier string.
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * const v: unknown = 'myVariable'
 * assertValidIdent(v)
 * // v: string
 * ```
 */
export function assertValidIdent(x: unknown, options?: AssertOptions): asserts x is string {
	if (!isValidIdent(x)) fail('valid JavaScript identifier', x, options)
}

/**
 * Assert that a value is a valid JSON value.
 *
 * @param x - Value to check
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertJsonValue } from '@orkestrel/validator'
 *
 * const value: unknown = { a: [1, null, 'text'] }
 * assertJsonValue(value)
 * // value is now JsonValue
 * ```
 */
export function assertJsonValue(x: unknown, options?: AssertOptions): asserts x is JsonValue {
	if (!isJsonValue(x)) fail('valid JSON value', x, options)
}

/**
 * Assert that a value is an iterable.
 *
 * @param x - Value to validate
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertIterable } from '@orkestrel/validator'
 *
 * const value: unknown = [1, 2, 3]
 * assertIterable(value)
 * // value is now Iterable<unknown>
 * ```
 */
export function assertIterable<T = unknown>(x: unknown, options?: AssertOptions): asserts x is Iterable<T> {
	if (!isIterable<T>(x)) fail('iterable', x, options)
}

/**
 * Assert that a value is a number that is a multiple of `m`.
 *
 * @param x - Value to validate
 * @param m - The modulus to check against
 * @param options - Optional diagnostics configuration
 * @example
 * ```ts
 * import { assertMultipleOf } from '@orkestrel/validator'
 *
 * const value: unknown = 9
 * assertMultipleOf(value, 3)
 * // value is now number (multiple of 3)
 * ```
 */
export function assertMultipleOf(x: unknown, m: number, options?: AssertOptions): asserts x is number {
	if (!isMultipleOf(m)(x)) fail(`multiple of ${m}`, x, options)
}
