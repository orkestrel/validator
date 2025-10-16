import { describe, test, expect } from 'vitest'
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

describe('combinators', () => {
	describe('literalOf', () => {
		test('validates exact literal values', () => {
			const isA = literalOf('a' as const)
			expect(isA('a')).toBe(true)
		})

		test('returns false for non-matching literals', () => {
			const isA = literalOf('a' as const)
			expect(isA('b')).toBe(false)
		})
	})

	describe('and', () => {
		test('returns true when both guards pass', () => {
			const isA = literalOf('a' as const)
			const isString_ = (x: unknown): x is string => typeof x === 'string'
			expect(and(isString_, isA)('a')).toBe(true)
		})

		test('returns false when any guard fails', () => {
			const isA = literalOf('a' as const)
			const isB = literalOf('b' as const)
			expect(and(isA, isB)('a')).toBe(false)
		})
	})

	describe('or', () => {
		test('returns true when any guard passes', () => {
			const isA = literalOf('a' as const)
			const isB = literalOf('b' as const)
			expect(or(isA, isB)('b')).toBe(true)
			expect(or(isA, isB)('a')).toBe(true)
		})

		test('returns false when all guards fail', () => {
			const isA = literalOf('a' as const)
			const isB = literalOf('b' as const)
			expect(or(isA, isB)('c')).toBe(false)
		})
	})

	describe('not', () => {
		test('negates a guard', () => {
			const isA = literalOf('a' as const)
			expect(not(isA)('a')).toBe(false)
			expect(not(isA)('b')).toBe(true)
		})
	})

	describe('isNot', () => {
		test('validates values that fail the guard', () => {
			const isA = literalOf('a' as const)
			expect(isNot(isA)('c')).toBe(true)
			expect(isNot(isA)('a')).toBe(false)
		})
	})

	describe('unionOf', () => {
		test('validates union of guards', () => {
			const isAB = unionOf(literalOf('a' as const), literalOf('b' as const))
			expect(isAB('a')).toBe(true)
			expect(isAB('b')).toBe(true)
		})

		test('returns false for non-union values', () => {
			const isAB = unionOf(literalOf('a' as const), literalOf('b' as const))
			expect(isAB('c' as unknown)).toBe(false)
		})
	})

	describe('intersectionOf', () => {
		test('validates intersection of guards', () => {
			const isNonEmptyString = refine(isString, (s): s is string => s.length > 0)
			const both = intersectionOf(isString as (x: unknown) => x is string, isNonEmptyString)
			expect(both('x')).toBe(true)
		})

		test('returns false when any guard fails', () => {
			const isNonEmptyString = refine(isString, (s): s is string => s.length > 0)
			const both = intersectionOf(isString as (x: unknown) => x is string, isNonEmptyString)
			expect(both('')).toBe(false)
		})
	})

	describe('optionalOf', () => {
		test('allows undefined', () => {
			expect(optionalOf(isString)(undefined)).toBe(true)
		})

		test('validates defined values', () => {
			expect(optionalOf(isString)('hello')).toBe(true)
		})

		test('returns false for wrong types', () => {
			expect(optionalOf(isString)(123)).toBe(false)
		})
	})

	describe('nullableOf', () => {
		test('allows null', () => {
			expect(nullableOf(isString)(null)).toBe(true)
		})

		test('validates non-null values', () => {
			expect(nullableOf(isString)('hello')).toBe(true)
		})

		test('returns false for wrong types', () => {
			expect(nullableOf(isString)(123)).toBe(false)
		})
	})

	describe('lazy', () => {
		test('supports recursive types', () => {
			type Node = { value: number, next?: Node | undefined }
			const isNode: (x: unknown) => x is Node = lazy(() =>
				objectOf({ value: isNumber, next: optionalOf(isNode) }, { optional: ['next' as const], exact: true }),
			)
			expect(isNode({ value: 1 })).toBe(true)
			expect(isNode({ value: 1, next: { value: 2 } })).toBe(true)
		})
	})

	describe('safeParse', () => {
		test('returns ok result for valid values', () => {
			const ok = safeParse('x', isString)
			expect(ok.ok).toBe(true)
			if (ok.ok) {
				expect(ok.value).toBe('x')
			}
		})

		test('returns error result for invalid values', () => {
			const err = safeParse('x', isNumber)
			expect(err.ok).toBe(false)
		})
	})

	describe('discriminatedUnion', () => {
		test('validates discriminated unions', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
			const isShape = discriminatedUnion('kind', { circle: isCircle, rect: isRect } as const)
			expect(isShape({ kind: 'circle', r: 1 })).toBe(true)
			expect(isShape({ kind: 'rect', w: 2, h: 3 })).toBe(true)
		})

		test('returns false for wrong discriminant', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
			const isShape = discriminatedUnion('kind', { circle: isCircle, rect: isRect } as const)
			expect(isShape({ kind: 'triangle' } as unknown)).toBe(false)
		})

		test('returns false for invalid variant data', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
			const isShape = discriminatedUnion('kind', { circle: isCircle, rect: isRect } as const)
			expect(isShape({ kind: 'circle', r: 'x' } as unknown)).toBe(false)
		})
	})

	describe('fromNativeEnum', () => {
		test('validates string enum values', () => {
			enum Color { Red = 'RED', Blue = 'BLUE' }
			const isColor = fromNativeEnum(Color)
			expect(isColor('RED')).toBe(true)
			expect(isColor('BLUE')).toBe(true)
			// reference enum members to avoid unused-member TS warnings
			void Color.Red
			void Color.Blue
		})

		test('returns false for non-enum values', () => {
			enum Color { Red = 'RED', Blue = 'BLUE' }
			const isColor = fromNativeEnum(Color)
			expect(isColor('GREEN' as unknown)).toBe(false)
			void Color.Red
			void Color.Blue
		})

		test('validates numeric enum values', () => {
			enum Num { A, B, C }
			const isNum = fromNativeEnum(Num)
			expect(isNum(0)).toBe(true)
			expect(isNum(1)).toBe(true)
			expect(isNum(2)).toBe(true)
			void Num.A
			void Num.B
			void Num.C
		})

		test('returns false for out-of-range numeric values', () => {
			enum Num { A, B, C }
			const isNum = fromNativeEnum(Num)
			expect(isNum(3 as unknown)).toBe(false)
			void Num.A
			void Num.B
			void Num.C
		})
	})
})
