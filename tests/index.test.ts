import { test, expect } from 'vitest'
import * as api from '../src/index.js'

test('index exports surface', () => {
	expect(typeof api).toBe('object')
	expect(Object.keys(api).length).toBeGreaterThan(0)
})
