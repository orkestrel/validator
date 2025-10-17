import { describe, test, expect } from 'vitest'
import { isSchema } from '../src/schema.js'

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
})
