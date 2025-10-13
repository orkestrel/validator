import { test, expect } from 'vitest'
import {
	isUUIDv4,
	isISODateString,
	isISODateTimeString,
	isEmail,
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
} from '../src/domains.js'

test('UUID v4', () => {
	expect(isUUIDv4('123e4567-e89b-42d3-a456-426614174000')).toBe(true)
	expect(isUUIDv4('123e4567-e89b-12d3-a456-zzzzzzzzzzzz')).toBe(false)
	expect(isUUIDv4('not-a-uuid')).toBe(false)
})

test('ISO date', () => {
	expect(isISODateString('2024-02-29')).toBe(true)
	expect(isISODateString('2024-13-01')).toBe(false)
	expect(isISODateString('2024-01-32')).toBe(false)
	expect(isISODateString('2024-1-1')).toBe(false)
})

test('ISO datetime (RFC3339 subset)', () => {
	expect(isISODateTimeString('2024-10-12T16:59:32Z')).toBe(true)
	expect(isISODateTimeString('2024-10-12T16:59:32.123Z')).toBe(true)
	expect(isISODateTimeString('2024-10-12T16:59:32+05:30')).toBe(true)
	expect(isISODateTimeString('2024-10-12 16:59:32Z')).toBe(false)
	expect(isISODateTimeString('not-time')).toBe(false)
})

test('Email', () => {
	expect(isEmail('a@b.co')).toBe(true)
	expect(isEmail('a@b')).toBe(false)
	expect(isEmail('@b.com')).toBe(false)
	expect(isEmail('a b@c.com')).toBe(false)
})

test('URL strings', () => {
	expect(isURLString('https://example.com/x?y=1')).toBe(true)
	expect(isURLString('ftp://example.com')).toBe(true)
	expect(isURLString('/relative/path')).toBe(false)
	expect(isHttpUrlString('https://example.com')).toBe(true)
	expect(isHttpUrlString('http://example.com')).toBe(true)
	expect(isHttpUrlString('ftp://example.com')).toBe(false)
})

test('Port numbers', () => {
	expect(isPortNumber(1)).toBe(true)
	expect(isPortNumber(65535)).toBe(true)
	expect(isPortNumber(0)).toBe(false)
	expect(isPortNumber(70000)).toBe(false)
	expect(isPortNumber(3.14)).toBe(false)
})

test('MIME types', () => {
	expect(isMimeType('text/plain')).toBe(true)
	expect(isMimeType('application/json')).toBe(true)
	expect(isMimeType('application/vnd.api+json')).toBe(true)
	expect(isMimeType('not-a-type')).toBe(false)
	expect(isMimeType('/json')).toBe(false)
})

test('Slug', () => {
	expect(isSlug('hello-world')).toBe(true)
	expect(isSlug('Hello-World')).toBe(false)
	expect(isSlug('hello_world')).toBe(false)
	expect(isSlug('')).toBe(false)
})

test('Base64', () => {
	expect(isBase64String('')).toBe(true)
	expect(isBase64String('TWFu')).toBe(true)
	expect(isBase64String('TWE=')).toBe(true)
	expect(isBase64String('TQ==')).toBe(true)
	expect(isBase64String('@@@')).toBe(false)
})

test('Hex', () => {
	expect(isHexString('deadBEEF')).toBe(true)
	expect(isHexString('0xdeadbeef', { allow0x: true })).toBe(true)
	expect(isHexString('abc')).toBe(true)
	expect(isHexString('abc', { evenLength: true })).toBe(false)
	expect(isHexString('xyz')).toBe(false)
})

test('SemVer', () => {
	expect(isSemver('1.2.3')).toBe(true)
	expect(isSemver('1.2.3-alpha.1+build.5')).toBe(true)
	expect(isSemver('01.2.3')).toBe(false)
	expect(isSemver('1.2')).toBe(false)
})

test('JSON strings and values', () => {
	expect(isJsonString('{"a":1}')).toBe(true)
	expect(isJsonString('{a:1}')).toBe(false)
	expect(isJsonValue({ a: [1, 'x', true, null] })).toBe(true)
	expect(isJsonValue({ a: [1, undefined] })).toBe(false)
	expect(isJsonValue({ fn: () => {} })).toBe(false)
})

test('HTTP methods', () => {
	expect(isHttpMethod('GET')).toBe(true)
	expect(isHttpMethod('PATCH')).toBe(true)
	expect(isHttpMethod('get')).toBe(false)
})
