import { describe, test, expect } from 'vitest'
import {
	isLowercase,
	isUppercase,
	isAlphanumeric,
	isAscii,
	isHexColor,
	isIPv4String,
	isIPv6String,
	isHostnameString,
} from '../src/strings.js'
import {
	stringMatchOf,
	lengthOf,
	rangeOf,
	minOf,
} from '../src/combinators.js'

describe('strings', () => {
	describe('stringMatching', () => {
		test('returns true when string matches regex', () => {
			expect(stringMatchOf(/^[a-z]+$/)('abc')).toBe(true)
		})

		test('returns false when string does not match regex', () => {
			expect(stringMatchOf(/^\d+$/)('abc')).toBe(false)
		})
	})

	describe('string length via lengthOf (exact)', () => {
		test('returns true when string has exact length', () => {
			expect(lengthOf(2)('ab')).toBe(true)
			expect(lengthOf(3)('abc')).toBe(true)
		})

		test('returns false when string length differs', () => {
			expect(lengthOf(2)('x')).toBe(false)
			expect(lengthOf(2)('abc')).toBe(false)
		})
	})

	describe('string length via rangeOf/minOf', () => {
		test('returns true when string length is within range', () => {
			expect(rangeOf(0, 3)('abc')).toBe(true)
			expect(rangeOf(0, 3)('ab')).toBe(true)
		})

		test('returns false when string is too long', () => {
			expect(rangeOf(0, 3)('xxxx')).toBe(false)
		})

		test('minOf works on string length', () => {
			expect(minOf(2)('ab')).toBe(true)
			expect(minOf(2)('x')).toBe(false)
		})
	})

	describe('isLowercase', () => {
		test('returns true for lowercase strings', () => {
			expect(isLowercase('abc')).toBe(true)
			expect(isLowercase('abc123')).toBe(true)
		})

		test('returns false for strings with uppercase', () => {
			expect(isLowercase('Abc')).toBe(false)
			expect(isLowercase('ABC')).toBe(false)
		})
	})

	describe('isUppercase', () => {
		test('returns true for uppercase strings', () => {
			expect(isUppercase('ABC')).toBe(true)
			expect(isUppercase('ABC123')).toBe(true)
		})

		test('returns false for strings with lowercase', () => {
			expect(isUppercase('Abc')).toBe(false)
			expect(isUppercase('abc')).toBe(false)
		})
	})

	describe('isAlphanumeric', () => {
		test('returns true for alphanumeric strings', () => {
			expect(isAlphanumeric('A1')).toBe(true)
			expect(isAlphanumeric('abc123')).toBe(true)
		})

		test('returns false for strings with special characters', () => {
			expect(isAlphanumeric('a-b')).toBe(false)
		})
	})

	describe('isAscii', () => {
		test('returns true for ASCII strings', () => {
			expect(isAscii('abc123')).toBe(true)
		})

		test('returns false for non-ASCII strings', () => {
			expect(isAscii('\u00A9')).toBe(false)
		})
	})

	describe('isHexColor', () => {
		test('returns true for valid hex colors', () => {
			expect(isHexColor('ffffff')).toBe(true)
			expect(isHexColor('fff')).toBe(true)
		})

		test('returns true for hex colors with hash when allowed', () => {
			expect(isHexColor('#fff', { allowHash: true })).toBe(true)
			expect(isHexColor('#ffffff', { allowHash: true })).toBe(true)
		})

		test('returns false for invalid hex colors', () => {
			expect(isHexColor('ffff')).toBe(false)
			expect(isHexColor('gg')).toBe(false)
		})
	})

	describe('isIPv4String', () => {
		test('returns true for valid IPv4 strings', () => {
			expect(isIPv4String('127.0.0.1')).toBe(true)
			expect(isIPv4String('192.168.1.1')).toBe(true)
		})

		test('returns false for invalid IPv4 strings', () => {
			expect(isIPv4String('256.0.0.1')).toBe(false)
			expect(isIPv4String('abc.def.ghi.jkl')).toBe(false)
		})
	})

	describe('isIPv6String', () => {
		test('returns true for valid IPv6 strings', () => {
			expect(isIPv6String('::1')).toBe(true)
			expect(isIPv6String('2001:db8::1')).toBe(true)
			expect(isIPv6String('::ffff:192.0.2.128')).toBe(true)
		})

		test('returns false for invalid IPv6 strings', () => {
			expect(isIPv6String(':::1')).toBe(false)
			// adjacent extra colon rejection around '::'
			expect(isIPv6String('2001:db8:::1')).toBe(false)
			expect(isIPv6String('2001:db8::1:')).toBe(false)
			expect(isIPv6String(':2001:db8::1')).toBe(false)
			expect(isIPv6String('2001:db8::ff::1')).toBe(false)
		})
	})

	describe('isHostnameString', () => {
		test('returns true for valid hostnames', () => {
			expect(isHostnameString('example.com')).toBe(true)
			expect(isHostnameString('sub.domain.co')).toBe(true)
		})

		test('returns false for invalid hostnames', () => {
			expect(isHostnameString('')).toBe(false)
			expect(isHostnameString('-invalid.com')).toBe(false)
			expect(isHostnameString('toolonglabeltoolonglabeltoolonglabeltoolonglabeltoolonglabeltoolonglabeltoolonglabeltoolonglabel.com')).toBe(false)
		})
	})
})
