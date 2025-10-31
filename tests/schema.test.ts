import { describe, it, expect } from 'vitest';
import {
	objectOf,
	arrayOf,
	tupleOf,
	mapOf,
	setOf,
	recordOf,
	iterableOf,
	literalOf,
	enumOf,
	keyOf,
	pickOf,
	omitOf,
	andOf,
	orOf,
	notOf,
	complementOf,
	unionOf,
	intersectionOf,
	composedOf,
	whereOf,
	lazyOf,
	transformOf,
	nullableOf,
	instanceOf,
} from '../src/schema.js';
import { isString, isNumber } from '../src/primitives.js';
import type { Guard } from '../src/types.js';

describe('arrayOf', () => {
	it('validates arrays of element types', () => {
		const G = arrayOf(isString);
		expect(G(['a', 'b'])).toBe(true);
		expect(G(['a', 1] as unknown as string[])).toBe(false);
		expect(G({} as unknown)).toBe(false);
	});
});

describe('tupleOf', () => {
	it('validates fixed-length tuples', () => {
		const G = tupleOf(isString, isNumber);
		expect(G(['a', 1])).toBe(true);
		expect(G(['a', 'b'] as unknown as [string, number])).toBe(false);
		expect(G(['a'] as unknown as [string, number])).toBe(false);
	});
});

describe('literalOf', () => {
	it('accepts only provided literal values', () => {
		const G = literalOf('a', 'b', 1 as const);
		expect(G('a')).toBe(true);
		expect(G('b')).toBe(true);
		expect(G(1)).toBe(true);
		expect(G('c' as unknown)).toBe(false);
	});
});

describe('enumOf', () => {
	it('accepts only values of the enum', () => {
		const Color = { Red: 'RED', Blue: 'BLUE' } as const;
		const G = enumOf(Color);
		expect(G(Color.Red)).toBe(true);
		expect(G(Color.Blue)).toBe(true);
		expect(G('GREEN' as unknown)).toBe(false);
	});
});

describe('objectOf', () => {
	it('accepts exact objects and rejects extras', () => {
		const User = objectOf({ id: isString, age: isNumber });
		expect(User({ id: 'u1', age: 1 })).toBe(true);
		expect(User({ id: 'u1' })).toBe(false); // missing required
		expect(User({ id: 'u1', age: 1, extra: true })).toBe(false); // extra key
	});
	it('supports optional keys via second parameter', () => {
		const User = objectOf({ id: isString, note: isString }, ['note'] as const);
		expect(User({ id: 'u1' })).toBe(true); // note optional
		expect(User({ id: 'u1', note: 'hi' })).toBe(true);
		expect(User({ id: 'u1', note: 1 as unknown as string })).toBe(false);
		expect(User({ id: 'u1', extra: 1 } as unknown)).toBe(false); // exact-by-default
	});
	it('supports optional=true to make all keys optional', () => {
		const PartialUser = objectOf({ id: isString, age: isNumber }, true);
		expect(PartialUser({})).toBe(true);
		expect(PartialUser({ id: 'x' })).toBe(true);
		expect(PartialUser({ id: 1 as unknown as string })).toBe(false);
	});
	it('deep composition: nested arrays, maps, and sets via composition', () => {
		const Address = objectOf({ street: isString, zip: isString });
		const User = objectOf({ id: isString, tags: arrayOf(isString), addr: Address });
		const Group = objectOf({
			name: isString,
			members: arrayOf(User),
			meta: mapOf(isString, isNumber),
			ids: setOf(isString),
		});
		expect(Group({
			name: 'g',
			members: [{ id: 'u1', tags: ['a'], addr: { street: 's', zip: 'z' } }],
			meta: new Map([['k', 1]]),
			ids: new Set(['a', 'b']),
		})).toBe(true);
		expect(Group({
			name: 'g',
			members: [{ id: 'u1', tags: ['a', 1], addr: { street: 's', zip: 'z' } }],
			meta: new Map([['k', 1]]),
			ids: new Set(['a', 'b']),
		} as unknown)).toBe(false);
	});
	describe('symbol keys handling', () => {
		it('ignores extra symbol keys for exactness in objectOf but still validates string keys', () => {
			const sym = Symbol('s');
			const G = objectOf({ id: isString });
			const value = { id: 'u1', [sym]: 123 } as unknown;
			expect(G(value)).toBe(true);
		});
		it('recordOf exactness considers only string keys', () => {
			const sym = Symbol('s');
			const G = recordOf({ id: isString });
			const value = { id: 'u1', [sym]: 123 } as unknown;
			expect(G(value)).toBe(true);
		});
	});
});

describe('mapOf', () => {
	it('validates keys and values', () => {
		const G = mapOf(isString, isNumber);
		expect(G(new Map<string, number>([['a', 1]]))).toBe(true);
		expect(G(new Map<unknown, unknown>([['a', '1']]))).toBe(false);
		expect(G({} as unknown)).toBe(false);
	});
});

describe('setOf', () => {
	it('validates all elements', () => {
		const G = setOf(isNumber);
		expect(G(new Set([1, 2]))).toBe(true);
		expect(G(new Set([1, '2']))).toBe(false);
		expect(G([] as unknown)).toBe(false);
	});
});

describe('recordOf', () => {
	it('accepts exact records and rejects extras', () => {
		const User = recordOf({ id: isString, age: isNumber });
		expect(User({ id: 'u1', age: 1 })).toBe(true);
		expect(User({ id: 'u1' })).toBe(false); // missing required
		expect(User({ id: 'u1', age: 1, extra: true })).toBe(false); // extra key
	});
	it('supports optional keys via second parameter', () => {
		const User = recordOf({ id: isString, note: isString }, ['note'] as const);
		expect(User({ id: 'u1' })).toBe(true); // note optional
		expect(User({ id: 'u1', note: 'hi' })).toBe(true);
		expect(User({ id: 'u1', note: 1 as unknown as string })).toBe(false);
		expect(User({ id: 'u1', extra: 1 } as unknown)).toBe(false); // exact-by-default
	});
	it('supports optional=true to make all keys optional', () => {
		const PartialUser = recordOf({ id: isString, age: isNumber }, true);
		expect(PartialUser({})).toBe(true);
		expect(PartialUser({ id: 'x' })).toBe(true);
		expect(PartialUser({ id: 1 as unknown as string })).toBe(false);
	});
	it('rejects arrays', () => {
		const User = recordOf({ id: isString });
		expect(User(['x'] as unknown)).toBe(false);
		expect(User([] as unknown)).toBe(false);
	});
	it('rejects null and non-objects', () => {
		const User = recordOf({ id: isString });
		expect(User(null as unknown)).toBe(false);
		expect(User(undefined as unknown)).toBe(false);
		expect(User('not an object' as unknown)).toBe(false);
		expect(User(42 as unknown)).toBe(false);
	});
});

describe('iterableOf', () => {
	it('validates iterables', () => {
		const G = iterableOf(isNumber);
		expect(G(new Set([1, 2]))).toBe(true);
		expect(G([1, 2, '3'] as unknown as number[])).toBe(false);
		expect(G({} as unknown)).toBe(false);
	});
});

describe('keyOf', () => {
	it('accepts only keys of the provided object', () => {
		const G = keyOf({ a: 1, b: 2 } as const);
		expect(G('a')).toBe(true);
		expect(G('b')).toBe(true);
		expect(G('c' as unknown)).toBe(false);
	});
});

describe('pickOf', () => {
	it('builds a sub-shape with picked keys', () => {
		const base = { id: isString, age: isNumber, name: isString } as const;
		const picked = pickOf(base, ['id', 'name'] as const);
		const G = objectOf(picked);
		expect(G({ id: 'x', name: 'y' })).toBe(true);
		expect(G({ id: 'x' } as unknown)).toBe(false);
		// exact by default
		expect(G({ id: 'x', name: 'y', age: 1 } as unknown)).toBe(false);
	});
});

describe('omitOf', () => {
	it('builds a sub-shape omitting keys', () => {
		const base = { id: isString, age: isNumber, name: isString } as const;
		const omitted = omitOf(base, ['age'] as const);
		const G = objectOf(omitted);
		expect(G({ id: 'x', name: 'y' })).toBe(true);
		// missing omitted key is fine, but extra not allowed
		expect(G({ id: 'x', name: 'y', age: 1 } as unknown)).toBe(false);
	});
});

describe('andOf', () => {
	it('intersects two guards', () => {
		const nonEmptyString = andOf(isString, (s: string): s is string => s.length > 0);
		expect(nonEmptyString('x')).toBe(true);
		expect(nonEmptyString('')).toBe(false);
	});
});

describe('orOf', () => {
	it('unions two literal guards', () => {
		const A = literalOf('a' as const);
		const B = literalOf('b' as const);
		const AB = orOf(A, B);
		expect(AB('a')).toBe(true);
		expect(AB('b')).toBe(true);
		expect(AB('c' as unknown)).toBe(false);
	});
});

describe('notOf', () => {
	it('negates a guard/predicate', () => {
		const notString = notOf(isString);
		expect(notString('x')).toBe(false);
		expect(notString(1)).toBe(true);
	});
});

describe('complementOf', () => {
	it('excludes a subset from a base set', () => {
		const Circle = objectOf({ kind: literalOf('circle'), r: isNumber });
		const Rect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber });
		const Shape = orOf(Circle, Rect);
		const NotCircle = complementOf(Shape, Circle);
		expect(NotCircle({ kind: 'rect', w: 1, h: 2 })).toBe(true);
		expect(NotCircle({ kind: 'circle', r: 3 } as unknown)).toBe(false);
	});
});

describe('unionOf', () => {
	it('accepts any guarded variant', () => {
		const A = literalOf('a' as const);
		const B = literalOf('b' as const);
		const U = unionOf(A, B);
		expect(U('a')).toBe(true);
		expect(U('b')).toBe(true);
		expect(U('c' as unknown)).toBe(false);
	});
});

describe('intersectionOf', () => {
	it('accepts only values passing all guards', () => {
		const nonEmptyString = intersectionOf(isString, (x: unknown): x is string => isString(x) && (x).length > 0);
		expect(nonEmptyString('x')).toBe(true);
		expect(nonEmptyString('')).toBe(false);
	});
});

describe('composedOf', () => {
	it('accepts only values passing all guards in sequence', () => {
		const alpha2 = composedOf(
			(x: unknown): x is string => isString(x) && /^[A-Za-z]+$/.test(x),
			(x: unknown): x is string => isString(x) && (x).length === 2,
		);
		expect(alpha2('ab')).toBe(true);
		expect(alpha2('a1')).toBe(false);
		expect(alpha2('abc')).toBe(false);
	});
});

describe('whereOf', () => {
	it('confirms facts about an already narrowed type', () => {
		const nonEmpty = whereOf(isString, s => s.length > 0);
		expect(nonEmpty('a')).toBe(true);
		expect(nonEmpty('')).toBe(false);
	});
});

describe('lazyOf', () => {
	it('defers guard creation for recursive structures', () => {
		interface Tree { v: number; children?: readonly Tree[] }
		const isTree: Guard<Tree> = lazyOf(() => objectOf({ v: isNumber, children: arrayOf(lazyOf(() => isTree)) }, ['children'] as const));
		// Minimal runtime check: value with proper shape passes
		expect(isTree({ v: 1 })).toBe(true);
		// Invalid: wrong v type
		expect(isTree({ v: 'x' } as unknown)).toBe(false);
	});
});

describe('transformOf', () => {
	it('validates a projection after base guard passes', () => {
		const PositiveLengthString = transformOf(isString, s => s.length, (n: unknown): n is number => typeof n === 'number' && n > 0);
		expect(PositiveLengthString('abc')).toBe(true);
		expect(PositiveLengthString('')).toBe(false);
	});
});

describe('nullableOf', () => {
	it('accepts null or values accepted by the base guard', () => {
		const MaybeString = nullableOf(isString);
		expect(MaybeString(null)).toBe(true);
		expect(MaybeString('x')).toBe(true);
		expect(MaybeString(1 as unknown)).toBe(false);
	});
});
describe('instanceOf', () => {
	it('narrows to custom class instances', () => {
		class Box { constructor(public readonly v: number, ..._rest: unknown[]) {} }
		const IsBox = instanceOf(Box);
		const u: unknown = new Box(1);
		expect(IsBox(u)).toBe(true);
		const v: unknown = {};
		expect(IsBox(v)).toBe(false);
	});
	it('checks built-in instances like Date', () => {
		const IsDate = instanceOf(Date);
		expect(IsDate(new Date(0))).toBe(true);
		expect(IsDate('1970-01-01' as unknown)).toBe(false);
	});
});
