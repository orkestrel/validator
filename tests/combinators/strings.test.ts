import { describe, test, expect } from 'vitest'
import { matchOf, startingWithOf, endingWithOf, containingOf } from '../../src/combinators/strings.js'

describe('combinators/strings', () => {
	describe('matchOf', () => {
		test('validates strings matching regex', () => {
			const g = matchOf(/^[a-z]+$/)
			expect(g('abc')).toBe(true)
			expect(g('ABC')).toBe(false)
			expect(g('123' as unknown)).toBe(false)
		})
	})

	describe('startingWithOf', () => {
		test('validates strings starting with prefix', () => {
			const g = startingWithOf('pre')
			expect(g('prefix')).toBe(true)
			expect(g('suffix')).toBe(false)
			expect(g(123 as unknown)).toBe(false)
		})
	})

	describe('endingWithOf', () => {
		test('validates strings ending with suffix', () => {
			const g = endingWithOf('fix')
			expect(g('prefix')).toBe(true)
			expect(g('suffix')).toBe(true)
			expect(g('suf')).toBe(false)
		})
	})

	describe('containingOf', () => {
		test('validates strings containing substring', () => {
			const g = containingOf('mid')
			expect(g('midway')).toBe(true)
			expect(g('middleware')).toBe(true)
			expect(g('user')).toBe(false)
		})
	})
})
