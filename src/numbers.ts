import type { Guard } from './types.js'
import { isInteger, isNumber } from './primitives.js'

export function isNegativeNumber(x: unknown): x is number {
  return isNumber(x) && x < 0
}

export function intInRange(min: number, max: number): Guard<number> {
  return (x: unknown): x is number => isInteger(x) && x >= min && x <= max
}

export function isMultipleOf(m: number): Guard<number> {
  return (x: unknown): x is number => isNumber(x) && Number.isFinite(m) && m !== 0 && x % m === 0
}
