import type { Guard } from './types.js'
import { isString } from './primitives.js'

/**
 * Create a guard that accepts strings matching the provided regular expression.
 * @param re - Regular expression to test against
 * @returns Guard that checks string values
 * @example
 * // Only lowercase letters
 * const lower = stringMatching(/^[a-z]+$/)
 * lower('abc') // true
 */
export function stringMatching(re: RegExp): Guard<string> {
	return (x: unknown): x is string => isString(x) && re.test(x)
}

/**
 * Create a guard that enforces a minimum string length.
 * @param min - Minimum allowed length
 * @returns Guard that checks min length
 * @example
 * const atLeast2 = stringMinLength(2)
 * atLeast2('a') // false
 */
export function stringMinLength(min: number): Guard<string> {
	return (x: unknown): x is string => isString(x) && x.length >= min
}

/**
 * Create a guard that enforces a maximum string length.
 * @param max - Maximum allowed length
 * @returns Guard that checks max length
 * @example
 * const atMost3 = stringMaxLength(3)
 * atMost3('abcd') // false
 */
export function stringMaxLength(max: number): Guard<string> {
	return (x: unknown): x is string => isString(x) && x.length <= max
}

/**
 * Create a guard for a string whose length is between min and max (inclusive).
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns Guard that checks a length range
 * @example
 * const between = stringLengthBetween(2, 4)
 * between('ab') // true
 */
export function stringLengthBetween(min: number, max: number): Guard<string> {
	return (x: unknown): x is string => isString(x) && x.length >= min && x.length <= max
}

/**
 * Determine whether a string is all lowercase.
 * @param x - Value to test
 * @returns True if lowercase string
 * @example
 * isLowercase('abc') // true
 */
export function isLowercase(x: unknown): x is string {
	return isString(x) && x === x.toLowerCase()
}

/**
 * Determine whether a string is all uppercase.
 * @param x - Value to test
 * @returns True if uppercase string
 * @example
 * isUppercase('ABC') // true
 */
export function isUppercase(x: unknown): x is string {
	return isString(x) && x === x.toUpperCase()
}

/**
 * Determine whether a string contains only alphanumeric characters A-Z, a-z, 0-9.
 * @param x - Value to test
 * @returns True if string is alphanumeric
 * @example
 * isAlphanumeric('A1') // true
 */
export function isAlphanumeric(x: unknown): x is string {
	return isString(x) && /^[A-Za-z0-9]+$/.test(x)
}

/**
 * Determine whether a string contains only ASCII characters (U+0000 through U+007F).
 * Avoids no-control-regex by using charCode checks instead of a regex.
 * @param x - Value to test
 * @returns True if string is ASCII
 * @example
 * isAscii('Hello') // true
 */
export function isAscii(x: unknown): x is string {
	if (!isString(x)) return false
	for (let i = 0; i < x.length; i++) {
		const code = x.charCodeAt(i)
		if (code < 0x00 || code > 0x7f) return false
	}
	return true
}

/**
 * Determine whether a value is a hex color (#RGB | #RRGGBB | #RRGGBBAA).
 * @param x - Value to test
 * @param opts - Options such as allowHash
 * @returns True if a valid hex color
 * @example
 * isHexColor('#fff', \{ allowHash: true \}) // true
 */
export function isHexColor(x: unknown, opts?: Readonly<{ allowHash?: boolean }>): x is string {
	if (!isString(x)) return false
	const s = opts?.allowHash === true && x.startsWith('#') ? x.slice(1) : x
	return /^([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s)
}

/**
 * Determine whether a string is an IPv4 address in dotted-decimal form.
 * @param x - Value to test
 * @returns True if IPv4 string
 * @example
 * isIPv4String('127.0.0.1') // true
 */
export function isIPv4String(x: unknown): x is string {
	if (!isString(x)) return false
	const m = x.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
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
 * Determine whether a hostname string roughly follows RFC 1123 rules.
 * @param x - Value to test
 * @returns True if a plausible hostname
 * @example
 * isHostnameString('example.com') // true
 */
export function isHostnameString(x: unknown): x is string {
	if (!isString(x)) return false
	if (x.length === 0 || x.length > 253) return false
	const labels = x.split('.')
	for (const label of labels) {
		if (label.length < 1 || label.length > 63) return false
		if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)) return false
	}
	return true
}
