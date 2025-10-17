import { describe, test, expect } from 'vitest'
import { weakMapOf, weakSetOf } from '../../src/combinators/collections.js'

describe('combinators/collections', () => {
	describe('weakMapOf', () => {
		test('accepts WeakMap instances', () => {
			const g = weakMapOf()
			const wm = new WeakMap()
			expect(g(wm)).toBe(true)
			expect(g(new Map() as unknown)).toBe(false)
			expect(g({} as unknown)).toBe(false)
		})
	})

	describe('weakSetOf', () => {
		test('accepts WeakSet instances', () => {
			const g = weakSetOf()
			const ws = new WeakSet()
			expect(g(ws)).toBe(true)
			expect(g(new Set() as unknown)).toBe(false)
			expect(g([] as unknown)).toBe(false)
		})
	})
})
