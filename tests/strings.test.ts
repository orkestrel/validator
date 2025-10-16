import { test, expect } from 'vitest'
import {
	stringMatching,
	stringMinLength,
	stringMaxLength,
	stringLengthBetween,
	isLowercase,
	isUppercase,
	isAlphanumeric,
	isAscii,
	isHexColor,
	isIPv4String,
	isIPv6String,
	isHostnameString,
} from '../src/strings.js'

test('string length and regex', () => {
	expect(stringMatching(/^[a-z]+$/)('abc')).toBe(true)
	expect(stringMatching(/^\d+$/)('abc')).toBe(false)
	expect(stringMinLength(2)('x')).toBe(false)
	expect(stringMaxLength(3)('xxxx')).toBe(false)
	expect(stringLengthBetween(2, 3)('ab')).toBe(true)
})

test('case and classes', () => {
	expect(isLowercase('abc')).toBe(true)
	expect(isUppercase('ABC')).toBe(true)
	expect(isLowercase('Abc')).toBe(false)
	expect(isAlphanumeric('A1')).toBe(true)
	expect(isAscii('\u00A9')).toBe(false)
})

test('hex colors', () => {
	expect(isHexColor('#fff', { allowHash: true })).toBe(true)
	expect(isHexColor('ffffff')).toBe(true)
	expect(isHexColor('ffff')).toBe(false)
})

test('IPv4', () => {
	expect(isIPv4String('127.0.0.1')).toBe(true)
	expect(isIPv4String('256.0.0.1')).toBe(false)
	expect(isIPv4String('01.2.3.4')).toBe(false)
})

test('hostname', () => {
	expect(isHostnameString('example.com')).toBe(true)
	expect(isHostnameString('-bad.com')).toBe(false)
	expect(isHostnameString('this-label-is-way-too-long-and-exceeds-sixty-three-characters-limit.com')).toBe(false)
})

test('IPv6', () => {
	expect(isIPv6String('::1')).toBe(true)
	expect(isIPv6String('2001:db8::1')).toBe(true)
	expect(isIPv6String('::ffff:192.0.2.128')).toBe(true)
	expect(isIPv6String(':::1')).toBe(false)
	expect(isIPv6String('2001:db8:::1')).toBe(false)
	expect(isIPv6String('fe80::1%eth0')).toBe(false)
})
