import type { ParsedAbsoluteUrl } from './types.js'
import { isInteger, numberInRange } from './primitives.js'
import { isValidHost } from './domains.js'

/**
 * Shared tiny helpers used across modules. These are intentionally generic
 * and environment-agnostic.
 */

/** Internal conservative absolute URL regex */
const ABS_URL_RE = /^(?<scheme>[A-Za-z][A-Za-z0-9+.-]*):\/\/(?<authority>[^/?#]*)(?<rest>[/?#].*)?$/

/**
 * Return the internal [[Class]] tag string for a value.
 *
 * @param x - Value to inspect
 * @returns Tag like "[object Array]" or "[object Date]"
 * @example
 * ```ts
 * getTag([]) // "[object Array]"
 * ```
 */
export function getTag(x: unknown): string {
	return Object.prototype.toString.call(x)
}

/**
 * Compute primitive type and [[Class]] tag for a value.
 *
 * @param x - Value to describe
 * @returns Object with `type` and `tag` fields
 * @example
 * ```ts
 * typeAndTag(1) // { type: 'number', tag: '[object Number]' }
 * ```
 */
export function typeAndTag(x: unknown): { type: string, tag: string } {
	const type = x === null ? 'null' : typeof x
	const tag = getTag(x)
	return { type, tag }
}

/**
 * Produce a short, stable preview string for a value suitable for diagnostics.
 *
 * @param x - Value to preview
 * @returns Human-friendly preview string
 * @example
 * ```ts
 * previewValue({ a: 1 }) // '{"a":1}' or similar short summary
 * ```
 */
export function previewValue(x: unknown): string {
	try {
		if (x === null) return 'null'
		if (x === undefined) return 'undefined'
		const t = typeof x
		if (t === 'string') {
			const str = x as string
			return str.length > 100 ? `${str.slice(0, 100)}\u2026` : str
		}
		if (t === 'number' || t === 'boolean' || t === 'bigint' || t === 'symbol' || t === 'function') return String(x)
		if (t === 'object') {
			const tag = getTag(x)
			if (Array.isArray(x)) return `${tag} length=${(x as unknown[]).length}`
			const json = JSON.stringify(x as Record<string, unknown>, (_, v) => (typeof v === 'bigint' ? String(v) : v))
			if (json && json.length <= 200) return json
			return tag
		}
		return String(x)
	}
	catch {
		return '[unprintable]'
	}
}

/**
 * Parse a decimal port number text into a number within [1, 65535].
 *
 * Returns `undefined` when the input is empty, non-numeric, or out of range.
 * Uses numeric guards (`isInteger` and `numberInRange`) to validate the result.
 *
 * @param portText - Raw port text (without a leading colon)
 * @returns A valid port number or `undefined`
 * @example
 * ```ts
 * parsePort('8080') // 8080
 * parsePort('0') // undefined
 * parsePort('abc') // undefined
 * ```
 */
export function parsePort(portText: string | undefined): number | undefined {
	if (portText === undefined || portText.length === 0) return undefined
	if (!/^\d+$/.test(portText)) return undefined
	const n = Number(portText)
	return isInteger(n) && numberInRange(1, 65535)(n) ? n : undefined
}

/**
 * Parse a conservative absolute URL string.
 *
 * Returns a minimal parsed shape when valid; otherwise `undefined`.
 *
 * @param input - URL string to parse (e.g., "https://example.com:8080/path?x#y")
 * @returns Parsed absolute URL fields or `undefined` when invalid
 * @example
 * ```ts
 * parseAbsoluteUrl('https://example.com')?.protocol // 'https:'
 * ```
 */
export function parseAbsoluteUrl(input: string): ParsedAbsoluteUrl | undefined {
	const m = ABS_URL_RE.exec(input)
	if (!m || !m.groups) return undefined
	const scheme = m.groups.scheme
	const authority = m.groups.authority
	if (authority.length === 0) return undefined

	// Strip userinfo if present
	const at = authority.lastIndexOf('@')
	const hostPort = at >= 0 ? authority.slice(at + 1) : authority

	// Split host and port (careful with IPv6 [..])
	let host = hostPort
	let portText: string | undefined
	if (hostPort.startsWith('[')) {
		const end = hostPort.indexOf(']')
		if (end <= 0) return undefined
		host = hostPort.slice(0, end + 1)
		const rest = hostPort.slice(end + 1)
		if (rest.startsWith(':')) portText = rest.slice(1)
		else if (rest.length > 0) return undefined
	}
	else {
		const colon = hostPort.lastIndexOf(':')
		if (colon > -1) {
			host = hostPort.slice(0, colon)
			portText = hostPort.slice(colon + 1)
		}
	}

	if (!isValidHost(host)) return undefined

	const port = parsePort(portText)
	if (portText !== undefined && port === undefined) return undefined

	return { protocol: scheme + ':', host, port }
}
