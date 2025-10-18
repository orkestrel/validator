import { describe, test, expect } from 'vitest'
import { weakMapOf, weakSetOf } from '../../src/combinators/collections.js'
import { isString, isNumber } from '../../src/primitives.js'
import { isObject } from '../../src/objects.js'

describe('combinators/collections', () => {
	describe('weakMapOf', () => {
		test('accepts WeakMap instances (type-only check)', () => {
			const g = weakMapOf(isObject, isNumber)
			const wm = new WeakMap()
			expect(g(wm)).toBe(true)
			expect(g(new Map() as unknown)).toBe(false)
			expect(g({} as unknown)).toBe(false)
		})

		test('validates entries when proofKeys provided', () => {
			const key1 = { id: 1 }
			const key2 = { id: 2 }
			const key3 = { id: 3 }
			const wm = new WeakMap([
				[key1, 'value1'],
				[key2, 'value2'],
			])
			
			// All proof keys in map pass validation
			const g1 = weakMapOf(isObject, isString, [key1, key2])
			expect(g1(wm)).toBe(true)
			
			// Proof key exists but value fails validation
			wm.set(key3, 123 as unknown as string)
			const g2 = weakMapOf(isObject, isString, [key1, key2, key3])
			expect(g2(wm)).toBe(false)
			
			// Proof key not in map - skipped
			const key4 = { id: 4 }
			const g3 = weakMapOf(isObject, isString, [key1, key4])
			expect(g3(wm)).toBe(true)
		})

		test('works with predicate form', () => {
			const isObj = (x: unknown): boolean => typeof x === 'object' && x !== null
			const isStr = (x: unknown): boolean => typeof x === 'string'
			const key1 = { id: 1 }
			const wm = new WeakMap([[key1, 'test']])
			const g = weakMapOf(isObj, isStr, [key1])
			expect(g(wm)).toBe(true)
		})
	})

	describe('weakSetOf', () => {
		test('accepts WeakSet instances (type-only check)', () => {
			const g = weakSetOf(isObject)
			const ws = new WeakSet()
			expect(g(ws)).toBe(true)
			expect(g(new Set() as unknown)).toBe(false)
			expect(g([] as unknown)).toBe(false)
		})

		test('validates elements when proof provided', () => {
			const hasId = (x: unknown): x is { id: number } => 
				isObject(x) && typeof (x as Record<string, unknown>).id === 'number'
			
			const obj1 = { id: 1 }
			const obj2 = { id: 2 }
			const objNoId = { name: 'no-id' }
			const ws = new WeakSet([obj1, obj2])
			
			// All proof elements in set pass validation
			const g1 = weakSetOf(hasId, [obj1, obj2])
			expect(g1(ws)).toBe(true)
			
			// Proof element exists but fails validation
			ws.add(objNoId)
			const g2 = weakSetOf(hasId, [obj1, obj2, objNoId])
			expect(g2(ws)).toBe(false)
			
			// Proof element not in set - skipped
			const obj4 = { id: 4 }
			const g3 = weakSetOf(hasId, [obj1, obj4])
			expect(g3(ws)).toBe(true)
		})

		test('works with predicate form', () => {
			const isObj = (x: unknown): boolean => typeof x === 'object' && x !== null
			const obj1 = { id: 1 }
			const ws = new WeakSet([obj1])
			const g = weakSetOf(isObj, [obj1])
			expect(g(ws)).toBe(true)
		})
	})
})
