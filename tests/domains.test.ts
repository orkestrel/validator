import { describe, test, expect } from 'vitest'
import {
	isUUIDv4,
	isISODateString,
	isISODateTimeString,
	isEmailString,
	isURLString,
	isHttpUrlString,
	isPortNumber,
	isMimeType,
	isSlug,
	isBase64String,
	isHexString,
	isSemver,
	isJsonString,
	isJsonValue,
	isHttpMethod,
	isValidIdent,
	isValidHost,
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

	describe('isISODateString', () => {
		test('returns true for valid ISO dates', () => {
			expect(isISODateString('2024-02-29')).toBe(true)
			expect(isISODateString('2024-01-01')).toBe(true)
		})

		test('returns false for invalid months', () => {
			expect(isISODateString('2024-13-01')).toBe(false)
		})

		test('returns false for invalid days', () => {
			expect(isISODateString('2024-01-32')).toBe(false)
		})

		test('returns false for non-zero-padded dates', () => {
			expect(isISODateString('2024-1-1')).toBe(false)
		})
	})

	describe('isISODateTimeString', () => {
		test('returns true for valid ISO datetime with Z', () => {
			expect(isISODateTimeString('2024-10-12T16:59:32Z')).toBe(true)
		})

		test('returns true for ISO datetime with milliseconds', () => {
			expect(isISODateTimeString('2024-10-12T16:59:32.123Z')).toBe(true)
		})

		test('returns true for ISO datetime with timezone offset', () => {
			expect(isISODateTimeString('2024-10-12T16:59:32+05:30')).toBe(true)
		})

		test('returns false for space-separated datetime', () => {
			expect(isISODateTimeString('2024-10-12 16:59:32Z')).toBe(false)
		})

		test('returns false for non-datetime strings', () => {
			expect(isISODateTimeString('not-time')).toBe(false)
		})
	})

	describe('isEmailString', () => {
		test('returns true for valid email addresses', () => {
			expect(isEmailString('a@b.co')).toBe(true)
			expect(isEmailString('user@example.com')).toBe(true)
		})

		test('returns false for email without TLD', () => {
			expect(isEmailString('a@b')).toBe(false)
		})

		test('returns false for email without local part', () => {
			expect(isEmailString('@b.com')).toBe(false)
		})

		test('returns false for email with spaces', () => {
			expect(isEmailString('a b@c.com')).toBe(false)
		})
	})

	describe('isURLString', () => {
		test('returns true for HTTPS URLs', () => {
			expect(isURLString('https://example.com/x?y=1')).toBe(true)
		})

		test('returns true for FTP URLs', () => {
			expect(isURLString('ftp://example.com')).toBe(true)
		})

		test('returns false for relative paths', () => {
			expect(isURLString('/relative/path')).toBe(false)
		})
	})

	describe('isHttpUrlString', () => {
		test('returns true for HTTPS URLs', () => {
			expect(isHttpUrlString('https://example.com')).toBe(true)
		})

		test('returns true for HTTP URLs', () => {
			expect(isHttpUrlString('http://example.com')).toBe(true)
		})

		test('returns false for non-HTTP protocols', () => {
			expect(isHttpUrlString('ftp://example.com')).toBe(false)
		})
	})

	describe('isPortNumber', () => {
		test('returns true for valid port numbers', () => {
			expect(isPortNumber(1)).toBe(true)
			expect(isPortNumber(65535)).toBe(true)
			expect(isPortNumber(8080)).toBe(true)
		})

		test('returns false for port 0', () => {
			expect(isPortNumber(0)).toBe(false)
		})

		test('returns false for ports above 65535', () => {
			expect(isPortNumber(70000)).toBe(false)
		})

		test('returns false for non-integer ports', () => {
			expect(isPortNumber(3.14)).toBe(false)
		})
	})

	describe('isMimeType', () => {
		test('returns true for valid MIME types', () => {
			expect(isMimeType('text/plain')).toBe(true)
			expect(isMimeType('application/json')).toBe(true)
		})

		test('returns true for vendor MIME types', () => {
			expect(isMimeType('application/vnd.api+json')).toBe(true)
		})

		test('returns false for invalid MIME types', () => {
			expect(isMimeType('not-a-type')).toBe(false)
			expect(isMimeType('/json')).toBe(false)
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

	describe('isBase64String', () => {
		test('returns true for valid base64 strings', () => {
			expect(isBase64String('TWFu')).toBe(true)
			expect(isBase64String('TWE=')).toBe(true)
			expect(isBase64String('TQ==')).toBe(true)
		})

		test('returns true for empty strings', () => {
			expect(isBase64String('')).toBe(true)
		})

		test('returns false for invalid base64', () => {
			expect(isBase64String('@@@')).toBe(false)
		})
	})

	describe('isHexString', () => {
		test('returns true for valid hex strings', () => {
			expect(isHexString('deadBEEF')).toBe(true)
			expect(isHexString('abc')).toBe(true)
		})

		test('returns true for hex with 0x prefix when allowed', () => {
			expect(isHexString('0xdeadbeef', { allow0x: true })).toBe(true)
		})

		test('respects evenLength option', () => {
			expect(isHexString('abc', { evenLength: true })).toBe(false)
			expect(isHexString('abcd', { evenLength: true })).toBe(true)
		})

		test('returns false for non-hex characters', () => {
			expect(isHexString('xyz')).toBe(false)
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

	describe('isHttpMethod', () => {
		test('returns true for valid HTTP methods', () => {
			expect(isHttpMethod('GET')).toBe(true)
			expect(isHttpMethod('POST')).toBe(true)
			expect(isHttpMethod('PATCH')).toBe(true)
		})

		test('returns false for lowercase methods', () => {
			expect(isHttpMethod('get')).toBe(false)
		})
	})

	describe('isValidIdent', () => {
		test('returns true for valid identifiers', () => {
			expect(isValidIdent('name')).toBe(true)
			expect(isValidIdent('myVar')).toBe(true)
		})

		test('returns false for identifiers with spaces', () => {
			expect(isValidIdent('weird key')).toBe(false)
		})
	})

	describe('isValidHost', () => {
		test('returns true for valid hostnames', () => {
			expect(isValidHost('example.com')).toBe(true)
		})

		test('returns true for IPv6 addresses in brackets', () => {
			expect(isValidHost('[::1]')).toBe(true)
			expect(isValidHost('[2001:db8::1]')).toBe(true)
			expect(isValidHost('[::ffff:192.0.2.128]')).toBe(true)
		})

		test('returns false for empty strings', () => {
			expect(isValidHost('')).toBe(false)
		})

		test('returns false for invalid IPv6', () => {
			expect(isValidHost('[:::1]')).toBe(false)
		})

		test('returns false for unbracketed IPv6', () => {
			expect(isValidHost('::1')).toBe(false)
		})
	})
})
