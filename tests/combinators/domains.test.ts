import { describe, test, expect } from 'vitest'
import { uuidV4Of, isoDateOf, isoDateTimeOf, emailOf, urlOf, portOf, mimeTypeOf, slugOf, base64Of, hexStringOf, semverOf, jsonStringOf, jsonValueOf, httpMethodOf, identifierOf, hostOf, asciiOf, hexColorOf, ipv4StringOf, ipv6StringOf, hostnameStringOf } from '../../src/combinators/domains.js'

describe('combinators/domains', () => {
	describe('uuidV4Of', () => {
		test('validates UUID v4 strings', () => {
			const g = uuidV4Of()
			expect(g('123e4567-e89b-42d3-a456-426614174000')).toBe(true)
			expect(g('not-a-uuid')).toBe(false)
		})
	})

	describe('isoDateOf', () => {
		test('validates ISO date strings', () => {
			const g = isoDateOf()
			expect(g('2024-01-01')).toBe(true)
			expect(g('01/01/2024')).toBe(false)
		})
	})

	describe('isoDateTimeOf', () => {
		test('validates ISO date-time strings', () => {
			const g = isoDateTimeOf()
			expect(g('2024-01-01T12:00:00Z')).toBe(true)
			expect(g('2024-01-01')).toBe(false)
		})
	})

	describe('emailOf', () => {
		test('validates email addresses', () => {
			const g = emailOf()
			expect(g('test@example.com')).toBe(true)
			expect(g('invalid-email')).toBe(false)
		})
	})

	describe('urlOf', () => {
		test('validates URLs', () => {
			const g = urlOf()
			expect(g('https://example.com')).toBe(true)
			expect(g('not a url')).toBe(false)
		})
	})

	describe('portOf', () => {
		test('validates port numbers', () => {
			const g = portOf()
			expect(g(8080)).toBe(true)
			expect(g(80)).toBe(true)
			expect(g(0)).toBe(false)
			expect(g(65536)).toBe(false)
		})
	})

	describe('mimeTypeOf', () => {
		test('validates MIME types', () => {
			const g = mimeTypeOf()
			expect(g('application/json')).toBe(true)
			expect(g('text/html')).toBe(true)
			expect(g('invalid')).toBe(false)
		})
	})

	describe('slugOf', () => {
		test('validates slug strings', () => {
			const g = slugOf()
			expect(g('hello-world')).toBe(true)
			expect(g('Hello World')).toBe(false)
		})
	})

	describe('base64Of', () => {
		test('validates Base64 strings', () => {
			const g = base64Of()
			expect(g('SGVsbG8gV29ybGQ=')).toBe(true)
			expect(g('not base64!')).toBe(false)
		})
	})

	describe('hexStringOf', () => {
		test('validates hex strings', () => {
			const g = hexStringOf()
			expect(g('deadbeef')).toBe(true)
			expect(g('DEADBEEF')).toBe(true)
			expect(g('not-hex')).toBe(false)
		})

		test('validates hex strings with 0x prefix when allowed', () => {
			const g = hexStringOf({ allow0x: true })
			expect(g('0xdeadbeef')).toBe(true)
			expect(g('deadbeef')).toBe(true)
		})
	})

	describe('semverOf', () => {
		test('validates semantic version strings', () => {
			const g = semverOf()
			expect(g('1.0.0')).toBe(true)
			expect(g('1.2.3-alpha')).toBe(true)
			expect(g('1.0')).toBe(false)
		})
	})

	describe('jsonStringOf', () => {
		test('validates JSON strings', () => {
			const g = jsonStringOf()
			expect(g('{"key":"value"}')).toBe(true)
			expect(g('[1,2,3]')).toBe(true)
			expect(g('not json')).toBe(false)
		})
	})

	describe('jsonValueOf', () => {
		test('validates JSON values', () => {
			const g = jsonValueOf()
			expect(g({ key: 'value' })).toBe(true)
			expect(g([1, 2, 3])).toBe(true)
			expect(g('string')).toBe(true)
			expect(g(null)).toBe(true)
			expect(g(undefined)).toBe(false)
		})
	})

	describe('httpMethodOf', () => {
		test('validates HTTP method strings', () => {
			const g = httpMethodOf()
			expect(g('GET')).toBe(true)
			expect(g('POST')).toBe(true)
			expect(g('INVALID')).toBe(false)
		})
	})

	describe('identifierOf', () => {
		test('validates identifier strings', () => {
			const g = identifierOf()
			expect(g('myVar')).toBe(true)
			expect(g('_private')).toBe(true)
			expect(g('123invalid')).toBe(false)
		})
	})

	describe('hostOf', () => {
		test('validates host strings', () => {
			const g = hostOf()
			expect(g('example.com')).toBe(true)
			expect(g('192.168.1.1')).toBe(true)
			expect(g('[::1]')).toBe(true)
		})
	})

	describe('asciiOf', () => {
		test('validates ASCII strings', () => {
			const g = asciiOf()
			expect(g('hello')).toBe(true)
			expect(g('hello\u00A0world')).toBe(false)
		})
	})

	describe('hexColorOf', () => {
		test('validates hex color strings without hash by default', () => {
			const g = hexColorOf()
			expect(g('fff')).toBe(true)
			expect(g('FF0000')).toBe(true)
			expect(g('#FF0000')).toBe(false)
		})

		test('validates hex colors with or without hash when allowHash is true', () => {
			const g = hexColorOf({ allowHash: true })
			expect(g('#FF0000')).toBe(true)
			expect(g('#fff')).toBe(true)
			expect(g('FF0000')).toBe(true)
			expect(g('not-hex')).toBe(false)
		})
	})

	describe('ipv4StringOf', () => {
		test('validates IPv4 strings', () => {
			const g = ipv4StringOf()
			expect(g('192.168.1.1')).toBe(true)
			expect(g('999.999.999.999')).toBe(false)
		})
	})

	describe('ipv6StringOf', () => {
		test('validates IPv6 strings', () => {
			const g = ipv6StringOf()
			expect(g('::1')).toBe(true)
			expect(g('2001:db8::1')).toBe(true)
			expect(g('not-ipv6')).toBe(false)
		})
	})

	describe('hostnameStringOf', () => {
		test('validates hostname strings', () => {
			const g = hostnameStringOf()
			expect(g('example.com')).toBe(true)
			expect(g('sub.example.com')).toBe(true)
			expect(g('localhost')).toBe(true)
		})
	})
})
