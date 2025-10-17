import { describe, test, expect } from 'vitest'
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
} from '../src/domains.js'

describe('domains', () => {
	describe('isUUIDv4', () => {
		test('returns true for valid UUIDv4', () => {
			expect(isUUIDv4('123e4567-e89b-42d3-a456-426614174000')).toBe(true)
		})

		test('returns false for invalid UUID version', () => {
			expect(isUUIDv4('123e4567-e89b-12d3-a456-zzzzzzzzzzzz')).toBe(false)
		})

		test('returns false for non-UUID strings', () => {
			expect(isUUIDv4('not-a-uuid')).toBe(false)
		})
	})

	describe('isISODate', () => {
		test('returns true for valid ISO dates', () => {
			expect(isISODate('2024-02-29')).toBe(true)
			expect(isISODate('2024-01-01')).toBe(true)
		})

		test('returns false for invalid months', () => {
			expect(isISODate('2024-13-01')).toBe(false)
		})

		test('returns false for invalid days', () => {
			expect(isISODate('2024-01-32')).toBe(false)
		})

		test('returns false for non-zero-padded dates', () => {
			expect(isISODate('2024-1-1')).toBe(false)
		})
	})

	describe('isISODateTime', () => {
		test('returns true for valid ISO datetime with Z', () => {
			expect(isISODateTime('2024-10-12T16:59:32Z')).toBe(true)
		})

		test('returns true for ISO datetime with milliseconds', () => {
			expect(isISODateTime('2024-10-12T16:59:32.123Z')).toBe(true)
		})

		test('returns true for ISO datetime with timezone offset', () => {
			expect(isISODateTime('2024-10-12T16:59:32+05:30')).toBe(true)
		})

		test('returns false for space-separated datetime', () => {
			expect(isISODateTime('2024-10-12 16:59:32Z')).toBe(false)
		})

		test('returns false for non-datetime strings', () => {
			expect(isISODateTime('not-time')).toBe(false)
		})
	})

	describe('isEmail', () => {
		test('returns true for valid email addresses', () => {
			expect(isEmail('a@b.co')).toBe(true)
			expect(isEmail('user@example.com')).toBe(true)
		})

		test('returns false for email without TLD', () => {
			expect(isEmail('a@b')).toBe(false)
		})

		test('returns false for email without local part', () => {
			expect(isEmail('@b.com')).toBe(false)
		})

		test('returns false for email with spaces', () => {
			expect(isEmail('a b@c.com')).toBe(false)
		})
	})

	describe('isURL', () => {
		test('returns true for HTTPS URLs', () => {
			expect(isURL('https://example.com/x?y=1')).toBe(true)
		})

		test('returns true for FTP URLs', () => {
			expect(isURL('ftp://example.com')).toBe(true)
		})

		test('returns false for relative paths', () => {
			expect(isURL('/relative/path')).toBe(false)
		})
	})

	describe('isPort', () => {
		test('returns true for valid port numbers', () => {
			expect(isPort(1)).toBe(true)
			expect(isPort(65535)).toBe(true)
			expect(isPort(8080)).toBe(true)
		})

		test('returns false for port 0', () => {
			expect(isPort(0)).toBe(false)
		})

		test('returns false for ports above 65535', () => {
			expect(isPort(70000)).toBe(false)
		})

		test('returns false for non-integer ports', () => {
			expect(isPort(3.14)).toBe(false)
		})
	})

	describe('isMIMEType', () => {
		test('returns true for valid MIME types', () => {
			expect(isMIMEType('text/plain')).toBe(true)
			expect(isMIMEType('application/json')).toBe(true)
		})

		test('returns true for vendor MIME types', () => {
			expect(isMIMEType('application/vnd.api+json')).toBe(true)
		})

		test('returns false for invalid MIME types', () => {
			expect(isMIMEType('not-a-type')).toBe(false)
			expect(isMIMEType('/json')).toBe(false)
		})
	})

	describe('isSlug', () => {
		test('returns true for valid slugs', () => {
			expect(isSlug('hello-world')).toBe(true)
			expect(isSlug('my-slug-123')).toBe(true)
		})

		test('returns false for uppercase slugs', () => {
			expect(isSlug('Hello-World')).toBe(false)
		})

		test('returns false for slugs with underscores', () => {
			expect(isSlug('hello_world')).toBe(false)
		})

		test('returns false for empty strings', () => {
			expect(isSlug('')).toBe(false)
		})
	})

	describe('isBase64', () => {
		test('returns true for valid base64 strings', () => {
			expect(isBase64('TWFu')).toBe(true)
			expect(isBase64('TWE=')).toBe(true)
			expect(isBase64('TQ==')).toBe(true)
		})

		test('returns true for empty strings', () => {
			expect(isBase64('')).toBe(true)
		})

		test('returns false for invalid base64', () => {
			expect(isBase64('@@@')).toBe(false)
		})
	})

	describe('isHex', () => {
		test('returns true for valid hex strings', () => {
			expect(isHex('deadBEEF')).toBe(true)
			expect(isHex('abc')).toBe(true)
		})

		test('returns true for hex with 0x prefix when allowed', () => {
			expect(isHex('0xdeadbeef', { allow0x: true })).toBe(true)
		})

		test('respects evenLength option', () => {
			expect(isHex('abc', { evenLength: true })).toBe(false)
			expect(isHex('abcd', { evenLength: true })).toBe(true)
		})

		test('returns false for non-hex characters', () => {
			expect(isHex('xyz')).toBe(false)
		})
	})

	describe('isSemver', () => {
		test('returns true for valid semver', () => {
			expect(isSemver('1.2.3')).toBe(true)
		})

		test('returns true for semver with prerelease and build', () => {
			expect(isSemver('1.2.3-alpha.1+build.5')).toBe(true)
		})

		test('returns false for leading zeros', () => {
			expect(isSemver('01.2.3')).toBe(false)
		})

		test('returns false for incomplete versions', () => {
			expect(isSemver('1.2')).toBe(false)
		})
	})

	describe('isJsonString', () => {
		test('returns true for valid JSON strings', () => {
			expect(isJsonString('{"a":1}')).toBe(true)
			expect(isJsonString('[1,2,3]')).toBe(true)
		})

		test('returns false for invalid JSON', () => {
			expect(isJsonString('{a:1}')).toBe(false)
		})
	})

	describe('isJsonValue', () => {
		test('returns true for valid JSON values', () => {
			expect(isJsonValue({ a: [1, 'x', true, null] })).toBe(true)
			expect(isJsonValue([1, 2, 3])).toBe(true)
			expect(isJsonValue('string')).toBe(true)
		})

		test('returns false for undefined in arrays', () => {
			expect(isJsonValue({ a: [1, undefined] })).toBe(false)
		})

		test('returns false for functions', () => {
			expect(isJsonValue({ fn: () => {} })).toBe(false)
		})
	})

	describe('isHTTPMethod', () => {
		test('returns true for valid HTTP methods', () => {
			expect(isHTTPMethod('GET')).toBe(true)
			expect(isHTTPMethod('POST')).toBe(true)
			expect(isHTTPMethod('PATCH')).toBe(true)
		})

		test('returns false for lowercase methods', () => {
			expect(isHTTPMethod('get')).toBe(false)
		})
	})

	describe('isIdentifier', () => {
		test('returns true for valid identifiers', () => {
			expect(isIdentifier('name')).toBe(true)
			expect(isIdentifier('myVar')).toBe(true)
		})

		test('returns false for identifiers with spaces', () => {
			expect(isIdentifier('weird key')).toBe(false)
		})
	})

	describe('isHost', () => {
		test('returns true for valid hostnames', () => {
			expect(isHost('example.com')).toBe(true)
		})

		test('returns true for IPv6 addresses in brackets', () => {
			expect(isHost('[::1]')).toBe(true)
			expect(isHost('[2001:db8::1]')).toBe(true)
			expect(isHost('[::ffff:192.0.2.128]')).toBe(true)
		})

		test('returns false for empty strings', () => {
			expect(isHost('')).toBe(false)
		})

		test('returns false for invalid IPv6', () => {
			expect(isHost('[:::1]')).toBe(false)
		})

		test('returns false for unbracketed IPv6', () => {
			expect(isHost('::1')).toBe(false)
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
