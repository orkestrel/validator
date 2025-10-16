import { describe, test, expect } from 'vitest'
import {
	literalOf,
	andOf,
	orOf,
	notOf,
	unionOf,
	intersectionOf,
	optionalOf,
	nullableOf,
	lazyOf,
	refineOf,
	discriminatedUnionOf,
	enumOf,
	safeParse,
	objectOf,
	arrayOf,
	tupleOf,
	stringMatchOf,
	mapOf,
	setOf,
	keyOf,
	recordOf,
	iterableOf,
	nonEmptyOf,
	emptyOf,
	// Unified comparators
	minOf,
	maxOf,
	rangeOf,
	lengthOf,
	sizeOf,
	countOf,
	multipleOf,
	measureOf,
	stringOf,
	numberOf,
} from '../src/combinators.js'
import { isString, isNumber } from '../src/primitives.js'

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

	describe('andOf', () => {
		test('returns true when both guards pass', () => {
			const isA = literalOf('a' as const)
			const isString_ = (x: unknown): x is string => typeof x === 'string'
			expect(andOf(isString_, isA)('a')).toBe(true)
		})

		test('returns false when any guard fails', () => {
			const isA = literalOf('a' as const)
			const isB = literalOf('b' as const)
			expect(andOf(isA, isB)('a')).toBe(false)
		})
	})

	describe('orOf', () => {
		test('returns true when any guard passes', () => {
			const isA = literalOf('a' as const)
			const isB = literalOf('b' as const)
			expect(orOf(isA, isB)('b')).toBe(true)
			expect(orOf(isA, isB)('a')).toBe(true)
		})

		test('returns false when all guards fail', () => {
			const isA = literalOf('a' as const)
			const isB = literalOf('b' as const)
			expect(orOf(isA, isB)('c')).toBe(false)
		})
	})

	describe('notOf', () => {
		test('negates a guard', () => {
			const isA = literalOf('a' as const)
			expect(notOf(isA)('a')).toBe(false)
			expect(notOf(isA)('b')).toBe(true)
		})

		test('typed exclusion with base and exclude', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
			const isShape = unionOf(isCircle, isRect)
			const notCircle = notOf(isShape, isCircle)

			// Accepts rectangles, rejects circles and non-shapes
			expect(notCircle({ kind: 'rect', w: 2, h: 3 })).toBe(true)
			expect(notCircle({ kind: 'circle', r: 1 })).toBe(false)
			expect(notCircle({} as unknown)).toBe(false)
		})

		test('typed exclusion on primitives union', () => {
			const isStringOrNumber = orOf(isString, isNumber)
			const notString = notOf(isStringOrNumber, isString)
			expect(notString(123)).toBe(true)
			expect(notString('x')).toBe(false)
			expect(notString(true as unknown)).toBe(false)
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
			const isNonEmptyString = refineOf(isString, (s): s is string => s.length > 0)
			const both = intersectionOf(isString as (x: unknown) => x is string, isNonEmptyString)
			expect(both('x')).toBe(true)
		})

		test('returns false when any guard fails', () => {
			const isNonEmptyString = refineOf(isString, (s): s is string => s.length > 0)
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

	describe('lazyOf', () => {
		test('supports recursive types', () => {
			type Node = { value: number, next?: Node | undefined }
			const isNode: (x: unknown) => x is Node = lazyOf(() =>
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

	describe('discriminatedUnionOf', () => {
		test('validates discriminated unions', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
			const isShape = discriminatedUnionOf('kind', { circle: isCircle, rect: isRect } as const)
			expect(isShape({ kind: 'circle', r: 1 })).toBe(true)
			expect(isShape({ kind: 'rect', w: 2, h: 3 })).toBe(true)
		})

		test('returns false for wrong discriminant', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
			const isShape = discriminatedUnionOf('kind', { circle: isCircle, rect: isRect } as const)
			expect(isShape({ kind: 'triangle' } as unknown)).toBe(false)
		})

		test('returns false for invalid variant data', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
			const isShape = discriminatedUnionOf('kind', { circle: isCircle, rect: isRect } as const)
			expect(isShape({ kind: 'circle', r: 'x' } as unknown)).toBe(false)
		})
	})

	describe('enumOf', () => {
		test('validates string enum values', () => {
			enum Color { Red = 'RED', Blue = 'BLUE' }
			const isColor = enumOf(Color)
			expect(isColor('RED')).toBe(true)
			expect(isColor('BLUE')).toBe(true)
			// reference enum members to avoid unused-member TS warnings
			void Color.Red
			void Color.Blue
		})

		test('returns false for non-enum values', () => {
			enum Color { Red = 'RED', Blue = 'BLUE' }
			const isColor = enumOf(Color)
			expect(isColor('GREEN' as unknown)).toBe(false)
			void Color.Red
			void Color.Blue
		})

		test('validates numeric enum values', () => {
			enum Num { A, B, C }
			const isNum = enumOf(Num)
			expect(isNum(0)).toBe(true)
			expect(isNum(1)).toBe(true)
			expect(isNum(2)).toBe(true)
			void Num.A
			void Num.B
			void Num.C
		})

		test('returns false for out-of-range numeric values', () => {
			enum Num { A, B, C }
			const isNum = enumOf(Num)
			expect(isNum(3 as unknown)).toBe(false)
			void Num.A
			void Num.B
			void Num.C
		})
	})

	// Consolidated combinator tests
	describe('arrayOf/tupleOf', () => {
		test('arrayOf validates arrays', () => {
			expect(arrayOf(isString)(['a', 'b'])).toBe(true)
			expect(arrayOf(isString)(['a', 1] as unknown[])).toBe(false)
		})
		test('tupleOf validates fixed length', () => {
			const t = tupleOf(isNumber, isString)
			expect(t([1, 'x'])).toBe(true)
			expect(t([1, 2] as unknown[])).toBe(false)
		})
		test('tupleOf with one element requires exactly one', () => {
			const t1 = tupleOf(isNumber)
			expect(t1([1])).toBe(true)
			expect(t1([] as unknown as [])).toBe(false)
		})
	})

	describe('emptyOf/nonEmptyOf', () => {
		test('nonEmptyOf validates non-empty arrays', () => {
			const g = nonEmptyOf(arrayOf(isNumber))
			expect(g([1])).toBe(true)
			expect(g([])).toBe(false)
		})
		test('emptyOf allows empty arrays and validates elements otherwise', () => {
			const g = emptyOf(arrayOf(isNumber))
			expect(g([])).toBe(true)
			expect(g([1, 2])).toBe(true)
			expect(g(['x'] as unknown)).toBe(false)
		})
		test('nonEmptyOf works with Set/Map and Iterable', () => {
			expect(nonEmptyOf(setOf(isString))(new Set(['a']))).toBe(true)
			expect(nonEmptyOf(setOf(isString))(new Set())).toBe(false)
			expect(nonEmptyOf(mapOf(isString, isNumber))(new Map([['a', 1]]))).toBe(true)
			expect(nonEmptyOf(mapOf(isString, isNumber))(new Map())).toBe(false)
			// iterable
			function* genEmpty() { /* empty */ }
			function* genOne() {
				yield 1
			}
			expect(nonEmptyOf(iterableOf(isNumber))(genEmpty())).toBe(false)
			expect(nonEmptyOf(iterableOf(isNumber))(genOne())).toBe(true)
		})
		test('emptyOf allows empty string/object', () => {
			const nonEmptyStr = nonEmptyOf(isString)
			const emptyStr = emptyOf(isString)
			expect(nonEmptyStr('')).toBe(false)
			expect(emptyStr('')).toBe(true)
			expect(emptyStr(123 as unknown)).toBe(false)
			const isObj = objectOf({}) // any record
			const isObjEmptyOk = emptyOf(isObj)
			expect(isObjEmptyOk({})).toBe(true)
		})
	})

	describe('stringMatchOf and length-based guards', () => {
		test('stringMatchOf', () => {
			expect(stringMatchOf(/^[a-z]+$/)('abc')).toBe(true)
			expect(stringMatchOf(/^\d+$/)('abc')).toBe(false)
		})
		test('lengthOf(exact)', () => {
			expect(lengthOf(2)('ab')).toBe(true)
			expect(lengthOf(3)('ab')).toBe(false)
			expect(lengthOf(2)(['a', 'b'])).toBe(true)
		})
		test('range via rangeOf for strings/arrays', () => {
			expect(rangeOf(2, 3)('abc')).toBe(true)
			expect(rangeOf(2, 2)('abc')).toBe(false)
			expect(rangeOf(1, 1)(['x'])).toBe(true)
		})
	})

	describe('rangeOf/minOf/maxOf (numbers, strings, arrays, Map/Set, objects)', () => {
		test('numbers', () => {
			expect(minOf(3)(5)).toBe(true)
			expect(maxOf(4)(5)).toBe(false)
			expect(rangeOf(1, 3)(2)).toBe(true)
			expect(rangeOf(1, 3)(4)).toBe(false)
		})
		test('strings by length via min/max/range', () => {
			expect(minOf(2)('ab')).toBe(true)
			expect(maxOf(2)('abc')).toBe(false)
			expect(rangeOf(2, 3)('abc')).toBe(true)
		})
		test('arrays by length via min/max/range', () => {
			expect(minOf(1)([1])).toBe(true)
			expect(maxOf(0)([])).toBe(true)
			expect(rangeOf(2, 3)([1, 2, 3])).toBe(true)
			expect(rangeOf(2, 3)([1])).toBe(false)
		})
		test('Map/Set by size via min/max/range and sizeOf', () => {
			const m = new Map([[1, 'a'], [2, 'b']])
			const s = new Set([1, 2, 3])
			expect(minOf(2)(m)).toBe(true)
			expect(sizeOf(2)(m)).toBe(true)
			expect(maxOf(2)(s)).toBe(false)
			expect(sizeOf(4)(s)).toBe(false)
			expect(rangeOf(2, 2)(m)).toBe(true)
			expect(sizeOf(3)(s)).toBe(true)
		})
		test('objects by own enumerable count via min/max/range and countOf', () => {
			const sym = Symbol('s')
			const obj: Record<string | symbol, unknown> = { a: 1 }
			Object.defineProperty(obj, sym, { value: 1, enumerable: true })
			expect(rangeOf(2, 2)(obj)).toBe(true)
			expect(countOf(2)(obj)).toBe(true)
			const obj2: Record<string | symbol, unknown> = {}
			Object.defineProperty(obj2, sym, { value: 1, enumerable: false })
			expect(minOf(1)(obj2)).toBe(false)
			expect(countOf(1)(obj2)).toBe(false)
		})
	})

	describe('multipleOf', () => {
		test('validates multiples', () => {
			expect(multipleOf(3)(9)).toBe(true)
			expect(multipleOf(3)(10)).toBe(false)
		})
		test('rejects invalid divisor and non-number inputs', () => {
			expect(multipleOf(0)(0 as unknown)).toBe(false)
			expect(multipleOf(5)('x' as unknown)).toBe(false)
		})
	})

	describe('measureOf', () => {
		test('matches numbers exactly', () => {
			const m2 = measureOf(2)
			expect(m2(2)).toBe(true)
			expect(m2(3)).toBe(false)
		})
		test('matches string/array length and Set/Map size and object count', () => {
			const m2 = measureOf(2)
			expect(m2('ab')).toBe(true)
			expect(m2(['a', 'b'])).toBe(true)
			expect(m2(new Set([1, 2]))).toBe(true)
			expect(m2(new Map([[1, 'a'], [2, 'b']]))).toBe(true)
			const sym = Symbol('s')
			const obj: Record<string | symbol, unknown> = { a: 1 }
			Object.defineProperty(obj, sym, { value: 1, enumerable: true })
			expect(m2(obj)).toBe(true)
		})
	})

	describe('mapOf/setOf', () => {
		test('mapOf validates key/value guards', () => {
			const m = new Map<string, number>([['a', 1]])
			expect(mapOf(isString, isNumber)(m)).toBe(true)
			expect(mapOf(isString, isNumber)(new Map([['a', 'x']]) as unknown as Map<string, number>)).toBe(false)
		})
		test('setOf validates element guard', () => {
			expect(setOf(isNumber)(new Set([1, 2]))).toBe(true)
			expect(setOf(isNumber)(new Set([1, 'x']) as unknown as Set<number>)).toBe(false)
		})
	})

	describe('keyOf', () => {
		test('validates membership in object keys', () => {
			const g = keyOf({ a: 1, b: 2 } as const)
			expect(g('a')).toBe(true)
			expect(g('c' as unknown)).toBe(false)
		})
	})

	describe('recordOf', () => {
		test('validates plain object values with value guard', () => {
			const g = recordOf(isNumber)
			expect(g({ a: 1, b: 2 })).toBe(true)
			expect(g({ a: 1, b: 'x' } as unknown)).toBe(false)
		})
	})

	describe('stringOf/numberOf', () => {
		test('stringOf matches exact string', () => {
			const g = stringOf('ok')
			expect(g('ok')).toBe(true)
			expect(g('nope')).toBe(false)
		})
		test('numberOf matches exact number', () => {
			const g = numberOf(42)
			expect(g(42)).toBe(true)
			expect(g(41)).toBe(false)
			// rejects non-numbers
			expect(g('42' as unknown)).toBe(false)
		})
	})

	describe('iterableOf', () => {
		test('validates each iterated element', () => {
			function* gen() {
				yield 1
				yield 2
			}
			const g = iterableOf(isNumber)
			expect(g(gen())).toBe(true)
			function* bad() {
				yield 1
				yield 'x'
			}
			expect(g(bad() as unknown as Iterable<number>)).toBe(false)
		})
	})
})
