import { describe, test, expect } from 'vitest'
import {
	isLowercase,
	isUppercase,
	isAlphanumeric,
} from '../src/strings.js'

describe('strings', () => {
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
})
