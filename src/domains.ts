import { isString, numberInRange, isInteger } from './primitives.js'

export function isUUIDv4(x: unknown): x is string {
  return isString(x) && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x)
}

export function isISODateString(x: unknown): x is string {
  if (!isString(x)) return false
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(x)
  if (!m) return false
  const y = Number(m[1]); const mo = Number(m[2]); const d = Number(m[3])
  if (!(mo >= 1 && mo <= 12)) return false
  if (!(d >= 1 && d <= 31)) return false
  const dt = new Date(Date.UTC(y, mo - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
}

export function isISODateTimeString(x: unknown): x is string {
  if (!isString(x)) return false
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(x)) return false
  const dt = new Date(x)
  return !Number.isNaN(dt.getTime())
}

export function isEmail(x: unknown): x is string {
  return isString(x) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x)
}

export function isURLString(x: unknown): x is string {
  if (!isString(x)) return false
  try {
    // eslint-disable-next-line no-new
    new URL(x)
    return true
  } catch {
    return false
  }
}

export function isHttpUrlString(x: unknown): x is string {
  if (!isURLString(x)) return false
  const u = new URL(x)
  return u.protocol === 'http:' || u.protocol === 'https:'
}

export function isPortNumber(x: unknown): x is number {
  return isInteger(x) && numberInRange(1, 65535)(x)
}

export function isMimeType(x: unknown): x is string {
  return isString(x) && /^[a-z0-9][\w.+-]*\/[a-z0-9][\w.+-]*$/i.test(x)
}

export function isSlug(x: unknown): x is string {
  return isString(x) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x)
}

export function isBase64String(x: unknown): x is string {
  return isString(x) && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(x)
}

export function isHexString(x: unknown, opts?: Readonly<{ evenLength?: boolean; allow0x?: boolean }>): x is string {
  if (!isString(x)) return false
  const s = opts?.allow0x === true && x.startsWith('0x') ? x.slice(2) : x
  if (!/^[0-9a-fA-F]+$/.test(s)) return false
  return opts?.evenLength ? s.length % 2 === 0 : true
}

export function isSemver(x: unknown): x is string {
  if (!isString(x)) return false
  // eslint-disable-next-line no-useless-escape
  const re = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
  return re.test(x)
}

export function isJsonString(x: unknown): x is string {
  if (!isString(x)) return false
  try {
    JSON.parse(x)
    return true
  } catch {
    return false
  }
}

export type JsonValue = null | boolean | number | string | JsonArray | JsonObject
export type JsonArray = ReadonlyArray<JsonValue>
export type JsonObject = Readonly<{ [k: string]: JsonValue }>

export function isJsonValue(x: unknown): x is JsonValue {
  if (x === null) return true
  const t = typeof x
  if (t === 'string' || t === 'boolean') return true
  if (t === 'number') return Number.isFinite(x as number)
  if (Array.isArray(x)) return (x as unknown[]).every(isJsonValue)
  if (t === 'object') {
    const o = x as Record<string, unknown>
    for (const k of Object.keys(o)) {
      if (!isJsonValue(o[k])) return false
    }
    return true
  }
  return false
}

const httpMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'] as const
export type HttpMethod = typeof httpMethods[number]

export function isHttpMethod(x: unknown): x is HttpMethod {
  return isString(x) && (httpMethods as readonly string[]).includes(x)
}
