import type { Guard, HttpMethod, HexColorOptions, HexStringOptions } from '../types.js'
import {
	isUUIDv4,
	isISODate,
	isISODateTime,
	isEmail,
	isURL,
	isPort,
	isMIMEType,
	isSlug,
	isBase64,
	isHex,
	isSemver,
	isJsonString,
	isJsonValue,
	isHTTPMethod,
	isIdentifier,
	isHost,
	isAscii,
	isHexColor,
	isIPv4String,
	isIPv6String,
	isHostnameString,
} from '../domains.js'

/** Domain wrappers returning guards for common string formats and tokens. */
/**
 * Guard for RFC4122 version 4 UUID strings.
 * @returns Guard that accepts UUID v4 strings
 * @example
 * ```ts
 * uuidV4Of()('123e4567-e89b-42d3-a456-426614174000') // true
 * ```
 */
export function uuidV4Of(): Guard<string> {
	return (x: unknown): x is string => isUUIDv4(x)
}
/**
 * Guard for ISO date strings (YYYY-MM-DD).
 * @returns Guard that accepts ISO dates
 * @example
 * ```ts
 * isoDateOf()('2020-01-02') // true
 * ```
 */
export function isoDateOf(): Guard<string> {
	return (x: unknown): x is string => isISODate(x)
}
/**
 * Guard for ISO date-time strings (RFC3339 subset).
 * @returns Guard that accepts ISO date-time strings
 * @example
 * ```ts
 * isoDateTimeOf()('2020-01-02T12:34:56Z') // true
 * ```
 */
export function isoDateTimeOf(): Guard<string> {
	return (x: unknown): x is string => isISODateTime(x)
}
/**
 * Guard for simple email address strings.
 * @returns Guard that accepts emails like "alice\@example.com"
 * @example
 * ```ts
 * emailOf()('test@example.com') // true
 * ```
 */
export function emailOf(): Guard<string> {
	return (x: unknown): x is string => isEmail(x)
}
/**
 * Guard for parseable absolute URL strings.
 * @returns Guard that accepts absolute URLs
 * @example
 * ```ts
 * urlOf()('https://example.com') // true
 * ```
 */
export function urlOf(): Guard<string> {
	return (x: unknown): x is string => isURL(x)
}
/**
 * Guard for valid TCP/UDP port numbers (1..65535).
 * @returns Guard that accepts a valid port number
 * @example
 * ```ts
 * portOf()(8080) // true
 * ```
 */
export function portOf(): Guard<number> {
	return (x: unknown): x is number => isPort(x)
}
/**
 * Guard for MIME type strings (type/subtype).
 * @returns Guard that accepts MIME types like "application/json"
 * @example
 * ```ts
 * mimeTypeOf()('application/json') // true
 * ```
 */
export function mimeTypeOf(): Guard<string> {
	return (x: unknown): x is string => isMIMEType(x)
}
/**
 * Guard for slug strings (lowercase alphanumerics with dashes).
 * @returns Guard that accepts slug strings
 * @example
 * ```ts
 * slugOf()('hello-world') // true
 * ```
 */
export function slugOf(): Guard<string> {
	return (x: unknown): x is string => isSlug(x)
}
/**
 * Guard for Base64-encoded strings.
 * @returns Guard that accepts Base64 strings
 * @example
 * ```ts
 * base64Of()('SGVsbG8=') // true
 * ```
 */
export function base64Of(): Guard<string> {
	return (x: unknown): x is string => isBase64(x)
}
/**
 * Guard for hex strings with options.
 * @param opts - Options controlling even length and 0x prefix
 * @returns Guard that accepts hex strings per options
 * @example
 * ```ts
 * hexStringOf({ allow0x: true, evenLength: true })('0xdeadbeef') // true
 * ```
 */
export function hexStringOf(opts?: HexStringOptions): Guard<string> {
	return (x: unknown): x is string => isHex(x, opts)
}
/**
 * Guard for semantic version strings.
 * @returns Guard that accepts semver strings
 * @example
 * ```ts
 * semverOf()('1.0.0') // true
 * ```
 */
export function semverOf(): Guard<string> {
	return (x: unknown): x is string => isSemver(x)
}
/**
 * Guard for JSON-parseable strings.
 * @returns Guard that accepts JSON strings
 * @example
 * ```ts
 * jsonStringOf()('{"key":"value"}') // true
 * ```
 */
export function jsonStringOf(): Guard<string> {
	return (x: unknown): x is string => isJsonString(x)
}
/**
 * Guard for JSON values (recursively valid for JSON.stringify).
 * @returns Guard that accepts JSON values
 * @example
 * ```ts
 * jsonValueOf()({ key: 'value' }) // true
 * ```
 */
export function jsonValueOf(): Guard<unknown> {
	return (x: unknown): x is unknown => isJsonValue(x)
}
/**
 * Guard for HTTP method strings.
 * @returns Guard narrowing to HttpMethod
 * @example
 * ```ts
 * httpMethodOf()('GET') // true
 * ```
 */
export function httpMethodOf(): Guard<HttpMethod> {
	return (x: unknown): x is HttpMethod => isHTTPMethod(x)
}
/**
 * Guard for JavaScript identifier strings.
 * @returns Guard that accepts identifier-like strings
 * @example
 * ```ts
 * identifierOf()('myVar') // true
 * ```
 */
export function identifierOf(): Guard<string> {
	return (x: unknown): x is string => isIdentifier(x)
}
/**
 * Guard for host tokens (hostname, IPv4, bracketed IPv6).
 * @returns Guard that accepts host strings
 * @example
 * ```ts
 * hostOf()('example.com') // true
 * ```
 */
export function hostOf(): Guard<string> {
	return (x: unknown): x is string => isHost(x)
}
/**
 * Guard for ASCII-only strings.
 * @returns Guard that accepts ASCII strings
 * @example
 * ```ts
 * asciiOf()('hello') // true
 * ```
 */
export function asciiOf(): Guard<string> {
	return (x: unknown): x is string => isAscii(x)
}
/**
 * Guard for hex colors (#RGB | #RRGGBB | #RRGGBBAA) with options.
 * @param opts - Options such as allowHash
 * @returns Guard that accepts hex color strings
 * @example
 * ```ts
 * hexColorOf()('FF0000') // true
 * ```
 */
export function hexColorOf(opts?: HexColorOptions): Guard<string> {
	return (x: unknown): x is string => isHexColor(x, opts)
}
/**
 * Guard for IPv4 dotted-decimal strings.
 * @returns Guard that accepts IPv4 strings
 * @example
 * ```ts
 * ipv4StringOf()('192.168.1.1') // true
 * ```
 */
export function ipv4StringOf(): Guard<string> {
	return (x: unknown): x is string => isIPv4String(x)
}
/**
 * Guard for IPv6 strings (subset).
 * @returns Guard that accepts IPv6 strings
 * @example
 * ```ts
 * ipv6StringOf()('::1') // true
 * ```
 */
export function ipv6StringOf(): Guard<string> {
	return (x: unknown): x is string => isIPv6String(x)
}
/**
 * Guard for hostname strings.
 * @returns Guard that accepts hostnames
 * @example
 * ```ts
 * hostnameStringOf()('example.com') // true
 * ```
 */
export function hostnameStringOf(): Guard<string> {
	return (x: unknown): x is string => isHostnameString(x)
}
