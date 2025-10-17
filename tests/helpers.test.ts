import { describe, test, expect } from 'vitest'
import { getTag, parseAbsoluteUrl, parsePort, countEnumerableProperties } from '../src/helpers.js'

describe('helpers', () => {
	describe('getTag', () => {
		test('returns object tag for arrays', () => {
			expect(getTag([])).toBe('[object Array]')
		})

		test('returns object tag for dates', () => {
			expect(getTag(new Date())).toBe('[object Date]')
		})

		test('returns object tag for objects', () => {
			expect(getTag({})).toBe('[object Object]')
		})
	})

	describe('countEnumerableProperties', () => {
		test('counts enumerable string keys', () => {
			expect(countEnumerableProperties({ a: 1, b: 2 })).toBe(2)
			expect(countEnumerableProperties({})).toBe(0)
		})

		test('counts enumerable symbol keys', () => {
			const sym1 = Symbol('s1')
			const sym2 = Symbol('s2')
			const obj: Record<string | symbol, unknown> = { a: 1 }
			Object.defineProperty(obj, sym1, { value: 1, enumerable: true })
			Object.defineProperty(obj, sym2, { value: 2, enumerable: true })
			expect(countEnumerableProperties(obj)).toBe(3)
		})

		test('excludes non-enumerable properties', () => {
			const obj: Record<string | symbol, unknown> = { a: 1 }
			Object.defineProperty(obj, 'b', { value: 2, enumerable: false })
			const sym = Symbol('s')
			Object.defineProperty(obj, sym, { value: 3, enumerable: false })
			expect(countEnumerableProperties(obj)).toBe(1)
		})

		test('counts both string and symbol keys', () => {
			const sym = Symbol('s')
			const obj: Record<string | symbol, unknown> = { a: 1, b: 2 }
			Object.defineProperty(obj, sym, { value: 1, enumerable: true })
			expect(countEnumerableProperties(obj)).toBe(3)
		})
	})

	describe('parseAbsoluteUrl', () => {
		test('parses HTTPS URLs with port', () => {
			const u = parseAbsoluteUrl('https://example.com:8080/path?x#y')
			expect(u).toBeDefined()
			expect(u?.protocol).toBe('https:')
			expect(u?.host).toBe('example.com')
			expect(u?.port).toBe(8080)
		})

		test('parses URLs without explicit port', () => {
			const u = parseAbsoluteUrl('https://example.com/path')
			expect(u).toBeDefined()
			expect(u?.protocol).toBe('https:')
			expect(u?.host).toBe('example.com')
			expect(u?.port).toBeUndefined()
		})

		test('parses IPv6 hosts in brackets', () => {
			const u1 = parseAbsoluteUrl('https://[2001:db8::1]')
			expect(u1).toBeDefined()
			expect(u1?.protocol).toBe('https:')
			expect(u1?.host).toBe('[2001:db8::1]')
			expect(u1?.port).toBeUndefined()
		})

		test('parses IPv6 hosts with port', () => {
			const u2 = parseAbsoluteUrl('https://[2001:db8::1]:443/path')
			expect(u2).toBeDefined()
			expect(u2?.host).toBe('[2001:db8::1]')
			expect(u2?.port).toBe(443)
		})

		test('parses IPv4-mapped IPv6 addresses', () => {
			const u3 = parseAbsoluteUrl('https://[::ffff:192.0.2.128]:80')
			expect(u3).toBeDefined()
			expect(u3?.host).toBe('[::ffff:192.0.2.128]')
			expect(u3?.port).toBe(80)
		})

		test('returns undefined for invalid IPv6', () => {
			expect(parseAbsoluteUrl('https://[:::1]')).toBeUndefined()
		})

		test('returns undefined for unbracketed IPv6', () => {
			expect(parseAbsoluteUrl('https://::1')).toBeUndefined()
		})
	})

	describe('parsePort', () => {
		test('parses valid port numbers', () => {
			expect(parsePort('8080')).toBe(8080)
			expect(parsePort('443')).toBe(443)
			expect(parsePort('1')).toBe(1)
		})

		test('returns undefined for port 0', () => {
			expect(parsePort('0')).toBeUndefined()
		})

		test('returns undefined for non-numeric strings', () => {
			expect(parsePort('abc')).toBeUndefined()
		})

		test('returns undefined for out-of-range ports', () => {
			expect(parsePort('99999')).toBeUndefined()
		})
	})
})
