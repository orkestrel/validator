import { test, expect } from 'vitest'
import {
	getTag,
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

test('getTag basics', () => {
	expect(getTag([])).toBe('[object Array]')
	expect(getTag(new Date())).toBe('[object Date]')
})

test('null/undefined/defined', () => {
	expect(isNull(null)).toBe(true)
	expect(isUndefined(undefined)).toBe(true)
	expect(isDefined(0)).toBe(true)
	expect(isDefined(null)).toBe(false)
})

test('strings and numbers', () => {
	expect(isString('a')).toBe(true)
	expect(isNumber(1)).toBe(true)
	expect(isNumber(NaN)).toBe(false)
	expect(isInteger(3)).toBe(true)
	expect(isInteger(3.1)).toBe(false)
	expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true)
	expect(numberInRange(1, 3)(2)).toBe(true)
	expect(isNonNegativeNumber(0)).toBe(true)
	expect(isPositiveNumber(1)).toBe(true)
	expect(isPositiveNumber(0)).toBe(false)
})

test('booleans/bigint/symbol/function', () => {
	expect(isBoolean(false)).toBe(true)
	expect(isBigInt(1n)).toBe(true)
	expect(isSymbol(Symbol('x'))).toBe(true)
	const f = (a: number) => a
	expect(isFunction(f)).toBe(true)
	expect(isZeroArg(() => 1)).toBe(true)
	expect(isZeroArg(((x: number) => x) as (...args: unknown[]) => unknown)).toBe(false)
})

test('async function, objects', () => {
	expect(isAsyncFunction(async () => {})).toBe(true)
	expect(isAsyncFunction(() => Promise.resolve(1))).toBe(false)
	expect(isDate(new Date())).toBe(true)
	expect(isRegExp(/x/)).toBe(true)
	expect(isError(new Error('x'))).toBe(true)
})

test('promise-like', () => {
	const thenable = { then: (r: (v: number) => void) => r(1) }
	expect(isPromiseLike(Promise.resolve(1))).toBe(true)
	expect(isPromiseLike(thenable)).toBe(true)
	expect(isPromiseLike(1)).toBe(false)
})
