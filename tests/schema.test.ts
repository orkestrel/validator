import { describe, test, expect } from 'vitest'
import { isSchema, isPartialSchema, assertSchema, assertPartialSchema } from '../src/schema.js'
import { objectOf, stringMatchOf } from '../src/combinators.js'
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

	describe('isPartialSchema', () => {
		test('allows missing keys', () => {
			const schema = { id: 'string', tag: stringMatchOf(/^[a-z]+$/) } as const
			expect(isPartialSchema({}, schema)).toBe(true)
		})

		test('validates present keys', () => {
			const schema = { id: 'string', tag: stringMatchOf(/^[a-z]+$/) } as const
			expect(isPartialSchema({ id: 'x' }, schema)).toBe(true)
			expect(isPartialSchema({ tag: 'ok' }, schema)).toBe(true)
		})

		test('returns false when present keys fail validation', () => {
			const schema = { id: 'string', tag: stringMatchOf(/^[a-z]+$/) } as const
			expect(isPartialSchema({ tag: 'NotOk' }, schema)).toBe(false)
		})
	})

	describe('assertSchema', () => {
		test('does not throw when schema is valid', () => {
			const schema = { id: 'string', age: 'number' } as const
			expect(() => assertSchema({ id: 'a', age: 1 }, schema)).not.toThrow()
		})

		test('throws TypeError when schema validation fails', () => {
			const schema = { id: 'string', age: 'number' } as const
			expect(() => assertSchema({ id: 'a', age: '1' }, schema)).toThrow(TypeError)
		})

		test('uses custom label in error message', () => {
			const schema = { id: 'string' } as const
			expect(() => assertSchema({}, schema, 'myObj')).toThrow(/myObj/)
		})
	})

	describe('assertPartialSchema', () => {
		test('does not throw when partial schema is valid', () => {
			const schema = { id: 'string', age: 'number' } as const
			expect(() => assertPartialSchema({}, schema)).not.toThrow()
			expect(() => assertPartialSchema({ id: 'a' }, schema)).not.toThrow()
		})

		test('throws TypeError when present keys fail validation', () => {
			const schema = { id: 'string', age: 'number' } as const
			expect(() => assertPartialSchema({ id: 1 }, schema)).toThrow(TypeError)
		})

		test('uses custom label in error message', () => {
			const schema = { id: 'string' } as const
			expect(() => assertPartialSchema({ id: 1 }, schema, 'myObj')).toThrow(/myObj/)
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
