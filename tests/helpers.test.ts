import { test, expect } from 'vitest'
import { getTag, parseAbsoluteUrl, parsePort } from '../src/helpers.js'

test('getTag basics', () => {
	expect(getTag([])).toBe('[object Array]')
	expect(getTag(new Date())).toBe('[object Date]')
})

test('parseAbsoluteUrl basics', () => {
	const u = parseAbsoluteUrl('https://example.com:8080/path?x#y')
	expect(u).toBeDefined()
	expect(u?.protocol).toBe('https:')
	expect(u?.host).toBe('example.com')
	expect(u?.port).toBe(8080)
})

test('parsePort basics', () => {
	expect(parsePort('8080')).toBe(8080)
	expect(parsePort('0')).toBeUndefined()
	expect(parsePort('abc')).toBeUndefined()
})

test('parseAbsoluteUrl with IPv6 hosts', () => {
	const u1 = parseAbsoluteUrl('https://[2001:db8::1]')
	expect(u1).toBeDefined()
	expect(u1?.protocol).toBe('https:')
	expect(u1?.host).toBe('[2001:db8::1]')
	expect(u1?.port).toBeUndefined()

	const u2 = parseAbsoluteUrl('https://[2001:db8::1]:443/path')
	expect(u2).toBeDefined()
	expect(u2?.host).toBe('[2001:db8::1]')
	expect(u2?.port).toBe(443)

	const u3 = parseAbsoluteUrl('https://[::ffff:192.0.2.128]:80')
	expect(u3).toBeDefined()
	expect(u3?.host).toBe('[::ffff:192.0.2.128]')
	expect(u3?.port).toBe(80)

	// invalid IPv6
	expect(parseAbsoluteUrl('https://[:::1]')).toBeUndefined()
	// unbracketed IPv6 should not be accepted as host
	expect(parseAbsoluteUrl('https://::1')).toBeUndefined()
})
