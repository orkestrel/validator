import { test, expect } from 'vitest'
import { isNegativeNumber, intInRange, isMultipleOf } from '../src/numbers.js'

test('isNegativeNumber', () => {
	expect(isNegativeNumber(-1)).toBe(true)
	expect(isNegativeNumber(0)).toBe(false)
})

test('intInRange', () => {
	const g = intInRange(1, 3)
	expect(g(2)).toBe(true)
	expect(g(2.5)).toBe(false)
	expect(g(4)).toBe(false)
})

test('isMultipleOf', () => {
	expect(isMultipleOf(3)(9)).toBe(true)
	expect(isMultipleOf(3)(10)).toBe(false)
})
