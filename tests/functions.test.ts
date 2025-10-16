import { describe, test, expect } from 'vitest'
import { isZeroArg, isAsyncFunction, isGeneratorFunction, isAsyncGeneratorFunction, isPromiseFunction,
	isZeroArgAsync, isZeroArgGenerator, isZeroArgAsyncGenerator, isZeroArgPromise } from '../src/functions.js'

describe('functions', () => {
	describe('isZeroArg', () => {
		test('returns true for zero-argument functions', () => {
			expect(isZeroArg(() => 1)).toBe(true)
			expect(isZeroArg(function () {
				return 1
			})).toBe(true)
		})

		test('returns false for functions with arguments', () => {
			expect(isZeroArg(((x: number) => x) as (...args: unknown[]) => unknown)).toBe(false)
		})
	})

	describe('isAsyncFunction', () => {
		test('returns true for async functions', () => {
			const f = async () => {}
			expect(isAsyncFunction(f)).toBe(true)
		})

		test('returns false for non-async functions', () => {
			function normal() {
				return 1
			}
			expect(isAsyncFunction(normal)).toBe(false)
		})
	})

	describe('isGeneratorFunction', () => {
		test('returns true for generator functions', () => {
			function* gen() {
				yield 1
			}
			expect(isGeneratorFunction(gen)).toBe(true)
		})
		test('returns false for non-generator functions', () => {
			const f = () => {}
			expect(isGeneratorFunction(f)).toBe(false)
			const g = async () => {}
			expect(isGeneratorFunction(g)).toBe(false)
		})
	})

	describe('isAsyncGeneratorFunction', () => {
		test('returns true for async generator functions', () => {
			async function* agen() {
				yield 1
			}
			expect(isAsyncGeneratorFunction(agen)).toBe(true)
		})
		test('returns false for non-async-generator functions', () => {
			const f = () => {}
			expect(isAsyncGeneratorFunction(f)).toBe(false)
			const g = async () => {}
			expect(isAsyncGeneratorFunction(g)).toBe(false)
		})
	})

	describe('isPromiseFunction', () => {
		test('returns true for non-async functions that construct a Promise', () => {
			const f = () => new Promise<void>(res => res())
			expect(isPromiseFunction(f)).toBe(true)
		})
		test('returns false for native async functions', () => {
			const f = async () => 1
			expect(isPromiseFunction(f)).toBe(false)
		})
		test('returns false for sync functions that do not construct a Promise', () => {
			function normal() {
				return 1
			}
			expect(isPromiseFunction(normal)).toBe(false)
		})
	})

	describe('isZeroArgAsync', () => {
		test('returns true for zero-argument native async functions', () => {
			const f = async () => 1
			expect(isZeroArgAsync(f)).toBe(true)
		})
		test('returns false for async functions with arguments', () => {
			const f = async (x: number) => x
			expect(isZeroArgAsync(f)).toBe(false)
		})
		test('returns false for non-async promise-returning functions', () => {
			const g = () => Promise.resolve(1)
			expect(isZeroArgAsync(g)).toBe(false)
		})
	})

	describe('isZeroArgGenerator', () => {
		test('returns true for zero-argument generator functions', () => {
			function* gen() {
				yield 1
			}
			expect(isZeroArgGenerator(gen)).toBe(true)
		})
		test('returns false for generator functions with arguments', () => {
			function* gen1(x: number) {
				yield x
			}
			expect(isZeroArgGenerator(gen1)).toBe(false)
		})
		test('returns false for non-generator functions', () => {
			const f = () => {}
			expect(isZeroArgGenerator(f)).toBe(false)
		})
	})

	describe('isZeroArgAsyncGenerator', () => {
		test('returns true for zero-argument async generator functions', () => {
			async function* agen() {
				yield 1
			}
			expect(isZeroArgAsyncGenerator(agen)).toBe(true)
		})
		test('returns false for async generator functions with arguments', () => {
			async function* agen1(x: number) {
				yield x
			}
			expect(isZeroArgAsyncGenerator(agen1)).toBe(false)
		})
		test('returns false for non-async-generator functions', () => {
			const f = () => {}
			expect(isZeroArgAsyncGenerator(f)).toBe(false)
			const g = async () => {}
			expect(isZeroArgAsyncGenerator(g)).toBe(false)
		})
	})

	describe('isZeroArgPromise', () => {
		test('returns true for zero-arg non-async functions that construct a Promise', () => {
			const f = () => new Promise<void>(res => res())
			expect(isZeroArgPromise(f)).toBe(true)
		})
		test('returns false for native async functions', () => {
			const f = async () => 1
			expect(isZeroArgPromise(f)).toBe(false)
		})
		test('returns false for zero-arg sync functions that do not construct a Promise', () => {
			const normal = () => 1
			expect(isZeroArgPromise(normal)).toBe(false)
		})
		test('returns false for promise-returning functions with arguments', () => {
			const h = (x: number) => Promise.resolve(x)
			expect(isZeroArgPromise(h)).toBe(false)
		})
	})
})
