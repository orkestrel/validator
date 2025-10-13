import { test, expect } from 'vitest'
import { hasSchema, hasPartialSchema, objectOf } from '../src/schema.js'
import { isString, isNumber } from '../src/primitives.js'
import { stringMatching } from '../src/strings.js'

test('hasSchema nested', () => {
	const schema = { id: 'string', age: 'number', meta: { note: 'string' } } as const
	expect(hasSchema({ id: 'a', age: 1, meta: { note: 'x' } }, schema)).toBe(true)
	expect(hasSchema({ id: 'a', age: '1', meta: { note: 'x' } }, schema)).toBe(false)
})

test('hasPartialSchema allows missing keys but validates present ones', () => {
	const schema = { id: 'string', tag: stringMatching(/^[a-z]+$/) } as const
	expect(hasPartialSchema({}, schema)).toBe(true)
	expect(hasPartialSchema({ id: 'x' }, schema)).toBe(true)
	expect(hasPartialSchema({ tag: 'ok' }, schema)).toBe(true)
	expect(hasPartialSchema({ tag: 'NotOk' }, schema)).toBe(false)
})

test('objectOf optional/exact/rest', () => {
	const User = objectOf({ id: isString, age: isNumber, note: isString }, { optional: ['note'], exact: true } as const)
	expect(User({ id: 'x', age: 1 })).toBe(true)
	expect(User({ id: 'x', age: 1, extra: 1 })).toBe(false)

	const WithRest = objectOf({ id: isString }, { rest: isNumber })
	expect(WithRest({ id: 'x' })).toBe(true)
	expect(WithRest({ id: 'x', a: 1, b: 2 })).toBe(true)
	expect(WithRest({ id: 'x', a: 'nope' as unknown })).toBe(false)
})
