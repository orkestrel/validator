import { describe, test, expect } from 'vitest'
import { isSchema } from '../src/schema.js'
import { objectOf } from '../src/combinators.js'
import { isString, isNumber } from '../src/primitives.js'

describe('schema', () => {
	describe('isSchema', () => {
		test('validates nested schemas', () => {
			const schema = { id: 'string', age: 'number', meta: { note: 'string' } } as const
			expect(isSchema({ id: 'a', age: 1, meta: { note: 'x' } }, schema)).toBe(true)
		})

		test('returns false when schema validation fails', () => {
			const schema = { id: 'string', age: 'number', meta: { note: 'string' } } as const
			expect(isSchema({ id: 'a', age: '1', meta: { note: 'x' } }, schema)).toBe(false)
		})
	})

	describe('objectOf', () => {
		test('validates objects with optional fields', () => {
			const User = objectOf({ id: isString, age: isNumber, note: isString }, { optional: ['note' as const], exact: true })
			expect(User({ id: 'x', age: 1 })).toBe(true)
			expect(User({ id: 'x', age: 1, note: 'hello' })).toBe(true)
		})

		test('enforces exact option to reject extra fields', () => {
			const User = objectOf({ id: isString, age: isNumber, note: isString }, { optional: ['note' as const], exact: true })
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
