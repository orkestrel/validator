import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pathToString, extendPath, createTypeError } from '../src/diagnostics.js'

test('pathToString', () => {
  assert.equal(pathToString(['meta', 'tags', 1, 'id']), 'meta.tags[1].id')
  assert.equal(pathToString([]), '')
  assert.equal(pathToString(['weird key', 0]), '["weird key"][0]')
})

test('extendPath', () => {
  const p1 = ['a'] as const
  const p2 = extendPath(p1, 'b')
  assert.deepEqual(p1, ['a'])
  assert.deepEqual(p2, ['a', 'b'])
})

test('createTypeError LLM-friendly', () => {
  const err = createTypeError('string', 42, {
    path: ['payload', 'name'],
    label: 'User.name',
    hint: 'Ensure input is a string',
    helpUrl: 'https://example.com/help#name',
  })
  assert.equal(err instanceof TypeError, true)
  assert.match(err.message, /expected string/i)
  assert.match(err.message, /payload\.name/)
  assert.match(err.message, /received.type=number/)
  assert.match(err.message, /tag=\[object Number\]/)
  const meta = err as unknown as {
    expected: string
    path: readonly (string | number)[]
    label?: string
    receivedType: string
    receivedTag: string
    receivedPreview: string
    hint?: string
    helpUrl?: string
  }
  assert.equal(meta.expected, 'string')
  assert.deepEqual(meta.path, ['payload', 'name'])
  assert.equal(meta.label, 'User.name')
  assert.equal(meta.receivedType, 'number')
  assert.ok(meta.receivedTag.startsWith('[object '))
  assert.equal(meta.hint, 'Ensure input is a string')
  assert.equal(meta.helpUrl, 'https://example.com/help#name')
})
