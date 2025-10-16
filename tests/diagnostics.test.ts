import { describe, test, expect } from 'vitest'
import { pathToString, extendPath, createTypeError } from '../src/diagnostics.js'

describe('diagnostics', () => {
	describe('pathToString', () => {
		test('converts paths to dot notation', () => {
			expect(pathToString(['meta', 'tags', 1, 'id'])).toBe('meta.tags[1].id')
		})

		test('returns empty string for empty path', () => {
			expect(pathToString([])).toBe('')
		})

		test('handles special keys with bracket notation', () => {
			expect(pathToString(['weird key', 0])).toBe('["weird key"][0]')
		})
	})

	describe('extendPath', () => {
		test('extends path without mutating original', () => {
			const p1 = ['a'] as const
			const p2 = extendPath(p1, 'b')
			expect(p1).toEqual(['a'])
			expect(p2).toEqual(['a', 'b'])
		})

		test('extends empty path', () => {
			const p1 = [] as const
			const p2 = extendPath(p1, 'key')
			expect(p2).toEqual(['key'])
		})
	})

	describe('createTypeError', () => {
		test('creates LLM-friendly error messages', () => {
			const err = createTypeError('string', 42, {
				path: ['payload', 'name'],
				label: 'User.name',
				hint: 'Ensure input is a string',
				helpUrl: 'https://example.com/help#name',
			})
			expect(err.message).toMatch(/expected string/i)
			expect(err.message).toMatch(/payload\.name/)
			expect(err.message).toMatch(/received.type=number/)
			expect(err.message).toContain('tag=[object Number]')
		})

		test('includes structured metadata', () => {
			const err = createTypeError('string', 42, {
				path: ['payload', 'name'],
				label: 'User.name',
				hint: 'Ensure input is a string',
				helpUrl: 'https://example.com/help#name',
			})
			const meta = err as unknown as {
				expected: string
				path: readonly (string | number)[]
				label?: string
				receivedType: string
				receivedTag: string
				receivedPreview: string
				hint?: string
				helpUrl?: string
			}
			expect(meta.expected).toBe('string')
			expect(meta.path).toEqual(['payload', 'name'])
			expect(meta.label).toBe('User.name')
			expect(meta.receivedType).toBe('number')
			expect(meta.receivedTag.startsWith('[object ')).toBe(true)
			expect(meta.hint).toBe('Ensure input is a string')
			expect(meta.helpUrl).toBe('https://example.com/help#name')
		})
	})
})
