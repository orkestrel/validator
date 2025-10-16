import type { PathSegment, ValidationPath, CreateTypeErrorOptions } from './types.js'
import { isValidIdent } from './domains.js'
import { previewValue, typeAndTag } from './helpers.js'

/**
 * Turn a validation `path` into a human-readable string.
 *
 * Example: ['meta','tags',1,'id'] becomes "meta.tags[1].id".
 *
 * @param path - Optional validation path
 * @returns String representation of the path
 * @example
 * ```ts
 * pathToString(['meta','tags',1,'id']) // 'meta.tags[1].id'
 * ```
 */
export function pathToString(path?: ValidationPath): string {
	if (!path || path.length === 0) return ''
	const parts: string[] = []
	for (const seg of path) {
		// Numbers and symbols (non-string) are always rendered in bracket form
		if (typeof seg !== 'string') {
			parts.push(`[${String(seg)}]`)
			continue
		}
		// seg is a string here
		if (isValidIdent(seg)) {
			if (parts.length === 0) {
				parts.push(seg)
			}
			else {
				parts.push(`.${seg}`)
			}
		}
		else {
			parts.push(`[${JSON.stringify(seg)}]`)
		}
	}
	return parts.join('')
}

/**
 * Create an LLM-friendly TypeError with human-readable message and
 * enumerable metadata useful to programmatic consumers.
 *
 * The error will include expected, path, label, received type/tag/preview,
 * plus optional hint and helpUrl when provided.
 *
 * @param expected - Description of the expected value
 * @param received - The value that was received
 * @param options - Optional metadata (path, label, message, hint, helpUrl)
 * @returns A TypeError with attached metadata
 * @example
 * ```ts
 * throw createTypeError('string', 123, { path: ['user','name'], label: 'name' })
 * ```
 */
export function createTypeError(expected: string, received: unknown, options?: CreateTypeErrorOptions): TypeError {
	const p = pathToString(options?.path)
	const { type: receivedType, tag: receivedTag } = typeAndTag(received)
	const receivedPreview = previewValue(received)
	const prefix = options?.message ?? 'ValidationError'
	const loc = p ? ` at ${p}` : ''
	const label = options?.label ? ` (${options.label})` : ''
	const hint = options?.hint ? ` | hint: ${options?.hint}` : ''
	const help = options?.helpUrl ? ` | help: ${options?.helpUrl}` : ''
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

/**
 * Return a new ValidationPath with `seg` appended.
 *
 * @param path - Existing path or undefined
 * @param seg - Segment to append
 * @returns New ValidationPath with `seg` appended
 * @example
 * ```ts
 * extendPath(['a'], 'b') // ['a','b']
 * ```
 */
export function extendPath(path: ValidationPath | undefined, seg: PathSegment): ValidationPath {
	return [...(path ?? []), seg]
}
