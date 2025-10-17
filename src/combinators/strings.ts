import type { Guard } from '../types.js'
import { isString } from '../primitives.js'

/**
 * Guard that accepts strings matching the provided regular expression.
 *
 * Overloads:
 * - matchOf(re) → Guard<string>
 * - matchOf(base, re) → Guard<T> (preserves the base string subtype)
 *
 * @example
 * ```ts
 * matchOf(/^[a-z]+$/)('abc') // true
 * ```
 */
export function matchOf(re: RegExp): Guard<string>
export function matchOf<T extends string>(base: Guard<T>, re: RegExp): Guard<T>
export function matchOf<T extends string>(reOrBase: RegExp | Guard<T>, re?: RegExp): Guard<string> | Guard<T> {
	if (re instanceof RegExp && typeof reOrBase === 'function') {
		const base = reOrBase as Guard<T>
		return (x: unknown): x is T => base(x) && re.test(x as string)
	}
	const onlyRe = reOrBase as RegExp
	return (x: unknown): x is string => isString(x) && onlyRe.test(x)
}

// Starting-with string guard
export function startingWithOf(prefix: string): Guard<string>
export function startingWithOf<T extends string>(base: Guard<T>, prefix: string): Guard<T>
/**
 * Guard for strings that start with a specific prefix.
 *
 * Overloads:
 * - startingWithOf(prefix) → Guard<string>
 * - startingWithOf(base, prefix) → Guard<T> (preserves the base string subtype)
 *
 * @param prefixOrBase - Either the literal prefix (string), or a base guard for composition
 * @param prefix - When composing with a base guard, the required prefix to check
 * @returns Guard<string> for the simple form, or Guard<T> when composed with a base guard
 * @example
 * ```ts
 * const g = startingWithOf('pre')
 * g('prefix') // true
 * g('suffix') // false
 * ```
 */
export function startingWithOf<T extends string>(prefixOrBase: string | Guard<T>, prefix?: string): Guard<string> | Guard<T> {
	if (typeof prefixOrBase === 'function' && typeof prefix === 'string') {
		const base = prefixOrBase as Guard<T>
		return (x: unknown): x is T => base(x) && (x as string).startsWith(prefix)
	}
	const p = prefixOrBase as string
	return (x: unknown): x is string => isString(x) && x.startsWith(p)
}

/**
 * Guard for strings that end with a specific suffix.
 *
 * Overloads:
 * - endingWithOf(suffix) → Guard<string>
 * - endingWithOf(base, suffix) → Guard<T> (preserves the base string subtype)
 *
 * @param suffixOrBase - Either the literal suffix (string), or a base guard for composition
 * @param suffix - When composing with a base guard, the required suffix to check
 * @returns Guard<string> for the simple form, or Guard<T> when composed with a base guard
 * @example
 * ```ts
 * const g = endingWithOf('fix')
 * g('prefix') // true
 * g('suf') // false
 * ```
 */
export function endingWithOf<T extends string>(suffixOrBase: string | Guard<T>, suffix?: string): Guard<string> | Guard<T> {
	if (typeof suffixOrBase === 'function' && typeof suffix === 'string') {
		const base = suffixOrBase as Guard<T>
		return (x: unknown): x is T => base(x) && (x as string).endsWith(suffix)
	}
	const s = suffixOrBase as string
	return (x: unknown): x is string => isString(x) && x.endsWith(s)
}

export function containingOf(substr: string): Guard<string>
export function containingOf<T extends string>(base: Guard<T>, substr: string): Guard<T>
/**
 * Guard for strings that contain a specific substring.
 *
 * Overloads:
 * - containingOf(substr) → Guard<string>
 * - containingOf(base, substr) → Guard<T> (preserves the base string subtype)
 *
 * @param substrOrBase - Either the literal substring (string), or a base guard for composition
 * @param substr - When composing with a base guard, the required substring to search for
 * @returns Guard<string> for the simple form, or Guard<T> when composed with a base guard
 * @example
 * ```ts
 * const g = containingOf('mid')
 * g('admin') // true
 * g('user') // false
 * ```
 */
export function containingOf<T extends string>(substrOrBase: string | Guard<T>, substr?: string): Guard<string> | Guard<T> {
	if (typeof substrOrBase === 'function' && typeof substr === 'string') {
		const base = substrOrBase as Guard<T>
		return (x: unknown): x is T => base(x) && (x as string).includes(substr)
	}
	const s = substrOrBase as string
	return (x: unknown): x is string => isString(x) && x.includes(s)
}
