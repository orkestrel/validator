import { describe, test, expect } from 'vitest'
import { hasSchema, hasPartialSchema, objectOf } from '../src/schema.js'
import { isString, isNumber } from '../src/primitives.js'
import { stringMatching } from '../src/strings.js'

describe('schema', () => {
	describe('hasSchema', () => {
		test('validates nested schemas', () => {
			const schema = { id: 'string', age: 'number', meta: { note: 'string' } } as const
			expect(hasSchema({ id: 'a', age: 1, meta: { note: 'x' } }, schema)).toBe(true)
		})

		test('returns false when schema validation fails', () => {
			const schema = { id: 'string', age: 'number', meta: { note: 'string' } } as const
			expect(hasSchema({ id: 'a', age: '1', meta: { note: 'x' } }, schema)).toBe(false)
		})
	})

	describe('hasPartialSchema', () => {
		test('allows missing keys', () => {
			const schema = { id: 'string', tag: stringMatching(/^[a-z]+$/) } as const
			expect(hasPartialSchema({}, schema)).toBe(true)
		})

		test('validates present keys', () => {
			const schema = { id: 'string', tag: stringMatching(/^[a-z]+$/) } as const
			expect(hasPartialSchema({ id: 'x' }, schema)).toBe(true)
			expect(hasPartialSchema({ tag: 'ok' }, schema)).toBe(true)
		})

		test('returns false when present keys fail validation', () => {
			const schema = { id: 'string', tag: stringMatching(/^[a-z]+$/) } as const
			expect(hasPartialSchema({ tag: 'NotOk' }, schema)).toBe(false)
		})
	})

	describe('objectOf', () => {
		test('validates objects with optional fields', () => {
			const User = objectOf({ id: isString, age: isNumber, note: isString }, { optional: ['note'], exact: true } as const)
			expect(User({ id: 'x', age: 1 })).toBe(true)
			expect(User({ id: 'x', age: 1, note: 'hello' })).toBe(true)
		})

		test('enforces exact option to reject extra fields', () => {
			const User = objectOf({ id: isString, age: isNumber, note: isString }, { optional: ['note'], exact: true } as const)
			expect(User({ id: 'x', age: 1, extra: 1 })).toBe(false)
		})

		test('validates rest fields with rest option', () => {
			const WithRest = objectOf({ id: isString }, { rest: isNumber })
			expect(WithRest({ id: 'x' })).toBe(true)
			expect(WithRest({ id: 'x', a: 1, b: 2 })).toBe(true)
		})

		test('returns false when rest fields fail validation', () => {
			const WithRest = objectOf({ id: isString }, { rest: isNumber })
			expect(WithRest({ id: 'x', a: 'nope' as unknown })).toBe(false)
		})
	})
})
