import type { FromSchema, Guard, GuardsShape, GuardType, SchemaSpec } from './types.js'
import type { ValidationPath } from './diagnostics.js'
import { createTypeError, extendPath } from './diagnostics.js'
import { isArray } from './arrays.js'
import { isAsyncFunction, isBoolean, isDefined, isFunction, isNumber, isString } from './primitives.js'
import { hasSchema } from './schema.js'
import { isObject, isRecord, hasNo } from './objects.js'
import { deepCompare, type DeepEqualOptions, type DeepCloneCheckOptions } from './deep.js'
import { isEmpty, isEmptyArray, isEmptyMap, isEmptyObject, isEmptySet, isEmptyString } from './emptiness.js'

export interface AssertOptions {
  readonly path?: ValidationPath
  readonly label?: string
  readonly message?: string
  readonly hint?: string
  readonly helpUrl?: string
}

function fail(expected: string, received: unknown, options?: AssertOptions): never {
  throw createTypeError(expected, received, options)
}

export function assertWithGuard<T>(x: unknown, guard: Guard<T>, options?: AssertOptions): asserts x is T {
  if (!guard(x)) fail(options?.label ?? 'value matching guard', x, options)
}

export function assertString(x: unknown, options?: AssertOptions): asserts x is string {
  if (!isString(x)) fail('string', x, options)
}

export function assertNumber(x: unknown, options?: AssertOptions): asserts x is number {
  if (!isNumber(x)) fail('finite number', x, options)
}

export function assertBoolean(x: unknown, options?: AssertOptions): asserts x is boolean {
  if (!isBoolean(x)) fail('boolean', x, options)
}

export function assertFunction(x: unknown, options?: AssertOptions): asserts x is (...args: unknown[]) => unknown {
  if (!isFunction(x)) fail('function', x, options)
}

export function assertAsyncFunction(x: unknown, options?: AssertOptions): asserts x is (...args: unknown[]) => Promise<unknown> {
  if (!isAsyncFunction(x)) fail('async function', x, options)
}

export function assertObject(x: unknown, options?: AssertOptions): asserts x is Record<string, unknown> {
  if (!isObject(x)) fail('object', x, options)
}

export function assertRecord(x: unknown, options?: AssertOptions): asserts x is Record<string, unknown> {
  if (!isRecord(x)) fail('record', x, options)
}

export function assertArray<T = unknown>(x: unknown, options?: AssertOptions): asserts x is ReadonlyArray<T> {
  if (!isArray<T>(x)) fail('array', x, options)
}

export function assertArrayOf<T>(x: unknown, elem: Guard<T>, options?: AssertOptions): asserts x is ReadonlyArray<T> {
  if (!Array.isArray(x)) fail('array of elements matching guard', x, options)
  for (let i = 0; i < x.length; i++) {
    if (!elem(x[i])) {
      fail('element matching guard', x[i], { ...options, path: extendPath(options?.path, i) })
    }
  }
}

export function assertNonEmptyArrayOf<T>(x: unknown, elem: Guard<T>, options?: AssertOptions): asserts x is readonly [T, ...T[]] {
  if (!Array.isArray(x) || x.length === 0) fail('non-empty array of elements matching guard', x, options)
  for (let i = 0; i < x.length; i++) {
    if (!elem(x[i])) {
      fail('element matching guard', x[i], { ...options, path: extendPath(options?.path, i) })
    }
  }
}

export function assertTupleOf<const Gs extends readonly Guard<unknown>[]>(x: unknown, guards: Gs, options?: AssertOptions): asserts x is { readonly [K in keyof Gs]: Gs[K] extends Guard<infer T> ? T : never } {
  if (!Array.isArray(x) || x.length !== guards.length) {
    fail(`tuple length ${guards.length}`, x, options)
  }
  for (let i = 0; i < guards.length; i++) {
    const guard = guards[i]
    if (!guard || !guard(x[i])) {
      fail(`tuple element ${i} matching guard`, x[i], { ...options, path: extendPath(options?.path, i) })
    }
  }
}

export function assertRecordOf<T>(x: unknown, valueGuard: Guard<T>, options?: AssertOptions): asserts x is Record<string, T> {
  if (typeof x !== 'object' || x === null || Array.isArray(x)) {
    fail('record of values matching guard', x, options)
  }
  const obj = x as Record<string, unknown>
  for (const k of Object.keys(obj)) {
    const v = obj[k]
    if (!valueGuard(v)) {
      fail('property value matching guard', v, { ...options, path: extendPath(options?.path, k) })
    }
  }
}

function findSchemaViolation(obj: unknown, schema: SchemaSpec, path: ValidationPath = []): { expected: string; received: unknown; path: ValidationPath } | undefined {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return { expected: 'object matching schema', received: obj, path }
  }
  const o = obj as Record<string, unknown>
  for (const [k, rule] of Object.entries(schema)) {
    if (!Object.prototype.hasOwnProperty.call(o, k)) {
      return { expected: `property "${k}"`, received: o, path }
    }
    const v = o[k]
    if (typeof rule === 'string') {
      if (rule === 'object') {
        if (!(typeof v === 'object' && v !== null && !Array.isArray(v))) {
          return { expected: `property "${k}" to be object`, received: v, path: extendPath(path, k) }
        }
      } else if (typeof v !== rule) {
        return { expected: `property "${k}" of type ${rule}`, received: v, path: extendPath(path, k) }
      }
    } else if (typeof rule === 'function') {
      if (!(rule as Guard<unknown>)(v)) {
        return { expected: `property "${k}" matching guard`, received: v, path: extendPath(path, k) }
      }
    } else {
      const child: ReturnType<typeof findSchemaViolation> = findSchemaViolation(v, rule, extendPath(path, k))
      if (child) return child
    }
  }
  return undefined
}

export function assertSchema<S extends SchemaSpec>(x: unknown, schema: S, options?: AssertOptions): asserts x is FromSchema<S> {
  if (hasSchema(x, schema)) return
  const failInfo = findSchemaViolation(x, schema, options?.path ?? [])
  if (failInfo) {
    fail(failInfo.expected, failInfo.received, { ...options, path: failInfo.path })
  } else {
    fail('value matching schema', x, options)
  }
}

export function assertDefined<T>(x: T | null | undefined, options?: AssertOptions): asserts x is T {
  if (!isDefined(x)) fail('defined value', x, options)
}

export function assertDeepEqual(actual: unknown, expected: unknown, options?: AssertOptions & DeepEqualOptions): void {
  const res = deepCompare(actual, expected, { identityMustDiffer: false, opts: options ?? {} })
  if (res.equal) return
  const base = `deep equality to expected value (${res.reason}${res.detail ? `: ${res.detail}` : ''})`
  const fullPath = options?.path ? [...options.path, ...res.path] : res.path
  fail(base, actual, { ...options, path: fullPath })
}

export function assertDeepClone(actual: unknown, expected: unknown, options?: AssertOptions & DeepCloneCheckOptions): void {
  const res = deepCompare(actual, expected, { identityMustDiffer: true, opts: options ?? {} })
  if (res.equal) return
  const base = `deep clone (deep equality + no shared references) (${res.reason}${res.detail ? `: ${res.detail}` : ''})`
  const fullPath = options?.path ? [...options.path, ...res.path] : res.path
  fail(base, actual, { ...options, path: fullPath })
}

/**
 * Assertion equivalent for "not": fails when guard(x) is true.
 * Note: cannot narrow x's type (no complement types in TS).
 */
export function assertNot<T>(x: unknown, guard: Guard<T>, options?: AssertOptions): void {
  if (guard(x)) {
    fail(options?.label ? `not ${options.label}` : 'not matching guard', x, options)
  }
}

/**
 * Assert that an object owns none of the provided keys.
 */
export function assertHasNo(obj: unknown, ...keysAndMaybeOptions: (PropertyKey | AssertOptions)[]): void {
  const maybeOptions = keysAndMaybeOptions[keysAndMaybeOptions.length - 1]
  const hasOptions = typeof maybeOptions === 'object' && maybeOptions != null && !Array.isArray(maybeOptions) && !('length' in (maybeOptions as object))
  const options = (hasOptions ? maybeOptions : undefined) as AssertOptions | undefined
  const keys = (hasOptions ? keysAndMaybeOptions.slice(0, -1) : keysAndMaybeOptions) as readonly PropertyKey[]
  if (!hasNo(obj, ...keys)) {
    fail(`object without keys: ${keys.map(String).join(', ')}`, obj, options)
  }
}

export function assertEmpty(x: unknown, options?: AssertOptions): void {
  if (!isEmpty(x)) fail('empty value', x, options)
}
export function assertEmptyString(x: unknown, options?: AssertOptions): asserts x is string {
  if (!isEmptyString(x)) fail('empty string', x, options)
}
export function assertEmptyArray(x: unknown, options?: AssertOptions): asserts x is readonly [] {
  if (!isEmptyArray(x)) fail('empty array', x, options)
}
export function assertEmptyObject(x: unknown, options?: AssertOptions): asserts x is Record<string | symbol, never> {
  if (!isEmptyObject(x)) fail('empty object', x, options)
}
export function assertEmptyMap(x: unknown, options?: AssertOptions): asserts x is ReadonlyMap<unknown, unknown> {
  if (!isEmptyMap(x)) fail('empty map', x, options)
}
export function assertEmptySet(x: unknown, options?: AssertOptions): asserts x is ReadonlySet<unknown> {
  if (!isEmptySet(x)) fail('empty set', x, options)
}
