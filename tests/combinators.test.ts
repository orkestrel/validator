import { test, expect } from 'vitest'
import {
	literalOf,
	and,
	or,
	not,
	isNot,
	unionOf,
	intersectionOf,
	optionalOf,
	nullableOf,
	lazy,
	refine,
	discriminatedUnion,
	fromNativeEnum,
	safeParse,
} from '../src/combinators.js'
import { isString, isNumber } from '../src/primitives.js'
import { objectOf } from '../src/schema.js'

test('literalOf/and/or/not/isNot', () => {
	const isA = literalOf('a' as const)
	const isB = literalOf('b' as const)
	expect(and(isA, isB)('a')).toBe(false)
	expect(or(isA, isB)('b')).toBe(true)
	expect(not(isA)('a')).toBe(false)
	expect(isNot(isA)('c')).toBe(true)
})

test('unionOf/intersectionOf', () => {
	const isAB = unionOf(literalOf('a' as const), literalOf('b' as const))
	expect(isAB('a')).toBe(true)
	expect(isAB('c' as unknown)).toBe(false)

	const isNonEmptyString = refine(isString, (s): s is string => s.length > 0)
	const both = intersectionOf(isString as (x: unknown) => x is string, isNonEmptyString)
	expect(both('x')).toBe(true)
	expect(both('')).toBe(false)
})

test('optionalOf/nullableOf', () => {
	expect(optionalOf(isString)(undefined)).toBe(true)
	expect(nullableOf(isString)(null)).toBe(true)
})

test('lazy recursive with objectOf', () => {
	type Node = { value: number, next?: Node | undefined }
	const isNode: (x: unknown) => x is Node = lazy(() =>
		objectOf({ value: isNumber, next: optionalOf(isNode) }, { optional: ['next' as const], exact: true }),
	)
	expect(isNode({ value: 1 })).toBe(true)
	expect(isNode({ value: 1, next: { value: 2 } })).toBe(true)
})

test('safeParse', () => {
	const ok = safeParse('x', isString)
	expect(ok.ok).toBe(true)
	const err = safeParse('x', isNumber)
	expect(err.ok).toBe(false)
})

test('discriminatedUnion and fromNativeEnum', () => {
	const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
	const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
	const isShape = discriminatedUnion('kind', { circle: isCircle, rect: isRect } as const)
	expect(isShape({ kind: 'circle', r: 1 })).toBe(true)
	expect(isShape({ kind: 'rect', w: 2, h: 3 })).toBe(true)
	expect(isShape({ kind: 'circle', r: 'x' } as unknown)).toBe(false)
	expect(isShape({ kind: 'triangle' } as unknown)).toBe(false)

	enum Color { Red = 'RED', Blue = 'BLUE' }
	enum Num { A, B, C }
	const isColor = fromNativeEnum(Color)
	const isNum = fromNativeEnum(Num)
	expect(isColor('RED')).toBe(true)
	expect(isColor('GREEN' as unknown)).toBe(false)
	expect(isNum(0)).toBe(true)
	expect(isNum(3 as unknown)).toBe(false)

	// reference enum members to avoid unused-member TS warnings
	void Color.Red
	void Color.Blue
	void Num.A
	void Num.B
	void Num.C
})
