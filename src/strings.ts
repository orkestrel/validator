import type { Guard, HexColorOptions } from './types.js'
import { isString } from './primitives.js'

/**
 * Create a guard that accepts strings matching the provided regular expression.
 *
 * @param re - Regular expression to test against
 * @returns Guard that checks string values
 * @example
 * ```ts
 * // Only lowercase letters
 * const lower = stringMatching(/^[a-z]+$/)
 * lower('abc') // true
 * ```
 */
export function stringMatching(re: RegExp): Guard<string> {
	return (x: unknown): x is string => isString(x) && re.test(x)
}

/**
 * Create a guard that enforces a minimum string length.
 *
 * @param min - Minimum allowed length
 * @returns Guard that checks min length
 * @example
 * ```ts
 * const atLeast2 = stringMinLength(2)
 * atLeast2('a') // false
 * ```
 */
export function stringMinLength(min: number): Guard<string> {
	return (x: unknown): x is string => isString(x) && x.length >= min
}

/**
 * Create a guard that enforces a maximum string length.
 *
 * @param max - Maximum allowed length
 * @returns Guard that checks max length
 * @example
 * ```ts
 * const atMost3 = stringMaxLength(3)
 * atMost3('abcd') // false
 * ```
 */
export function stringMaxLength(max: number): Guard<string> {
	return (x: unknown): x is string => isString(x) && x.length <= max
}

/**
 * Create a guard for a string whose length is between min and max (inclusive).
 *
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns Guard that checks a length range
 * @example
 * ```ts
 * const between = stringLengthBetween(2, 4)
 * between('ab') // true
 * ```
 */
export function stringLengthBetween(min: number, max: number): Guard<string> {
	return (x: unknown): x is string => isString(x) && x.length >= min && x.length <= max
}

/**
 * Determine whether a string is all lowercase.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isLowercase('abc') // true
 * ```
 */
export function isLowercase(s: string): boolean
export function isLowercase(s: unknown): s is string
export function isLowercase(s: unknown): boolean {
	return typeof s === 'string' && s === s.toLowerCase()
}

/**
 * Determine whether a string is all uppercase.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isUppercase('ABC') // true
 * ```
 */
export function isUppercase(s: string): boolean
export function isUppercase(s: unknown): s is string
export function isUppercase(s: unknown): boolean {
	return typeof s === 'string' && s === s.toUpperCase()
}

/**
 * Determine whether a string contains only alphanumeric characters A-Z, a-z, 0-9.
 *
 * Overloads:
 * - When called with `string`, returns `boolean` (no type narrowing).
 * - When called with `unknown`, returns a type predicate narrowing to `string`.
 *
 * @example
 * ```ts
 * isAlphanumeric('A1') // true
 * ```
 */
export function isAlphanumeric(s: string): boolean
export function isAlphanumeric(s: unknown): s is string
export function isAlphanumeric(s: unknown): boolean {
	return typeof s === 'string' && /^[A-Za-z0-9]+$/.test(s)
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
