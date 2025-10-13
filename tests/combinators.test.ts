import { test } from 'node:test'
import assert from 'node:assert/strict'
import { literalOf, and, or, not, isNot, unionOf, intersectionOf, optionalOf, nullableOf, lazy, refine, safeParse, discriminatedUnion, fromNativeEnum } from '../src/combinators.js'
import { isString, isNumber } from '../src/primitives.js'
import { objectOf } from '../src/schema.js'

test('literalOf/and/or/not/isNot', () => {
  const isA = literalOf('a' as const)
  const isB = literalOf('b' as const)
  assert.equal(and(isA, isB)('a'), false)
  assert.equal(or(isA, isB)('b'), true)
  assert.equal(not(isA)('a'), false)
  assert.equal(isNot(isA)('c'), true)
})

test('unionOf/intersectionOf', () => {
  const isAB = unionOf(literalOf('a' as const), literalOf('b' as const))
  assert.equal(isAB('a'), true)
  assert.equal(isAB('c' as unknown), false)

  const isNonEmptyString = refine(isString, (s): s is string => s.length > 0)
  const both = intersectionOf(isString as (x: unknown) => x is string, isNonEmptyString)
  assert.equal(both('x'), true)
  assert.equal(both(''), false)
})

test('optionalOf/nullableOf', () => {
  assert.equal(optionalOf(isString)(undefined), true)
  assert.equal(nullableOf(isString)(null), true)
})

test('lazy recursive with objectOf', () => {
  type Node = { value: number; next?: Node | undefined }
  const isNode: (x: unknown) => x is Node = lazy(() =>
    objectOf({ value: isNumber, next: optionalOf(isNode) }, { optional: ['next' as const], exact: true }),
  )
  assert.equal(isNode({ value: 1 }), true)
  assert.equal(isNode({ value: 1, next: { value: 2 } }), true)
})

test('safeParse', () => {
  const ok = safeParse('x', isString)
  assert.equal(ok.ok, true)
  const err = safeParse('x', isNumber)
  assert.equal(err.ok, false)
})

test('discriminatedUnion and fromNativeEnum', () => {
  const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
  const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
  const isShape = discriminatedUnion('kind', { circle: isCircle, rect: isRect } as const)
  assert.equal(isShape({ kind: 'circle', r: 1 }), true)
  assert.equal(isShape({ kind: 'rect', w: 2, h: 3 }), true)
  assert.equal(isShape({ kind: 'circle', r: 'x' } as unknown), false)
  assert.equal(isShape({ kind: 'triangle' } as unknown), false)

  enum Color { Red = 'RED', Blue = 'BLUE' }
  enum Num { A, B, C }
  const isColor = fromNativeEnum(Color)
  const isNum = fromNativeEnum(Num)
  assert.equal(isColor('RED'), true)
  assert.equal(isColor('GREEN' as unknown), false)
  assert.equal(isNum(0), true)
  assert.equal(isNum(3 as unknown), false)
})
