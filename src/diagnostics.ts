export type PathSegment = string | number | symbol
export type ValidationPath = ReadonlyArray<PathSegment>

function isValidIdent(s: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s)
}

/**
 * Turn ['meta','tags',1,'id'] into "meta.tags[1].id"
 */
export function pathToString(path?: ValidationPath): string {
  if (!path || path.length === 0) return ''
  const parts: string[] = []
  for (const seg of path) {
    if (typeof seg === 'number') {
      parts.push(`[${seg}]`)
    } else if (typeof seg === 'symbol') {
      parts.push(`[${seg.toString()}]`)
    } else if (isValidIdent(seg)) {
      if (parts.length === 0) {
        parts.push(seg)
      } else {
        parts.push(`.${seg}`)
      }
    } else {
      parts.push(`[${JSON.stringify(seg)}]`)
    }
  }
  return parts.join('')
}

function previewValue(x: unknown): string {
  try {
    if (x === null) return 'null'
    if (x === undefined) return 'undefined'
    const t = typeof x
    if (t === 'string') {
      const str = x as string
      return str.length > 100 ? `${str.slice(0, 100)}…` : str
    }
    if (t === 'number' || t === 'boolean' || t === 'bigint' || t === 'symbol' || t === 'function') return String(x)
    if (t === 'object') {
      const tag = Object.prototype.toString.call(x)
      if (Array.isArray(x)) return `${tag} length=${(x as unknown[]).length}`
      const json = JSON.stringify(x as Record<string, unknown>, (_, v) => (typeof v === 'bigint' ? String(v) : v))
      if (json && json.length <= 200) return json
      return tag
    }
    return String(x)
  } catch {
    return '[unprintable]'
  }
}

function typeAndTag(x: unknown): { type: string, tag: string } {
  const type = x === null ? 'null' : typeof x
  const tag = Object.prototype.toString.call(x as object)
  return { type, tag }
}

export interface CreateTypeErrorOptions {
  readonly path?: ValidationPath
  readonly label?: string
  readonly message?: string
  readonly hint?: string
  readonly helpUrl?: string
}

/**
 * Create an LLM-friendly TypeError with:
 * - Human-readable message including expected, path, label, received type/tag/preview
 * - Machine-friendly enumerable metadata: expected, path, label, receivedType, receivedTag, receivedPreview, hint, helpUrl
 */
export function createTypeError(expected: string, received: unknown, options?: CreateTypeErrorOptions): TypeError {
  const p = pathToString(options?.path)
  const { type: receivedType, tag: receivedTag } = typeAndTag(received)
  const receivedPreview = previewValue(received)
  const prefix = options?.message ?? 'ValidationError'
  const loc = p ? ` at ${p}` : ''
  const label = options?.label ? ` (${options.label})` : ''
  const hint = options?.hint ? ` | hint: ${options.hint}` : ''
  const help = options?.helpUrl ? ` | help: ${options.helpUrl}` : ''
  const msg = `${prefix}: expected ${expected}${loc}${label} | received.type=${receivedType} tag=${receivedTag} preview=${receivedPreview}${hint}${help}`

  const err = new TypeError(msg)
  const meta = {
    expected,
    path: options?.path ?? [],
    label: options?.label,
    receivedType,
    receivedTag,
    receivedPreview,
    hint: options?.hint,
    helpUrl: options?.helpUrl,
  } as const
  Object.assign(err, meta)
  return err
}

export function extendPath(path: ValidationPath | undefined, seg: PathSegment): ValidationPath {
  return [...(path ?? []), seg]
}
