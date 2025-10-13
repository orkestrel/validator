import type { Guard } from './types.js'
import { isString } from './primitives.js'

export function stringMatching(re: RegExp): Guard<string> {
  return (x: unknown): x is string => isString(x) && re.test(x)
}

export function stringMinLength(min: number): Guard<string> {
  return (x: unknown): x is string => isString(x) && x.length >= min
}

export function stringMaxLength(max: number): Guard<string> {
  return (x: unknown): x is string => isString(x) && x.length <= max
}

export function stringLengthBetween(min: number, max: number): Guard<string> {
  return (x: unknown): x is string => isString(x) && x.length >= min && x.length <= max
}

export function isLowercase(x: unknown): x is string {
  return isString(x) && x === x.toLowerCase()
}

export function isUppercase(x: unknown): x is string {
  return isString(x) && x === x.toUpperCase()
}

export function isAlphanumeric(x: unknown): x is string {
  return isString(x) && /^[A-Za-z0-9]+$/.test(x)
}

export function isAscii(x: unknown): x is string {
  return isString(x) && /^[\x00-\x7F]+$/.test(x)
}

/**
 * Hex color (#RGB | #RRGGBB | #RRGGBBAA). Optionally allow leading '#'.
 */
export function isHexColor(x: unknown, opts?: Readonly<{ allowHash?: boolean }>): x is string {
  if (!isString(x)) return false
  const s = opts?.allowHash === true && x.startsWith('#') ? x.slice(1) : x
  return /^([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s)
}

export function isIPv4String(x: unknown): x is string {
  if (!isString(x)) return false
  const m = x.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
  if (!m) return false
  for (let i = 1; i <= 4; i++) {
    const part = m[i]
    if (!part) return false
    const n = Number(part)
    if (!Number.isInteger(n) || n < 0 || n > 255) return false
    if (part.length > 1 && part.startsWith('0')) return false
  }
  return true
}

/**
 * RFC 1123-ish hostname.
 */
export function isHostnameString(x: unknown): x is string {
  if (!isString(x)) return false
  if (x.length === 0 || x.length > 253) return false
  const labels = x.split('.')
  for (const label of labels) {
    if (label.length < 1 || label.length > 63) return false
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)) return false
  }
  return true
}
