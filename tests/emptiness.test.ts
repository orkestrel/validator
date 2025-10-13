import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  isEmpty,
  isEmptyArray,
  isEmptyMap,
  isEmptyObject,
  isEmptySet,
  isEmptyString,
  isNonEmptyArray,
  isNonEmptyMap,
  isNonEmptyObject,
  isNonEmptySet,
  isNonEmptyString,
} from '../src/emptiness.js'
import {
  assertEmpty,
  assertEmptyArray,
  assertEmptyMap,
  assertEmptyObject,
  assertEmptySet,
  assertEmptyString,
} from '../src/assert.js'

test('isEmpty generic and specific checks', () => {
  assert.equal(isEmpty(''), true)
  assert.equal(isEmpty([]), true)
  assert.equal(isEmpty(new Set()), true)
  assert.equal(isEmpty(new Map()), true)
  assert.equal(isEmpty({}), true)
  assert.equal(isEmpty(['x']), false)
})

test('specific emptiness guards', () => {
  assert.equal(isEmptyString(''), true)
  assert.equal(isEmptyArray([]), true)
  assert.equal(isEmptySet(new Set()), true)
  assert.equal(isEmptyMap(new Map()), true)
  assert.equal(isEmptyObject({}), true)

  assert.equal(isNonEmptyString('a'), true)
  assert.equal(isNonEmptyArray([1]), true)
  assert.equal(isNonEmptySet(new Set([1])), true)
  assert.equal(isNonEmptyMap(new Map([[1, 2]])), true)
  assert.equal(isNonEmptyObject({ a: 1 }), true)
})

test('emptiness assertions', () => {
  assert.doesNotThrow(() => assertEmpty(''))
  assert.doesNotThrow(() => assertEmptyArray([]))
  assert.doesNotThrow(() => assertEmptySet(new Set()))
  assert.doesNotThrow(() => assertEmptyMap(new Map()))
  assert.doesNotThrow(() => assertEmptyObject({}))
  assert.doesNotThrow(() => assertEmptyString(''))

  try {
    assertEmpty(['x'], { path: ['root', 'arr'] })
    assert.fail('should throw')
  } catch (e) {
    const err = e as Error
    assert.match(err.message, /empty value/i)
    assert.match(err.message, /root\.arr/)
  }
})
