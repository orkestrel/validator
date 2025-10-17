import { describe, test, expect } from 'vitest'
import { emptyOf, nonEmptyOf } from '../../src/combinators/emptiness.js'
import { arrayOf } from '../../src/combinators.js'
import { isNumber } from '../../src/primitives.js'

describe('combinators/emptiness', () => {
	describe('emptyOf', () => {
		test('allows empty values', () => {
			const g = emptyOf(arrayOf(isNumber))
			expect(g([])).toBe(true)
			expect(g([1, 2])).toBe(true)
			expect(g(['a'] as unknown)).toBe(false)
		})

		test('allows empty strings', () => {
			const g = emptyOf((x: unknown): x is string => typeof x === 'string')
			expect(g('')).toBe(true)
			expect(g('abc')).toBe(true)
			expect(g(123 as unknown)).toBe(false)
		})
	})

	describe('nonEmptyOf', () => {
		test('rejects empty arrays', () => {
			const g = nonEmptyOf(arrayOf(isNumber))
			expect(g([1])).toBe(true)
			expect(g([])).toBe(false)
		})

		test('rejects empty strings', () => {
			const g = nonEmptyOf((x: unknown): x is string => typeof x === 'string')
			expect(g('abc')).toBe(true)
			expect(g('')).toBe(false)
		})

		test('works with Map and Set', () => {
			const gMap = nonEmptyOf((x: unknown): x is Map<unknown, unknown> => x instanceof Map)
			expect(gMap(new Map([[1, 2]]))).toBe(true)
			expect(gMap(new Map())).toBe(false)

			const gSet = nonEmptyOf((x: unknown): x is Set<unknown> => x instanceof Set)
			expect(gSet(new Set([1]))).toBe(true)
			expect(gSet(new Set())).toBe(false)
		})
	})
})
