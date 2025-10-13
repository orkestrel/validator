import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as api from '../src/index.js'

test('index exports surface', () => {
  assert.equal(typeof api, 'object')
  assert.ok(Object.keys(api).length > 0)
})
