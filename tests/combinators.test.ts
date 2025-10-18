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
	whereOf,
	discriminatedUnionOf,
	enumOf,
	objectOf,
	arrayOf,
	tupleOf,
	matchOf,
	mapOf,
	setOf,
	keyOf,
	recordOf,
	iterableOf,
	// callable family
	functionOf,
	asyncFunctionOf,
	generatorFunctionOf,
	asyncGeneratorFunctionOf,
	returnsOf,
	promiseLikeOf,
	// Unified comparators
	minOf,
	maxOf,
	rangeOf,
	lengthOf,
	sizeOf,
	countOf,
	multipleOf,
	measureOf,
	partialOf,
	pickOf,
	omitOf,
	allOf,
	emptyOf,
	nonEmptyOf,
	transformOf,
	complementOf,
	weakMapOf,
	weakSetOf,
} from '../src/combinators.js'
import { isString, isNumber, isPromise, isBigInt } from '../src/primitives.js'
import { isTypedArray, isInt16Array, isBigInt64Array, isBigUint64Array } from '../src/arrays.js'
import { isFiniteNumber } from '../src/numbers.js'

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
			const isNonEmptyString = whereOf(isString, s => s.length > 0)
			const both = intersectionOf(isString as (x: unknown) => x is string, isNonEmptyString)
			expect(both('x')).toBe(true)
		})

		test('returns false when any guard fails', () => {
			const isNonEmptyString = whereOf(isString, s => s.length > 0)
			const both = intersectionOf(isString as (x: unknown) => x is string, isNonEmptyString)
			expect(both('')).toBe(false)
		})
	})

	describe('optionalOf (value)', () => {
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
				optionalOf({ value: isNumber, next: optionalOf((x: unknown): x is Node => isNode(x)) }, ['next' as const]),
			)
			expect(isNode({ value: 1 })).toBe(true)
			expect(isNode({ value: 1, next: { value: 2 } })).toBe(true)
		})
	})

	describe('discriminatedUnionOf', () => {
		test('validates discriminated unions', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber })
			const isShape = discriminatedUnionOf('kind', { circle: isCircle, rect: isRect } as const)
			expect(isShape({ kind: 'circle', r: 1 })).toBe(true)
			expect(isShape({ kind: 'rect', w: 2, h: 3 })).toBe(true)
		})

		test('returns false for wrong discriminant', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber })
			const isShape = discriminatedUnionOf('kind', { circle: isCircle, rect: isRect } as const)
			expect(isShape({ kind: 'triangle' } as unknown)).toBe(false)
		})

		test('returns false for invalid variant data', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber })
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
			const isObj = objectOf({}) // exact by default: only empty objects
			const isObjEmptyOk = emptyOf(isObj)
			expect(isObjEmptyOk({})).toBe(true)
		})
	})

	describe('matchOf and length-based guards', () => {
		test('matchOf', () => {
			expect(matchOf(/^[a-z]+$/)('abc')).toBe(true)
			expect(matchOf(/^\d+$/)('abc')).toBe(false)
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

	describe('weakMapOf/weakSetOf', () => {
		test('weakMapOf validates WeakMap', () => {
			const g = weakMapOf()
			expect(g(new WeakMap())).toBe(true)
			expect(g(new Map() as unknown)).toBe(false)
		})
		test('weakSetOf validates WeakSet', () => {
			const g = weakSetOf()
			expect(g(new WeakSet())).toBe(true)
			expect(g(new Set() as unknown)).toBe(false)
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

	describe('isString/isNumber guards', () => {
		test('isString is a string type guard (accepts any string)', () => {
			expect(isString('ok')).toBe(true)
			expect(isString('nope')).toBe(true)
			expect(isString(123 as unknown)).toBe(false)
		})
		test('isNumber is a number type guard (accepts any number)', () => {
			expect(isNumber(42)).toBe(true)
			expect(isNumber(41)).toBe(true)
			// rejects non-numbers
			expect(isNumber('42' as unknown)).toBe(false)
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

	describe('callable family', () => {
		test('functionOf validates functions', () => {
			const g = functionOf<[], number>()
			expect(g(() => 42)).toBe(true)
			// base functionOf does not enforce arity; use arityOf for that.
			const anyFn = functionOf()
			expect(anyFn(() => 1)).toBe(true)
		})

		test('async/generator shorthands', () => {
			const isAsync = asyncFunctionOf()
			expect(isAsync(async () => 1)).toBe(true)
			function* gen() {
				yield 1
			}
			const isGen = generatorFunctionOf()
			expect(isGen(gen)).toBe(true)
			async function* agen() {
				yield 1
			}
			const isAGen = asyncGeneratorFunctionOf()
			expect(isAGen(agen)).toBe(true)
		})

		test('returnsOf validates sync return once', () => {
			const returnsNumber = returnsOf([], (x: unknown): x is number => typeof x === 'number')
			expect(returnsNumber(() => 42)).toBe(true)
			expect(returnsNumber(() => 'x' as unknown as number)).toBe(false)
		})

		test('promise guards', () => {
			expect(isPromise(Promise.resolve(1))).toBe(true)
			const thenable = { then() { /* noop */ } }
			expect(promiseLikeOf()(thenable)).toBe(true)
		})
	})

	describe('objectOf optional/rest', () => {
		test('optionalOf(shape): missing optional key is allowed, missing required key is rejected', () => {
			const Guard = optionalOf({ id: isString, age: isNumber }, ['age' as const])
			expect(Guard({ id: 'x', age: 1 })).toBe(true)
			expect(Guard({ id: 'x' })).toBe(true)
			expect(Guard({ age: 1 } as unknown)).toBe(false)
		})

		test('objectOf exact by default: rejects extra keys', () => {
			const Guard = objectOf({ id: isString })
			expect(Guard({ id: 'x' })).toBe(true)
			expect(Guard({ id: 'x', extra: 1 } as unknown)).toBe(false)
		})

		test('objectOf rest: validates extra keys when provided', () => {
			const Guard = objectOf({ id: isString }, { rest: isNumber })
			expect(Guard({ id: 'x' })).toBe(true)
			expect(Guard({ id: 'x', a: 1, b: 2 })).toBe(true)
			expect(Guard({ id: 'x', a: 'nope' } as unknown)).toBe(false)
		})

		test('optionalOf(shape) with rest', () => {
			const Guard = optionalOf(
				{ id: isString, note: isString },
				['note' as const],
				{ rest: isNumber },
			)
			expect(Guard({ id: 'x' })).toBe(true)
			expect(Guard({ id: 'x', note: 'hi' })).toBe(true)
			expect(Guard({ id: 'x', a: 1, b: 2 })).toBe(true)
			expect(Guard({ id: 'x', note: 'hi', a: 1 })).toBe(true)
			expect(Guard({ id: 'x', a: 'bad' } as unknown)).toBe(false)
		})

		test('optionalOf(shape) validates present optional values', () => {
			const Guard = optionalOf({ id: isString, age: isNumber }, ['age' as const])
			expect(Guard({ id: 'x', age: 'not-a-number' } as unknown)).toBe(false)
		})
	})

	describe('shape helpers', () => {
		test('partialOf makes all keys optional (exact)', () => {
			const Guard = partialOf({ id: isString, age: isNumber })
			expect(Guard({})).toBe(true)
			expect(Guard({ id: 'x' })).toBe(true)
			expect(Guard({ id: 'x', age: 1 })).toBe(true)
			// extras rejected without rest
			expect(Guard({ id: 'x', extra: 1 } as unknown)).toBe(false)
		})
		test('pickOf/omitOf compose shapes', () => {
			const base = { id: isString, age: isNumber, name: isString } as const
			const picked = pickOf(base, ['id' as const, 'name' as const])
			const omitted = omitOf(base, ['age' as const])
			const pickGuard = objectOf(picked)
			const omitGuard = objectOf(omitted)
			expect(pickGuard({ id: 'x', name: 'a' })).toBe(true)
			expect(omitGuard({ id: 'x', name: 'a' })).toBe(true)
			// missing required
			expect(pickGuard({ id: 'x' } as unknown)).toBe(false)
		})
	})

	// Newly added coverage
	describe('allOf', () => {
		test('composes multiple guards with AND', () => {
			const isAlpha = (x: unknown): x is string => typeof x === 'string' && /^[A-Za-z]+$/.test(x)
			const isLen2 = (x: unknown): x is string => typeof x === 'string' && x.length === 2
			const g = allOf(isString, isAlpha, isLen2)
			expect(g('ab')).toBe(true)
			expect(g('a')).toBe(false)
			expect(g('a1')).toBe(false)
		})
	})

	describe('transformOf', () => {
		test('validates projection when base passes', () => {
			const arity1 = transformOf(functionOf(), () => (args: unknown) => args, lengthOf(1))
			expect(arity1((a: unknown) => a)).toBe(true)
			expect(arity1(() => 1)).toBe(false)
		})
		test('transforms derived value and validates it (trim + lowercase)', () => {
			const alphaTrimmed = transformOf(isString, s => s.trim().toLowerCase(), matchOf(/^[a-z]+$/))
			expect(alphaTrimmed(' Abc ')).toBe(true)
			expect(alphaTrimmed(' 123 ' as unknown)).toBe(false)
		})
		test('rejects when base fails without calling projection', () => {
			let called = 0
			const g = transformOf(isString, (s) => {
				called++
				return s.length
			}, isNumber)
			expect(g(123 as unknown)).toBe(false)
			expect(called).toBe(0)
		})
	})

	describe('objectOf', () => {
		test('validates objects with optional fields (exact by default)', () => {
			const User = optionalOf({ id: isString, age: isNumber, note: isString }, ['note' as const])
			expect(User({ id: 'x', age: 1 })).toBe(true)
			expect(User({ id: 'x', age: 1, note: 'hello' })).toBe(true)
		})

		test('enforces exact by default to reject extra fields', () => {
			const User = optionalOf({ id: isString, age: isNumber, note: isString }, ['note' as const])
			expect(User({ id: 'x', age: 1, extra: 1 })).toBe(false)
		})

		test('validates rest fields with rest option', () => {
			const WithRest = objectOf({ id: isString }, { rest: isNumber })
			expect(WithRest({ id: 'x' })).toBe(true)
			expect(WithRest({ id: 'x', a: 1, b: 2 })).toBe(true)
		})

		test('returns false when rest fields fail validation', () => {
			const WithRest = objectOf({ id: isString }, { rest: isNumber })
			expect(WithRest({ id: 'x', a: 'nope' as unknown })).toBe(false)
		})
	})

	describe('matchOf', () => {
		test('returns true when string matches regex', () => {
			expect(matchOf(/^[a-z]+$/)('abc')).toBe(true)
		})

		test('returns false when string does not match regex', () => {
			expect(matchOf(/^\d+$/)('abc')).toBe(false)
		})
	})

	describe('string length via lengthOf (exact)', () => {
		test('returns true when string has exact length', () => {
			expect(lengthOf(2)('ab')).toBe(true)
			expect(lengthOf(3)('abc')).toBe(true)
		})

		test('returns false when string length differs', () => {
			expect(lengthOf(2)('x')).toBe(false)
			expect(lengthOf(2)('abc')).toBe(false)
		})
	})

	describe('string length via rangeOf/minOf', () => {
		test('returns true when string length is within range', () => {
			expect(rangeOf(0, 3)('abc')).toBe(true)
			expect(rangeOf(0, 3)('ab')).toBe(true)
		})

		test('returns false when string is too long', () => {
			expect(rangeOf(0, 3)('xxxx')).toBe(false)
		})

		test('minOf works on string length', () => {
			expect(minOf(2)('ab')).toBe(true)
			expect(minOf(2)('x')).toBe(false)
		})
	})

	describe('complementOf', () => {
		test('excludes a variant from a base union (discriminated)', () => {
			const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber })
			const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber })
			const isShape = unionOf(isCircle, isRect)
			const notCircle = complementOf(isShape, isCircle)
			expect(notCircle({ kind: 'rect', w: 1, h: 2 })).toBe(true)
			expect(notCircle({ kind: 'circle', r: 3 })).toBe(false)
		})

		test('works with a refinement predicate as the exclude', () => {
			const base = isString
			const exclude = (s: string): s is string => s.length === 0
			const nonEmptyString = complementOf(base, exclude)
			expect(nonEmptyString('x')).toBe(true)
			expect(nonEmptyString('')).toBe(false)
		})
	})

	describe('iterableOf with typed arrays', () => {
		test('numeric typed arrays with iterableOf + isTypedArray', () => {
			// Accept any numeric typed array
			const NumericTypedArray = intersectionOf(
				isTypedArray,
				iterableOf(isFiniteNumber),
			)

			expect(NumericTypedArray(new Uint8Array([1, 2, 3]))).toBe(true)
			expect(NumericTypedArray(new Int16Array([1, 2, 3]))).toBe(true)
			expect(NumericTypedArray(new Float32Array([1.5, 2.5]))).toBe(true)
			expect(NumericTypedArray(new BigInt64Array([1n, 2n]))).toBe(false) // bigint, not number
			expect(NumericTypedArray([1, 2, 3])).toBe(false) // array, not typed array
		})

		test('bigint typed arrays with iterableOf', () => {
			const BigIntTypedArray = intersectionOf(
				unionOf(isBigInt64Array, isBigUint64Array),
				iterableOf(isBigInt),
			)

			expect(BigIntTypedArray(new BigInt64Array([1n, 2n]))).toBe(true)
			expect(BigIntTypedArray(new BigUint64Array([1n, 2n]))).toBe(true)
			expect(BigIntTypedArray(new Int32Array([1, 2]))).toBe(false) // numeric, not bigint
			expect(BigIntTypedArray([1n, 2n])).toBe(false) // array, not typed array
		})

		test('specific typed array with element refinement', () => {
			// Non-negative Int16Array
			const NonNegativeInt16Array = intersectionOf(
				isInt16Array,
				iterableOf((n: unknown): n is number => typeof n === 'number' && n >= 0),
			)

			expect(NonNegativeInt16Array(new Int16Array([0, 1, 2]))).toBe(true)
			expect(NonNegativeInt16Array(new Int16Array([1, -1, 2]))).toBe(false) // has negative
			expect(NonNegativeInt16Array(new Uint16Array([0, 1, 2]))).toBe(false) // wrong type
		})

		test('arrayOf does not accept typed arrays', () => {
			// arrayOf only accepts Array.isArray() results
			const Numbers = arrayOf(isNumber)
			expect(Numbers([1, 2, 3])).toBe(true)
			expect(Numbers(new Int32Array([1, 2, 3]))).toBe(false)
		})
	})
})
