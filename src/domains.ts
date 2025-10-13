import { isString, numberInRange, isInteger } from './primitives.js'

/**
 * Determine whether a value is a UUID v4 string.
 *
 * @param x - Value to check
 * @returns True if `x` is a UUID v4 string
 * @example
 * ```ts
 * isUUIDv4('550e8400-e29b-41d4-a716-446655440000') // true
 * ```
 */
export function isUUIDv4(x: unknown): x is string {
	return isString(x) && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x)
}

/**
 * Determine whether a value is an ISO date string (YYYY-MM-DD).
 *
 * @param x - Value to check
 * @returns True if `x` is an ISO date string
 * @example
 * ```ts
 * isISODateString('2020-01-02') // true
 * ```
 */
export function isISODateString(x: unknown): x is string {
	if (!isString(x)) return false
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(x)
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
 * @param x - Value to check
 * @returns True if `x` is an ISO date-time string
 * @example
 * ```ts
 * isISODateTimeString('2020-01-02T12:34:56Z') // true
 * ```
 */
export function isISODateTimeString(x: unknown): x is string {
	if (!isString(x)) return false
	if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(x)) return false
	const dt = new Date(x)
	return !Number.isNaN(dt.getTime())
}

/**
 * Determine whether a value looks like a simple email address.
 *
 * @param x - Value to check
 * @returns True if `x` resembles an email address
 * @example
 * ```ts
 * isEmail('alice@example.com') // true
 * ```
 */
export function isEmail(x: unknown): x is string {
	return isString(x) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x)
}

/**
 * Determine whether a value is a parseable URL string.
 *
 * @param x - Value to check
 * @returns True if `x` can be parsed as a URL
 * @example
 * ```ts
 * isURLString('https://example.com/path') // true
 * ```
 */
export function isURLString(x: unknown): x is string {
	if (!isString(x)) return false
	try {
		new URL(x)
		return true
	}
	catch {
		return false
	}
}

/**
 * Determine whether a value is an HTTP or HTTPS URL string.
 *
 * @param x - Value to check
 * @returns True if `x` is an http(s) URL
 * @example
 * ```ts
 * isHttpUrlString('https://example.com') // true
 * ```
 */
export function isHttpUrlString(x: unknown): x is string {
	if (!isURLString(x)) return false
	const u = new URL(x)
	return u.protocol === 'http:' || u.protocol === 'https:'
}

/**
 * Determine whether a value is a valid TCP/UDP port number (1-65535).
 *
 * @param x - Value to check
 * @returns True if `x` is a valid port number
 * @example
 * ```ts
 * isPortNumber(8080) // true
 * ```
 */
export function isPortNumber(x: unknown): x is number {
	return isInteger(x) && numberInRange(1, 65535)(x)
}

/**
 * Determine whether a value looks like a MIME type (type/subtype).
 *
 * @param x - Value to check
 * @returns True if `x` resembles a MIME type
 * @example
 * ```ts
 * isMimeType('application/json') // true
 * ```
 */
export function isMimeType(x: unknown): x is string {
	return isString(x) && /^[a-z0-9][\w.+-]*\/[a-z0-9][\w.+-]*$/i.test(x)
}

/**
 * Determine whether a value is a slug (lowercase alphanumeric with dashes).
 *
 * @param x - Value to check
 * @returns True if `x` is a slug
 * @example
 * ```ts
 * isSlug('my-post-1') // true
 * ```
 */
export function isSlug(x: unknown): x is string {
	return isString(x) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x)
}

/**
 * Determine whether a value is a Base64-encoded string.
 *
 * @param x - Value to check
 * @returns True if `x` appears to be Base64
 * @example
 * ```ts
 * isBase64String('SGVsbG8=') // true
 * ```
 */
export function isBase64String(x: unknown): x is string {
	return isString(x) && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(x)
}

/**
 * Determine whether a value is a hex string.
 *
 * Options control if `0x` prefix is allowed and whether length must be even.
 *
 * @param x - Value to check
 * @param opts - Options: `{ evenLength?: boolean, allow0x?: boolean }`
 * @returns True if `x` is a hex string according to options
 * @example
 * ```ts
 * isHexString('0xdeadbeef', { allow0x: true, evenLength: true }) // true
 * ```
 */
export function isHexString(x: unknown, opts?: Readonly<{ evenLength?: boolean, allow0x?: boolean }>): x is string {
	if (!isString(x)) return false
	const s = opts?.allow0x === true && x.startsWith('0x') ? x.slice(2) : x
	if (!/^[0-9a-fA-F]+$/.test(s)) return false
	return opts?.evenLength ? s.length % 2 === 0 : true
}

/**
 * Determine whether a value is a semantic version string (semver).
 *
 * @param x - Value to check
 * @returns True if `x` is a semver string
 * @example
 * ```ts
 * isSemver('1.2.3') // true
 * ```
 */
export function isSemver(x: unknown): x is string {
	if (!isString(x)) return false
	const re = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
	return re.test(x)
}

/**
 * Determine whether a value is a parseable JSON string.
 *
 * @param x - Value to check
 * @returns True if `x` is parseable JSON
 * @example
 * ```ts
 * isJsonString('{"a":1}') // true
 * ```
 */
export function isJsonString(x: unknown): x is string {
	if (!isString(x)) return false
	try {
		JSON.parse(x)
		return true
	}
	catch {
		return false
	}
}

export type JsonValue = null | boolean | number | string | JsonArray | JsonObject
export type JsonArray = ReadonlyArray<JsonValue>
export type JsonObject = Readonly<{ [k: string]: JsonValue }>

/**
 * Determine whether a value is a valid JSON value (recursively).
 *
 * @param x - Value to check
 * @returns True if `x` is a valid JsonValue
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

const httpMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'] as const
export type HttpMethod = typeof httpMethods[number]

/**
 * Determine whether a value is an HTTP method string.
 *
 * @param x - Value to check
 * @returns True if `x` is an HTTP method
 * @example
 * ```ts
 * isHttpMethod('GET') // true
 * ```
 */
export function isHttpMethod(x: unknown): x is HttpMethod {
	return isString(x) && (httpMethods as readonly string[]).includes(x)
}
