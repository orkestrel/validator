import { describe, test, expect } from 'vitest'
import {
	isNull,
	isUndefined,
	isDefined,
	isString,
	isNumber,
	isBoolean,
	isBigInt,
	isSymbol,
	isFunction,
	isDate,
	isRegExp,
	isError,
	isIterable,
	isAsyncIterator,
	isPromise,
	isPromiseLike,
	isArrayBuffer,
	isSharedArrayBuffer,
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
		test('returns true for numbers (typeof)', () => {
			expect(isNumber(1)).toBe(true)
			expect(isNumber(0)).toBe(true)
			expect(isNumber(-1)).toBe(true)
			expect(isNumber(3.14)).toBe(true)
			expect(isNumber(NaN)).toBe(true)
			expect(isNumber(Infinity)).toBe(true)
			expect(isNumber(-Infinity)).toBe(true)
		})

		test('returns false for non-numbers', () => {
			expect(isNumber('1')).toBe(false)
			expect(isNumber(null)).toBe(false)
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

	describe('isDate', () => {
		test('returns true for Date objects', () => {
			expect(isDate(new Date())).toBe(true)
		})

		test('returns false for non-Date objects', () => {
			expect(isDate({})).toBe(false)
		})
	})

	describe('isRegExp', () => {
		test('returns true for RegExp objects', () => {
			expect(isRegExp(/a/)).toBe(true)
		})

		test('returns false for non-RegExp objects', () => {
			expect(isRegExp({})).toBe(false)
		})
	})

	describe('isError', () => {
		test('returns true for Error instances', () => {
			expect(isError(new Error('e'))).toBe(true)
		})

		test('returns false for non-Error values', () => {
			expect(isError({})).toBe(false)
		})
	})

	describe('isIterable', () => {
		test('returns true for arrays', () => {
			expect(isIterable([1, 2, 3])).toBe(true)
		})

		test('returns true for strings', () => {
			expect(isIterable('abc')).toBe(true)
		})

		test('returns true for Sets', () => {
			expect(isIterable(new Set([1, 2]))).toBe(true)
		})

		test('returns false for non-iterables', () => {
			expect(isIterable(123)).toBe(false)
			expect(isIterable({})).toBe(false)
		})
	})

	describe('isAsyncIterator', () => {
		test('returns true for async generators', () => {
			async function* agen() {
				yield 1
			}
			expect(isAsyncIterator(agen())).toBe(true)
		})
		test('returns false for non-async-iterables', () => {
			function* gen() {
				yield 1
			}
			expect(isAsyncIterator(gen())).toBe(false)
			expect(isAsyncIterator([1, 2, 3])).toBe(false)
		})
	})

	describe('isPromise', () => {
		test('returns true for native Promise instances', () => {
			expect(isPromise(Promise.resolve(1))).toBe(true)
		})
		test('returns false for thenables and non-promises', () => {
			const thenable = { then() { /* noop */ } }
			expect(isPromise(thenable as unknown)).toBe(false)
			expect(isPromise({} as unknown)).toBe(false)
		})
	})

	describe('isPromiseLike', () => {
		test('returns true for native Promise instances', () => {
			expect(isPromiseLike(Promise.resolve(1))).toBe(true)
		})
		test('returns true for objects with then/catch/finally', () => {
			const obj = {
				then() { /* noop */ },
				catch() { /* noop */ },
				finally() { /* noop */ },
			}
			expect(isPromiseLike(obj)).toBe(true)
		})
		test('returns false when missing catch or finally', () => {
			expect(isPromiseLike({ then() { /* noop */ } } as unknown)).toBe(false)
			expect(isPromiseLike({ then() { /* noop */ }, catch() { /* noop */ } } as unknown)).toBe(false)
		})
	})

	describe('isArrayBuffer', () => {
		test('returns true for ArrayBuffer', () => {
			expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true)
		})
		test('returns false for non-ArrayBuffer', () => {
			expect(isArrayBuffer({})).toBe(false)
			expect(isArrayBuffer(new Uint8Array(4) as unknown)).toBe(false)
		})
	})

	describe('isSharedArrayBuffer', () => {
		test('matches only when supported and instance is provided', () => {
			const hasSAB = typeof SharedArrayBuffer !== 'undefined'
			const value = hasSAB ? new SharedArrayBuffer(8) : (undefined as unknown)
			expect(isSharedArrayBuffer(value)).toBe(hasSAB)
		})
	})
})
