import { describe, test, expect } from 'vitest'
import { functionOf, asyncFunctionOf, generatorFunctionOf, asyncGeneratorFunctionOf, returnsOf, promiseLikeOf } from '../../src/combinators/functions.js'
import { isNumber } from '../../src/primitives.js'

describe('combinators/functions', () => {
	describe('functionOf', () => {
		test('accepts any function', () => {
			const g = functionOf()
			expect(g(() => {})).toBe(true)
			expect(g(function () {})).toBe(true)
			expect(g({} as unknown)).toBe(false)
		})
	})

	describe('asyncFunctionOf', () => {
		test('accepts async functions only', () => {
			const g = asyncFunctionOf()
			expect(g(async () => {})).toBe(true)
			expect(g(() => Promise.resolve())).toBe(false)
			expect(g(function () {}) as unknown).toBe(false)
		})
	})

	describe('generatorFunctionOf', () => {
		test('accepts generator functions only', () => {
			const g = generatorFunctionOf()
			function* gen() {
				yield 1
			}
			expect(g(gen)).toBe(true)
			expect(g(() => {})).toBe(false)
		})
	})

	describe('asyncGeneratorFunctionOf', () => {
		test('accepts async generator functions only', () => {
			const g = asyncGeneratorFunctionOf()
			async function* gen() {
				yield 1
			}
			expect(g(gen)).toBe(true)
			expect(g(async () => {})).toBe(false)
		})
	})

	describe('returnsOf', () => {
		test('validates function return value', () => {
			const g = returnsOf([], isNumber)
			expect(g(() => 42)).toBe(true)
			expect(g(() => 'nope')).toBe(false)
			expect(g('not a function' as unknown)).toBe(false)
		})

		test('rejects thenables', () => {
			const g = returnsOf([], isNumber)
			expect(g(() => Promise.resolve(42))).toBe(false)
		})
	})

	describe('promiseLikeOf', () => {
		test('accepts thenables', () => {
			const g = promiseLikeOf()
			expect(g(Promise.resolve(1))).toBe(true)
			expect(g({ then: () => {} })).toBe(true)
			expect(g({} as unknown)).toBe(false)
		})
	})
})
