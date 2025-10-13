import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hasSchema, hasPartialSchema, objectOf } from '../src/schema.js'
import { isString, isNumber } from '../src/primitives.js'
import { stringMatching } from '../src/strings.js'

test('hasSchema nested', () => {
  const schema = { id: 'string', age: 'number', meta: { note: 'string' } } as const
  assert.equal(hasSchema({ id: 'a', age: 1, meta: { note: 'x' } }, schema), true)
  assert.equal(hasSchema({ id: 'a', age: '1', meta: { note: 'x' } }, schema), false)
})

test('hasPartialSchema allows missing keys but validates present ones', () => {
  const schema = { id: 'string', tag: stringMatching(/^[a-z]+$/) } as const
  assert.equal(hasPartialSchema({}, schema), true)
  assert.equal(hasPartialSchema({ id: 'x' }, schema), true)
  assert.equal(hasPartialSchema({ tag: 'ok' }, schema), true)
  assert.equal(hasPartialSchema({ tag: 'NotOk' }, schema), false)
})

test('objectOf optional/exact/rest', () => {
  const User = objectOf({ id: isString, age: isNumber, note: isString }, { optional: ['note'], exact: true } as const)
  assert.equal(User({ id: 'x', age: 1 }), true)
  assert.equal(User({ id: 'x', age: 1, extra: 1 }), false)

  const WithRest = objectOf({ id: isString }, { rest: isNumber })
  assert.equal(WithRest({ id: 'x' }), true)
  assert.equal(WithRest({ id: 'x', a: 1, b: 2 }), true)
  assert.equal(WithRest({ id: 'x', a: 'nope' as unknown }), false)
})
