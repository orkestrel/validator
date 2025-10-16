import { describe, test, expect } from 'vitest'
import * as api from '../src/index.js'

describe('index', () => {
	describe('exports', () => {
		test('exports an object with API', () => {
			expect(typeof api).toBe('object')
		})

		test('exports multiple functions', () => {
			expect(Object.keys(api).length).toBeGreaterThan(0)
		})
	})
})
