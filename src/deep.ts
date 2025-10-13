export type DeepEqualOptions = {
  readonly compareSetOrder?: boolean
  readonly compareMapOrder?: boolean
  readonly strictNumbers?: boolean
}

export type DeepCloneCheckOptions = DeepEqualOptions & {
  readonly allowSharedFunctions?: boolean
  readonly allowSharedErrors?: boolean
}

export type DeepCompareResult =
  | { equal: true }
  | { equal: false, path: readonly (string | number | symbol)[], reason: string, detail?: string }

type InternalOptions = {
  identityMustDiffer: boolean
  opts: DeepCloneCheckOptions
}

/**
 * Check deep structural equality between two values.
 */
export function isDeepEqual(a: unknown, b: unknown, opts: DeepEqualOptions = {}): boolean {
  return deepCompare(a, b, { identityMustDiffer: false, opts }).equal
}

/**
 * Check whether two values are deep clones (deep equal + no shared references).
 */
export function isDeepClone(a: unknown, b: unknown, opts: DeepCloneCheckOptions = {}): boolean {
  return deepCompare(a, b, { identityMustDiffer: true, opts }).equal
}

/** Internal deep compare with cycle safety and first-difference diagnostics. */
export function deepCompare(a: unknown, b: unknown, cfg: InternalOptions): DeepCompareResult {
  const { identityMustDiffer, opts } = cfg
  const seen = new WeakMap<object, WeakMap<object, true>>()
  const strictNumbers = opts.strictNumbers !== false // default true

  function markSeen(x: object, y: object): void {
    let inner = seen.get(x)
    if (!inner) {
      inner = new WeakMap<object, true>()
      seen.set(x, inner)
    }
    inner.set(y, true)
  }
  function isSeen(x: object, y: object): boolean {
    return seen.get(x)?.has(y) ?? false
  }

  function ownEnumerableKeys(o: object): (string | symbol)[] {
    const keys: (string | symbol)[] = []
    for (const k of Object.keys(o)) keys.push(k)
    for (const s of Object.getOwnPropertySymbols(o)) {
      const desc = Object.getOwnPropertyDescriptor(o, s)
      if (desc?.enumerable) keys.push(s)
    }
    return keys
  }

  function compareTypedArrays(x: unknown, y: unknown, path: readonly (string | number | symbol)[]): DeepCompareResult | undefined {
    if (!ArrayBuffer.isView(x) && !ArrayBuffer.isView(y)) return undefined
    if (!(ArrayBuffer.isView(x) && ArrayBuffer.isView(y))) {
      return { equal: false, path, reason: 'instanceMismatch', detail: 'One is a TypedArray/DataView, the other is not' }
    }
    if (x instanceof DataView || y instanceof DataView) return undefined
    const ctorX = (x as { constructor: { name: string } }).constructor.name
    const ctorY = (y as { constructor: { name: string } }).constructor.name
    if (ctorX !== ctorY) return { equal: false, path, reason: 'typedArrayCtorMismatch', detail: `Expected ${ctorY} but got ${ctorX}` }

    const ax = x as unknown as { length: number; [n: number]: number | bigint }
    const ay = y as unknown as { length: number; [n: number]: number | bigint }
    if (ax.length !== ay.length) return { equal: false, path, reason: 'typedArrayLengthMismatch', detail: `Expected length ${ay.length} but got ${ax.length}` }
    for (let i = 0; i < ax.length; i++) {
      if (!Object.is(ax[i], ay[i])) {
        return { equal: false, path: [...path, i], reason: 'typedArrayElementMismatch', detail: `Element ${i} differs` }
      }
    }
    return { equal: true }
  }

  function cmp(x: unknown, y: unknown, path: readonly (string | number | symbol)[]): DeepCompareResult {
    if (identityMustDiffer && x !== null && y !== null && x === y) {
      const xIsObj = typeof x === 'object' || typeof x === 'function'
      const yIsObj = typeof y === 'object' || typeof y === 'function'
      if (xIsObj && yIsObj) {
        const allowFn = opts.allowSharedFunctions !== false
        const allowErr = opts.allowSharedErrors !== false
        const isAllowed = (allowFn && typeof x === 'function') || (allowErr && x instanceof Error)
        if (!isAllowed) {
          return { equal: false, path, reason: 'sharedReference', detail: 'Both sides reference the same object' }
        }
      }
    }

    if (x === y) {
      if (strictNumbers && typeof x === 'number' && typeof y === 'number') {
        if (!Object.is(x, y)) {
          return { equal: false, path, reason: 'numberValueMismatch', detail: `Expected number ${String(y)} but got ${String(x)}` }
        }
      }
      return { equal: true }
    }

    if (typeof x === 'number' && typeof y === 'number') {
      if (Number.isNaN(x) && Number.isNaN(y)) return { equal: true }
      if (!strictNumbers && x === y) return { equal: true }
      return { equal: false, path, reason: 'numberValueMismatch', detail: `Expected number ${String(y)} but got ${String(x)}` }
    }

    const tx = typeof x
    const ty = typeof y
    if (tx !== ty) {
      return { equal: false, path, reason: 'typeMismatch', detail: `Expected type ${ty} but got ${tx}` }
    }

    if (x === null || y === null) {
      return { equal: false, path, reason: 'nullMismatch', detail: 'One is null, the other is not' }
    }

    if (tx !== 'object') {
      if (Object.is(x as unknown, y as unknown)) return { equal: true }
      return { equal: false, path, reason: 'valueMismatch', detail: `Expected ${String(y)} but got ${String(x)}` }
    }

    const ox = x as object
    const oy = y as object
    if (isSeen(ox, oy)) return { equal: true }
    markSeen(ox, oy)

    if (x instanceof Date || y instanceof Date) {
      if (!(x instanceof Date && y instanceof Date)) return { equal: false, path, reason: 'instanceMismatch', detail: 'One is Date, the other is not' }
      return x.getTime() === y.getTime() ? { equal: true } : { equal: false, path, reason: 'dateMismatch', detail: `Expected time ${y.getTime()} but got ${x.getTime()}` }
    }

    if (x instanceof RegExp || y instanceof RegExp) {
      if (!(x instanceof RegExp && y instanceof RegExp)) return { equal: false, path, reason: 'instanceMismatch', detail: 'One is RegExp, the other is not' }
      return (x.source === y.source && x.flags === y.flags) ? { equal: true } : { equal: false, path, reason: 'regexpMismatch', detail: `Expected /${y.source}/${y.flags} but got /${x.source}/${x.flags}` }
    }

    if (x instanceof ArrayBuffer || y instanceof ArrayBuffer) {
      if (!(x instanceof ArrayBuffer && y instanceof ArrayBuffer)) return { equal: false, path, reason: 'instanceMismatch', detail: 'One is ArrayBuffer, the other is not' }
      if (x.byteLength !== y.byteLength) return { equal: false, path, reason: 'bufferLengthMismatch', detail: `Expected byteLength ${y.byteLength} but got ${x.byteLength}` }
      const ax = new Uint8Array(x)
      const ay = new Uint8Array(y)
      for (let i = 0; i < ax.length; i++) {
        if (ax[i] !== ay[i]) return { equal: false, path: [...path, i], reason: 'bufferByteMismatch', detail: `Expected ${ay[i]} but got ${ax[i]}` }
      }
      return { equal: true }
    }

    if (x instanceof DataView || y instanceof DataView) {
      if (!(x instanceof DataView && y instanceof DataView)) return { equal: false, path, reason: 'instanceMismatch', detail: 'One is DataView, the other is not' }
      if (x.byteLength !== y.byteLength) return { equal: false, path, reason: 'dataViewLengthMismatch', detail: `Expected byteLength ${y.byteLength} but got ${x.byteLength}` }
      const ax = new Uint8Array(x.buffer, x.byteOffset, x.byteLength)
      const ay = new Uint8Array(y.buffer, y.byteOffset, y.byteLength)
      for (let i = 0; i < ax.length; i++) {
        if (ax[i] !== ay[i]) return { equal: false, path: [...path, i], reason: 'dataViewByteMismatch', detail: `Expected ${ay[i]} but got ${ax[i]}` }
      }
      return { equal: true }
    }

    {
      const ta = compareTypedArrays(x, y, path)
      if (ta) return ta
    }

    if (Array.isArray(x) || Array.isArray(y)) {
      if (!(Array.isArray(x) && Array.isArray(y))) return { equal: false, path, reason: 'instanceMismatch', detail: 'One is Array, the other is not' }
      if (x.length !== y.length) return { equal: false, path, reason: 'arrayLengthMismatch', detail: `Expected length ${y.length} but got ${x.length}` }
      for (let i = 0; i < x.length; i++) {
        const r = cmp(x[i], y[i], [...path, i])
        if (!r.equal) return r
      }
      return { equal: true }
    }

    if (x instanceof Map || y instanceof Map) {
      if (!(x instanceof Map && y instanceof Map)) return { equal: false, path, reason: 'instanceMismatch', detail: 'One is Map, the other is not' }
      if (x.size !== y.size) return { equal: false, path, reason: 'mapSizeMismatch', detail: `Expected size ${y.size} but got ${x.size}` }
      if (opts.compareMapOrder) {
        const xi = x.entries()
        const yi = y.entries()
        let idx = 0
        while (true) {
          const a = xi.next()
          const b = yi.next()
          if (a.done && b.done) break
          const [kx, vx] = a.value as [unknown, unknown]
          const [ky, vy] = b.value as [unknown, unknown]
          const rk = cmp(kx, ky, [...path, `@key(${idx})`])
          if (!rk.equal) return rk
          const rv = cmp(vx, vy, [...path, idx])
          if (!rv.equal) return rv
          idx++
        }
        return { equal: true }
      } else {
        const used = new Set<number>()
        outer: for (const [kx, vx] of x.entries()) {
          let matched = false
          let j = 0
          for (const [ky, vy] of y.entries()) {
            if (used.has(j)) { j++; continue }
            const rk = cmp(kx, ky, [...path, '@key'])
            if (!rk.equal) { j++; continue }
            const rv = cmp(vx, vy, [...path, '@value'])
            if (!rv.equal) { j++; continue }
            used.add(j)
            matched = true
            break
          }
          if (!matched) return { equal: false, path, reason: 'mapEntryMismatch', detail: 'No matching [key,value] found in target Map' }
        }
        return { equal: true }
      }
    }

    if (x instanceof Set || y instanceof Set) {
      if (!(x instanceof Set && y instanceof Set)) return { equal: false, path, reason: 'instanceMismatch', detail: 'One is Set, the other is not' }
      if (x.size !== y.size) return { equal: false, path, reason: 'setSizeMismatch', detail: `Expected size ${y.size} but got ${x.size}` }
      if (opts.compareSetOrder) {
        const xi = x.values()
        const yi = y.values()
        let idx = 0
        while (true) {
          const a = xi.next()
          const b = yi.next()
          if (a.done && b.done) break
          const r = cmp(a.value, b.value, [...path, idx])
          if (!r.equal) return r
          idx++
        }
        return { equal: true }
      } else {
        const used = new Set<number>()
        outer: for (const vx of x.values()) {
          let matched = false
          let j = 0
          for (const vy of y.values()) {
            if (used.has(j)) { j++; continue }
            const r = cmp(vx, vy, [...path, j])
            if (r.equal) {
              used.add(j)
              matched = true
              break
            }
            j++
          }
          if (!matched) return { equal: false, path, reason: 'setElementMismatch', detail: 'No matching element found in target Set' }
        }
        return { equal: true }
      }
    }

    const keysX = ownEnumerableKeys(x as object)
    const keysY = ownEnumerableKeys(y as object)
    if (keysX.length !== keysY.length) {
      return { equal: false, path, reason: 'objectKeyCountMismatch', detail: `Expected ${keysY.length} keys but got ${keysX.length}` }
    }
    for (const k of keysX) {
      if (!keysY.includes(k)) {
        return { equal: false, path, reason: 'objectMissingKey', detail: `Key ${String(k)} missing in target` }
      }
    }
    for (const k of keysX) {
      const vx = (x as Record<PropertyKey, unknown>)[k as unknown as PropertyKey]
      const vy = (y as Record<PropertyKey, unknown>)[k as unknown as PropertyKey]
      const r = cmp(vx, vy, [...path, k])
      if (!r.equal) return r
    }
    return { equal: true }
  }

  return cmp(a, b, [])
}
