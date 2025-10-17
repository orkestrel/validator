import type { ParsedAbsoluteUrl } from './types.js'
import { isInteger, isRange } from './numbers.js'
import { isIPv4String, isIPv6String, isHostnameString } from './domains.js'

/** Internal conservative absolute URL regex */
const ABS_URL_RE = /^(?<scheme>[A-Za-z][A-Za-z0-9+.-]*):\/\/(?<authority>[^/?#]*)(?<rest>[/?#].*)?$/

/**
 * Return the internal [[Class]] tag string for a value.
 *
 * @param x - Value to inspect
 * @returns Tag like "[object Array]" or "[object Date]"
 * @example
 * ```ts
 * getTag([]) // "[object Array]"
 * ```
 */
export function getTag(x: unknown): string {
	return Object.prototype.toString.call(x)
}

/**
 * Count own enumerable string keys and enumerable symbol keys on an object.
 *
 * Internal helper used by object property count validators and combinators.
 * Counts both enumerable string keys (via Object.keys) and enumerable symbol keys.
 *
 * @param obj - Object to count keys on
 * @returns Total count of enumerable string and symbol keys
 * @example
 * ```ts
 * countEnumerableProperties({ a: 1, b: 2 }) // 2
 * ```
 */
export function countEnumerableProperties(obj: object): number {
	const keysLen = Object.keys(obj).length
	const symsLen = Object.getOwnPropertySymbols(obj).reduce(
		(acc, s) => acc + (Object.getOwnPropertyDescriptor(obj, s)?.enumerable ? 1 : 0),
		0,
	)
	return keysLen + symsLen
}

/**
 * Peek an Iterable once and produce a new Iterable that replays the peeked element,
 * followed by the remaining elements from the original iterator.
 *
 * This avoids consuming the first value irreversibly when we need a non-empty check
 * but still want to pass the full sequence to a downstream guard.
 *
 * @typeParam T - Element type of the iterable
 * @param iterable - Source iterable to peek
 * @returns An object with `empty` flag and a `replay` iterable that yields the same
 *          sequence as the original when `empty` is false
 * @example
 * ```ts
 * function* gen() { yield 1; yield 2 }
 * const { empty, replay } = peekIterable(gen())
 * // empty === false; replay yields 1, 2
 * ```
 */
export function peekIterable<T>(iterable: Iterable<T>): { empty: boolean, replay: Iterable<T> } {
	const iterator = iterable[Symbol.iterator]()
	const first = iterator.next()
	if (first.done) {
		return {
			empty: true,
			replay: {
				[Symbol.iterator](): Iterator<T> {
					return {
						next: () => ({ done: true, value: undefined as unknown as T }),
					}
				},
			},
		}
	}
	const replay: Iterable<T> = {
		[Symbol.iterator](): Iterator<T> {
			let yieldedFirst = false
			return {
				next(): IteratorResult<T> {
					if (!yieldedFirst) {
						yieldedFirst = true
						return { value: first.value, done: false }
					}
					return iterator.next()
				},
			}
		},
	}
	return { empty: false, replay }
}

/**
 * Parse a decimal port number text into a number within [1, 65535].
 *
 * Returns `undefined` when the input is empty, non-numeric, or out of range.
 * Uses numeric guards (`isInteger`) and `inRange` to validate the result.
 *
 * @param portText - Raw port text (without a leading colon)
 * @returns A valid port number or `undefined`
 * @example
 * ```ts
 * parsePort('8080') // 8080
 * parsePort('0') // undefined
 * parsePort('abc') // undefined
 * ```
 */
export function parsePort(portText: string | undefined): number | undefined {
	if (portText === undefined || portText.length === 0) return undefined
	if (!/^\d+$/.test(portText)) return undefined
	const n = Number(portText)
	return isInteger(n) && isRange(n, 1, 65535) ? n : undefined
}

/**
 * Parse a conservative absolute URL string.
 *
 * Returns a minimal parsed shape when valid; otherwise `undefined`.
 *
 * @param input - URL string to parse (e.g., "https://example.com:8080/path?x#y")
 * @returns Parsed absolute URL fields or `undefined` when invalid
 * @example
 * ```ts
 * parseAbsoluteUrl('https://example.com')?.protocol // 'https:'
 * ```
 */
export function parseAbsoluteUrl(input: string): ParsedAbsoluteUrl | undefined {
	const m = ABS_URL_RE.exec(input)
	if (!m || !m.groups) return undefined
	const scheme = m.groups.scheme
	const authority = m.groups.authority
	if (authority.length === 0) return undefined

	// Strip userinfo if present
	const at = authority.lastIndexOf('@')
	const hostPort = at >= 0 ? authority.slice(at + 1) : authority

	// Split host and port (careful with IPv6 [..])
	let host = hostPort
	let portText: string | undefined
	if (hostPort.startsWith('[')) {
		const end = hostPort.indexOf(']')
		if (end <= 0) return undefined
		host = hostPort.slice(0, end + 1)
		const rest = hostPort.slice(end + 1)
		if (rest.startsWith(':')) portText = rest.slice(1)
		else if (rest.length > 0) return undefined
	}
	else {
		const colon = hostPort.lastIndexOf(':')
		if (colon > -1) {
			host = hostPort.slice(0, colon)
			portText = hostPort.slice(colon + 1)
		}
	}

	// Host validation (inline to avoid circular dependency)
	let hostOk: boolean
	if (host.startsWith('[') && host.endsWith(']')) {
		const inner = host.slice(1, -1)
		hostOk = isIPv6String(inner)
	}
	else {
		hostOk = isIPv4String(host) || isHostnameString(host)
	}
	if (!hostOk) return undefined

	const port = parsePort(portText)
	if (portText !== undefined && port === undefined) return undefined

	return { protocol: scheme + ':', host, port }
}
