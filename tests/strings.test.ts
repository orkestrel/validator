import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  stringMatching,
  stringMinLength,
  stringMaxLength,
  stringLengthBetween,
  isLowercase,
  isUppercase,
  isAlphanumeric,
  isAscii,
  isHexColor,
  isIPv4String,
  isHostnameString,
} from '../src/strings.js'

test('string length and regex', () => {
  assert.equal(stringMatching(/^[a-z]+$/)('abc'), true)
  assert.equal(stringMatching(/^\d+$/)('abc'), false)
  assert.equal(stringMinLength(2)('x'), false)
  assert.equal(stringMaxLength(3)('xxxx'), false)
  assert.equal(stringLengthBetween(2, 3)('ab'), true)
})

test('case and classes', () => {
  assert.equal(isLowercase('abc'), true)
  assert.equal(isUppercase('ABC'), true)
  assert.equal(isLowercase('Abc'), false)
  assert.equal(isAlphanumeric('A1'), true)
  assert.equal(isAscii('\u00A9'), false)
})

test('hex colors', () => {
  assert.equal(isHexColor('#fff', { allowHash: true }), true)
  assert.equal(isHexColor('ffffff'), true)
  assert.equal(isHexColor('ffff'), false)
})

test('IPv4', () => {
  assert.equal(isIPv4String('127.0.0.1'), true)
  assert.equal(isIPv4String('256.0.0.1'), false)
  assert.equal(isIPv4String('01.2.3.4'), false)
})

test('hostname', () => {
  assert.equal(isHostnameString('example.com'), true)
  assert.equal(isHostnameString('-bad.com'), false)
  assert.equal(isHostnameString('this-label-is-way-too-long-and-exceeds-sixty-three-characters-limit.com'), false)
})
