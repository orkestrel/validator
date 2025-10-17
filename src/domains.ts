import { isInteger, isRange } from './numbers.js'
import type { JsonValue, HttpMethod, HexStringOptions, HexColorOptions } from './types.js'
import { parseAbsoluteUrl } from './helpers.js'

/**
 * Determine whether a string is a valid JavaScript identifier (simple heuristic).
 *
 * Overloads:
 * - When called with `string`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `string` when valid.
 *
 * @example
 * ```ts
 * isIdentifier('name') // true
 * isIdentifier('weird key') // false
 * ```
 */
export function isIdentifier(s: string): boolean
export function isIdentifier(s: unknown): s is string
export function isIdentifier(s: unknown): boolean {
	return typeof s === 'string' && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s)
}

/**
 * Lightly validate a host token.
 *
 * Accepts bracketed IPv6 literals (e.g., "[::1]") and non-empty hostname/IPv4 strings.
 *
 * Overloads:
 * - When called with `string`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `string` when valid.
 *
 * @param text - Host text to validate
 * @returns `true` when the host looks valid enough for parsing
 * @example
 * ```ts
 * isHost('example.com') // true
 * isHost('[::1]') // true
 * isHost('') // false
 * ```
 */
export function isHost(text: string): boolean
export function isHost(text: unknown): text is string
export function isHost(text: unknown): boolean {
	if (typeof text !== 'string') return false
	if (text.length === 0) return false
	if (text.startsWith('[') && text.endsWith(']')) {
		const inner = text.slice(1, -1)
		return isIPv6String(inner)
	}
	if (isIPv4String(text)) return true
	return isHostnameString(text)
}

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
 * isISODate('2020-01-02') // true
 * ```
 */
export function isISODate(s: string): boolean
export function isISODate(s: unknown): s is string
export function isISODate(s: unknown): boolean {
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
 * isISODateTime('2020-01-02T12:34:56Z') // true
 * ```
 */
export function isISODateTime(s: string): boolean
export function isISODateTime(s: unknown): s is string
export function isISODateTime(s: unknown): boolean {
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
 * isEmail('alice@example.com') // true
 * ```
 */
export function isEmail(s: string): boolean
export function isEmail(s: unknown): s is string
export function isEmail(s: unknown): boolean {
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
 * isURL('https://example.com/path') // true
 * ```
 */
export function isURL(s: string): boolean
export function isURL(s: unknown): s is string
export function isURL(s: unknown): boolean {
	return typeof s === 'string' && parseAbsoluteUrl(s) !== undefined
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
 * isPort(8080) // true
 * ```
 */
export function isPort(x: number): boolean
export function isPort(x: unknown): x is number
export function isPort(x: unknown): boolean {
	return isInteger(x) && isRange(x, 1, 65535)
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
 * isMIMEType('application/json') // true
 * ```
 */
export function isMIMEType(s: string): boolean
export function isMIMEType(s: unknown): s is string
export function isMIMEType(s: unknown): boolean {
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
 * isBase64('TWFu') // true
 * isBase64('TQ==') // true
 * isBase64('SGVsbG8=') // true
 * ```
 */
export function isBase64(s: string): boolean
export function isBase64(s: unknown): s is string
export function isBase64(s: unknown): boolean {
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
 * isHex('0xdeadbeef', { allow0x: true, evenLength: true }) // true
 * ```
 */
export function isHex(s: string, opts?: HexStringOptions): boolean
export function isHex(s: unknown, opts?: HexStringOptions): s is string
export function isHex(s: unknown, opts?: HexStringOptions): boolean {
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
 * isHTTPMethod('GET') // true
 * ```
 */
export function isHTTPMethod(s: string): boolean
export function isHTTPMethod(s: unknown): s is HttpMethod
export function isHTTPMethod(s: unknown): boolean {
	if (typeof s !== 'string') return false
	return ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'].includes(s)
}

/**
 * Determine whether a string contains only ASCII characters (U+0000 through U+007F).
 *
 * Avoids no-control-regex by using charCode checks instead of a regex.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isAscii('Hello') // true
 * ```
 */
export function isAscii(s: string): boolean
export function isAscii(s: unknown): s is string
export function isAscii(s: unknown): boolean {
	if (typeof s !== 'string') return false
	for (let i = 0; i < s.length; i++) {
		const code = s.charCodeAt(i)
		if (code < 0x00 || code > 0x7f) return false
	}
	return true
}

/**
 * Determine whether a value is a hex color (#RGB | #RRGGBB | #RRGGBBAA).
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @param s - Value to test
 * @param opts - Options such as allowHash
 * @example
 * ```ts
 * isHexColor('#fff', { allowHash: true }) // true
 * ```
 */
export function isHexColor(s: string, opts?: HexColorOptions): boolean
export function isHexColor(s: unknown, opts?: HexColorOptions): s is string
export function isHexColor(s: unknown, opts?: HexColorOptions): boolean {
	if (typeof s !== 'string') return false
	const t = opts?.allowHash === true && s.startsWith('#') ? s.slice(1) : s
	return /^([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(t)
}

/**
 * Determine whether a string is an IPv4 address in dotted-decimal form.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isIPv4String('127.0.0.1') // true
 * ```
 */
export function isIPv4String(s: string): boolean
export function isIPv4String(s: unknown): s is string
export function isIPv4String(s: unknown): boolean {
	if (typeof s !== 'string') return false
	const m = s.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
	if (!m) return false
	for (let i = 1; i <= 4; i++) {
		const part = m[i]
		if (!part) return false
		const n = Number(part)
		if (!Number.isInteger(n) || n < 0 || n > 255) return false
		if (part.length > 1 && part.startsWith('0')) return false
	}
	return true
}

/**
 * Determine whether a string is an IPv6 address (RFC 4291/5952 subset).
 *
 * Supports compressed forms with a single "::" and IPv4-mapped endings like
 * "::ffff:192.0.2.128". Zone identifiers ("%eth0") are not supported.
 *
 * Overloads:
 * - When called with `string`, returns `boolean`.
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isIPv6String('::1') // true
 * isIPv6String('2001:db8::1') // true
 * isIPv6String('::ffff:192.0.2.128') // true
 * isIPv6String(':::1') // false
 * ```
 */
export function isIPv6String(s: string): boolean
export function isIPv6String(s: unknown): s is string
export function isIPv6String(s: unknown): boolean {
	if (typeof s !== 'string') return false
	if (s.includes('%')) return false // zone IDs not supported here
	const hasDot = s.includes('.')
	const parts = s.split('::')
	if (parts.length > 2) return false
	// Reject adjacent extra ':' around the single '::' compression
	if (parts.length === 2) {
		const leftRaw = parts[0]
		const rightRaw = parts[1]
		// If left side ends with ':' or right side starts with ':', then there are ':::' sequences
		if ((leftRaw.length > 0 && leftRaw.endsWith(':')) || (rightRaw.length > 0 && rightRaw.startsWith(':'))) return false
		// Also reject stray single ':' at the very start of left or end of right (e.g., ':...::...' or '...::...:')
		if ((leftRaw.length > 0 && leftRaw.startsWith(':')) || (rightRaw.length > 0 && rightRaw.endsWith(':'))) return false
	}
	const left = parts[0] ? parts[0].split(':').filter(p => p.length > 0) : []
	const right = parts.length === 2 ? (parts[1] ? parts[1].split(':').filter(p => p.length > 0) : []) : []
	let ipv4Hextets = 0
	// Handle embedded IPv4 in the last position
	function hasEmbeddedIPv4(arr: readonly string[]): boolean {
		if (arr.length === 0) return false
		const last = arr[arr.length - 1]
		return last.includes('.')
	}
	if (hasDot) {
		// Only one segment may contain IPv4 and it must be the last of left or right
		let ipv4Str: string | undefined
		if (hasEmbeddedIPv4(right)) {
			ipv4Str = right[right.length - 1]
			right.pop()
		}
		else if (hasEmbeddedIPv4(left) && parts.length === 1) {
			ipv4Str = left[left.length - 1]
			left.pop()
		}
		else {
			return false
		}
		if (!ipv4Str || !isIPv4String(ipv4Str)) return false
		ipv4Hextets = 2
	}
	// Validate hextets
	const hexRe = /^[0-9a-fA-F]{1,4}$/
	for (const seg of left) if (!hexRe.test(seg)) return false
	for (const seg of right) if (!hexRe.test(seg)) return false
	const segCount = left.length + right.length + ipv4Hextets
	if (parts.length === 1) {
		// No '::' compression; must be exactly 8 hextets
		return segCount === 8
	}
	else {
		// With '::', total must be < 8 (missing segments are zeros)
		return segCount < 8
	}
}

/**
 * Determine whether a hostname string roughly follows RFC 1123 rules.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isHostnameString('example.com') // true
 * ```
 */
export function isHostnameString(s: string): boolean
export function isHostnameString(s: unknown): s is string
export function isHostnameString(s: unknown): boolean {
	if (typeof s !== 'string') return false
	if (s.length === 0 || s.length > 253) return false
	const labels = s.split('.')
	for (const label of labels) {
		if (label.length < 1 || label.length > 63) return false
		if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)) return false
	}
	return true
}
