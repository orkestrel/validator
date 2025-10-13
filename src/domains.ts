import { numberInRange, isInteger } from './primitives.js'
import type { JsonValue, HttpMethod, HexStringOptions } from './types.js'

/**
 * Determine whether a value is a UUID v4 string.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isUUIDv4('123e4567-e89b-42d3-a456-426614174000') // true
 * ```
 */
export function isUUIDv4(s: string): boolean
export function isUUIDv4(s: unknown): s is string
export function isUUIDv4(s: unknown): boolean {
	if (typeof s !== 'string') return false
	return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)
}

/**
 * Determine whether a value is an ISO date string (YYYY-MM-DD).
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isISODateString('2020-01-02') // true
 * ```
 */
export function isISODateString(s: string): boolean
export function isISODateString(s: unknown): s is string
export function isISODateString(s: unknown): boolean {
	if (typeof s !== 'string') return false
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
	if (!m) return false
	const y = Number(m[1])
	const mo = Number(m[2])
	const d = Number(m[3])
	if (!(mo >= 1 && mo <= 12)) return false
	if (!(d >= 1 && d <= 31)) return false
	const dt = new Date(Date.UTC(y, mo - 1, d))
	return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
}

/**
 * Determine whether a value is an ISO date-time string (RFC3339-like).
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isISODateTimeString('2020-01-02T12:34:56Z') // true
 * ```
 */
export function isISODateTimeString(s: string): boolean
export function isISODateTimeString(s: unknown): s is string
export function isISODateTimeString(s: unknown): boolean {
	if (typeof s !== 'string') return false
	if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(s)) return false
	const dt = new Date(s)
	return !Number.isNaN(dt.getTime())
}

/**
 * Determine whether a value looks like a simple email address.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isEmailString('alice@example.com') // true
 * ```
 */
export function isEmailString(s: string): boolean
export function isEmailString(s: unknown): s is string
export function isEmailString(s: unknown): boolean {
	if (typeof s !== 'string') return false
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

/**
 * Determine whether a value is a parseable URL string.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isURLString('https://example.com/path') // true
 * ```
 */
export function isURLString(s: string): boolean
export function isURLString(s: unknown): s is string
export function isURLString(s: unknown): boolean {
	if (typeof s !== 'string') return false
	try {
		new URL(s)
		return true
	}
	catch {
		return false
	}
}

/**
 * Determine whether a value is an HTTP or HTTPS URL string.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isHttpUrlString('https://example.com') // true
 * ```
 */
export function isHttpUrlString(s: string): boolean
export function isHttpUrlString(s: unknown): s is string
export function isHttpUrlString(s: unknown): boolean {
	if (!isURLString(s)) return false
	const u = new URL(s)
	return u.protocol === 'http:' || u.protocol === 'https:'
}

/**
 * Determine whether a value is a valid TCP/UDP port number (1-65535).
 *
 * Overloads:
 * - When called with `number`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `number`.
 *
 * @example
 * ```ts
 * isPortNumber(8080) // true
 * ```
 */
export function isPortNumber(x: number): boolean
export function isPortNumber(x: unknown): x is number
export function isPortNumber(x: unknown): boolean {
	return isInteger(x) && numberInRange(1, 65535)(x)
}

/**
 * Determine whether a value looks like a MIME type (type/subtype).
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isMimeType('application/json') // true
 * ```
 */
export function isMimeType(s: string): boolean
export function isMimeType(s: unknown): s is string
export function isMimeType(s: unknown): boolean {
	if (typeof s !== 'string') return false
	return /^[a-z0-9][\w.+-]*\/[a-z0-9][\w.+-]*$/i.test(s)
}

/**
 * Determine whether a value is a slug (lowercase alphanumeric with dashes).
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isSlug('my-post-1') // true
 * ```
 */
export function isSlug(s: string): boolean
export function isSlug(s: unknown): s is string
export function isSlug(s: unknown): boolean {
	if (typeof s !== 'string') return false
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)
}

/**
 * Determine whether a value is a Base64-encoded string.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isBase64String('SGVsbG8=') // true
 * ```
 */
export function isBase64String(s: string): boolean
export function isBase64String(s: unknown): s is string
export function isBase64String(s: unknown): boolean {
	if (typeof s !== 'string') return false
	return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s)
}

/**
 * Determine whether a value is a hex string.
 *
 * Options control if `0x` prefix is allowed and whether length must be even.
 *
 * @param s - String to validate
 * @param opts - Optional options object
 * @remarks
 * Properties on `opts`:
 * - `evenLength` — when true, require an even number of hex digits
 * - `allow0x` — when true, allow a leading `0x` prefix which will be ignored for validation
 * @example
 * ```ts
 * isHexString('0xdeadbeef', { allow0x: true, evenLength: true }) // true
 * ```
 */
export function isHexString(s: string, opts?: HexStringOptions): boolean
export function isHexString(s: unknown, opts?: HexStringOptions): s is string
export function isHexString(s: unknown, opts?: HexStringOptions): boolean {
	if (typeof s !== 'string') return false
	const str = opts?.allow0x === true && s.startsWith('0x') ? s.slice(2) : s
	if (!/^[0-9a-fA-F]+$/.test(str)) return false
	return opts?.evenLength ? str.length % 2 === 0 : true
}

/**
 * Determine whether a value is a semantic version string (semver).
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isSemver('1.2.3') // true
 * ```
 */
export function isSemver(s: string): boolean
export function isSemver(s: unknown): s is string
export function isSemver(s: unknown): boolean {
	if (typeof s !== 'string') return false
	const re = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
	return re.test(s)
}

/**
 * Determine whether a value is a parseable JSON string.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @returns True if the string parses as JSON
 * @example
 * ```ts
 * isJsonString('{"a":1}') // true
 * ```
 */
export function isJsonString(s: string): boolean
export function isJsonString(s: unknown): s is string
export function isJsonString(s: unknown): boolean {
	if (typeof s !== 'string') return false
	try {
		JSON.parse(s)
		return true
	}
	catch {
		return false
	}
}

/**
 * Determine whether a value is a valid JSON value (recursively).
 *
 * @param x - Value to check for JSON-serializability
 * @returns True if `x` is a valid JSON value
 * @example
 * ```ts
 * isJsonValue({ a: [1, null, 's'] }) // true
 * ```
 */
export function isJsonValue(x: unknown): x is JsonValue {
	if (x === null) return true
	const t = typeof x
	if (t === 'string' || t === 'boolean') return true
	if (t === 'number') return Number.isFinite(x as number)
	if (Array.isArray(x)) return (x as unknown[]).every(isJsonValue)
	if (t === 'object') {
		const o = x as Record<string, unknown>
		for (const k of Object.keys(o)) {
			if (!isJsonValue(o[k])) return false
		}
		return true
	}
	return false
}

/**
 * Determine whether a value is an HTTP method string.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `HttpMethod`.
 *
 * @example
 * ```ts
 * isHttpMethod('GET') // true
 * ```
 */
export function isHttpMethod(s: string): boolean
export function isHttpMethod(s: unknown): s is HttpMethod
export function isHttpMethod(s: unknown): boolean {
	if (typeof s !== 'string') return false
	return ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'].includes(s)
}
