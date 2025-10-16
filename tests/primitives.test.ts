import { describe, test, expect } from 'vitest'
import {
	isNull,
	isUndefined,
	isDefined,
	isString,
	isNumber,
	isInteger,
	isSafeInteger,
	numberInRange,
	isNonNegativeNumber,
	isPositiveNumber,
	isBoolean,
	isBigInt,
	isSymbol,
	isFunction,
	isAsyncFunction,
	isZeroArg,
	isDate,
	isRegExp,
	isError,
	isPromiseLike,
} from '../src/primitives.js'

describe('primitives', () => {
	describe('isNull', () => {
		test('returns true for null', () => {
			expect(isNull(null)).toBe(true)
		})

		test('returns false for non-null values', () => {
			expect(isNull(undefined)).toBe(false)
			expect(isNull(0)).toBe(false)
			expect(isNull('')).toBe(false)
		})
	})

	describe('isUndefined', () => {
		test('returns true for undefined', () => {
			expect(isUndefined(undefined)).toBe(true)
		})

		test('returns false for defined values', () => {
			expect(isUndefined(null)).toBe(false)
			expect(isUndefined(0)).toBe(false)
			expect(isUndefined('')).toBe(false)
		})
	})

	describe('isDefined', () => {
		test('returns true for defined values', () => {
			expect(isDefined(0)).toBe(true)
			expect(isDefined('')).toBe(true)
			expect(isDefined(false)).toBe(true)
		})

		test('returns false for null and undefined', () => {
			expect(isDefined(null)).toBe(false)
			expect(isDefined(undefined)).toBe(false)
		})
	})

	describe('isString', () => {
		test('returns true for strings', () => {
			expect(isString('a')).toBe(true)
			expect(isString('')).toBe(true)
		})

		test('returns false for non-strings', () => {
			expect(isString(1)).toBe(false)
			expect(isString(null)).toBe(false)
		})
	})

	describe('isNumber', () => {
		test('returns true for finite numbers', () => {
			expect(isNumber(1)).toBe(true)
			expect(isNumber(0)).toBe(true)
			expect(isNumber(-1)).toBe(true)
			expect(isNumber(3.14)).toBe(true)
		})

		test('returns false for NaN', () => {
			expect(isNumber(NaN)).toBe(false)
		})

		test('returns false for Infinity', () => {
			expect(isNumber(Infinity)).toBe(false)
			expect(isNumber(-Infinity)).toBe(false)
		})

		test('returns false for non-numbers', () => {
			expect(isNumber('1')).toBe(false)
			expect(isNumber(null)).toBe(false)
		})
	})

	describe('isInteger', () => {
		test('returns true for integers', () => {
			expect(isInteger(3)).toBe(true)
			expect(isInteger(0)).toBe(true)
			expect(isInteger(-5)).toBe(true)
		})

		test('returns false for non-integers', () => {
			expect(isInteger(3.1)).toBe(false)
			expect(isInteger(3.9)).toBe(false)
		})
	})

	describe('isSafeInteger', () => {
		test('returns true for safe integers', () => {
			expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
			expect(isSafeInteger(Number.MIN_SAFE_INTEGER)).toBe(true)
			expect(isSafeInteger(0)).toBe(true)
		})

		test('returns false for unsafe integers', () => {
			expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false)
		})
	})

	describe('numberInRange', () => {
		test('returns true for numbers in range', () => {
			expect(numberInRange(1, 3)(2)).toBe(true)
			expect(numberInRange(1, 3)(1)).toBe(true)
			expect(numberInRange(1, 3)(3)).toBe(true)
		})

		test('returns false for numbers outside range', () => {
			expect(numberInRange(1, 3)(0)).toBe(false)
			expect(numberInRange(1, 3)(4)).toBe(false)
		})
	})

	describe('isNonNegativeNumber', () => {
		test('returns true for non-negative numbers', () => {
			expect(isNonNegativeNumber(0)).toBe(true)
			expect(isNonNegativeNumber(1)).toBe(true)
			expect(isNonNegativeNumber(100)).toBe(true)
		})

		test('returns false for negative numbers', () => {
			expect(isNonNegativeNumber(-1)).toBe(false)
		})
	})

	describe('isPositiveNumber', () => {
		test('returns true for positive numbers', () => {
			expect(isPositiveNumber(1)).toBe(true)
			expect(isPositiveNumber(0.1)).toBe(true)
		})

		test('returns false for zero and negative numbers', () => {
			expect(isPositiveNumber(0)).toBe(false)
			expect(isPositiveNumber(-1)).toBe(false)
		})
	})

	describe('isBoolean', () => {
		test('returns true for booleans', () => {
			expect(isBoolean(false)).toBe(true)
			expect(isBoolean(true)).toBe(true)
		})

		test('returns false for non-booleans', () => {
			expect(isBoolean(0)).toBe(false)
			expect(isBoolean(1)).toBe(false)
		})
	})

	describe('isBigInt', () => {
		test('returns true for bigints', () => {
			expect(isBigInt(1n)).toBe(true)
			expect(isBigInt(0n)).toBe(true)
		})

		test('returns false for non-bigints', () => {
			expect(isBigInt(1)).toBe(false)
		})
	})

	describe('isSymbol', () => {
		test('returns true for symbols', () => {
			expect(isSymbol(Symbol('x'))).toBe(true)
			expect(isSymbol(Symbol.for('y'))).toBe(true)
		})

		test('returns false for non-symbols', () => {
			expect(isSymbol('symbol')).toBe(false)
		})
	})

	describe('isFunction', () => {
		test('returns true for functions', () => {
			const f = (a: number) => a
			expect(isFunction(f)).toBe(true)
			expect(isFunction(() => {})).toBe(true)
		})

		test('returns false for non-functions', () => {
			expect(isFunction({})).toBe(false)
		})
	})

	describe('isZeroArg', () => {
		test('returns true for zero-argument functions', () => {
			expect(isZeroArg(() => 1)).toBe(true)
			expect(isZeroArg(function() { return 1 })).toBe(true)
		})

		test('returns false for functions with arguments', () => {
			expect(isZeroArg(((x: number) => x) as (...args: unknown[]) => unknown)).toBe(false)
		})
	})

	describe('isAsyncFunction', () => {
		test('returns true for async functions', () => {
			expect(isAsyncFunction(async () => {})).toBe(true)
		})

		test('returns false for regular functions returning promises', () => {
			expect(isAsyncFunction(() => Promise.resolve(1))).toBe(false)
		})
	})

	describe('isDate', () => {
		test('returns true for Date objects', () => {
			expect(isDate(new Date())).toBe(true)
		})

		test('returns false for non-Date objects', () => {
			expect(isDate(Date.now())).toBe(false)
		})
	})

	describe('isRegExp', () => {
		test('returns true for RegExp objects', () => {
			expect(isRegExp(/x/)).toBe(true)
			expect(isRegExp(new RegExp('x'))).toBe(true)
		})

		test('returns false for non-RegExp objects', () => {
			expect(isRegExp('/x/')).toBe(false)
		})
	})

	describe('isError', () => {
		test('returns true for Error objects', () => {
			expect(isError(new Error('x'))).toBe(true)
			expect(isError(new TypeError('x'))).toBe(true)
		})

		test('returns false for non-Error objects', () => {
			expect(isError({ message: 'x' })).toBe(false)
		})
	})

	describe('isPromiseLike', () => {
		test('returns true for promises', () => {
			expect(isPromiseLike(Promise.resolve(1))).toBe(true)
		})

		test('returns true for thenables', () => {
			const thenable = { then: (r: (v: number) => void) => r(1) }
			expect(isPromiseLike(thenable)).toBe(true)
		})

		test('returns false for non-thenable values', () => {
			expect(isPromiseLike(1)).toBe(false)
			expect(isPromiseLike({})).toBe(false)
		})
	})
})
