# Schema and builders

This guide covers the small set of builders and combinators for composing focused type guards. All builders are exact‑by‑default and return precise `x is T` predicates when given guards; many also accept predicate overloads.

Principles
- Focused: each builder targets a single shape (array, tuple, object, map, set, record, iterable).
- Exact by default: objects reject extra enumerable keys.
- Optional keys: `objectOf` accepts `optional` as `true` (all keys) or a readonly array of keys.
- Deterministic: order and options are explicit; no reflection‑heavy magic.

## objectOf(shape, optional?)

Build an exact object guard from a shape of property guards.

```ts
import { objectOf } from '@orkestrel/validator'
import { isString, isNumber } from '@orkestrel/validator'

const User = objectOf({ id: isString, age: isNumber })
User({ id: 'u1', age: 1 }) // true
User({ id: 'u1' }) // false (missing required)
User({ id: 'u1', age: 1, extra: true }) // false (extra key)

const WithOptional = objectOf({ id: isString, note: isString }, ['note'] as const)
WithOptional({ id: 'u1' }) // true (note optional)
WithOptional({ id: 'u1', note: 1 as unknown as string }) // false

const Partial = objectOf({ id: isString, age: isNumber }, true)
Partial({}) // true (all keys optional)
```

## arrayOf(elemGuard)

Validate arrays with a typed element guard.

```ts
import { arrayOf } from '@orkestrel/validator'
import { isString } from '@orkestrel/validator'

const Strings = arrayOf(isString)
Strings(['a']) // true
Strings(['a', 1] as unknown[]) // false
```

## tupleOf(...guards)

Validate fixed‑length tuples; preserves element types.

```ts
import { tupleOf } from '@orkestrel/validator'
import { isString, isNumber } from '@orkestrel/validator'

const Pair = tupleOf(isString, isNumber)
Pair(['a', 1]) // true
Pair(['a'] as unknown) // false
```

## recordOf(valueGuard)

Plain object with guarded values; arrays are rejected.

```ts
import { recordOf } from '@orkestrel/validator'
import { isString } from '@orkestrel/validator'

const StringMap = recordOf(isString)
StringMap({ a: 'x' }) // true
StringMap(['x'] as unknown) // false
```

## mapOf(keyGuard, valueGuard) and setOf(elemGuard)

Validate Map/Set entries.

```ts
import { mapOf, setOf } from '@orkestrel/validator'
import { isString, isNumber } from '@orkestrel/validator'

const StringToNumber = mapOf(isString, isNumber)
StringToNumber(new Map([['a', 1]])) // true

const NumberSet = setOf(isNumber)
NumberSet(new Set([1, 2])) // true
```

## iterableOf(elemGuard)

Validate generic iterables (will iterate the iterable).

```ts
import { iterableOf } from '@orkestrel/validator'
import { isNumber } from '@orkestrel/validator'

const Numbers = iterableOf(isNumber)
Numbers(new Set([1,2])) // true
```

## literalOf and enumOf

Use for discrete sets.

```ts
import { literalOf, enumOf } from '@orkestrel/validator'

const Level = literalOf('info','warn','error' as const)
Level('warn') // true

enum Color { Red = 'RED', Blue = 'BLUE' }
const isColor = enumOf(Color)
isColor('RED') // true
```

## Combinators for composition

Keep composition explicit and typed.

- andOf, orOf, notOf, complementOf
- unionOf, intersectionOf, composedOf
- whereOf (confirm facts about a base type)
- lazyOf (recursive shapes)
- transformOf (validate a projection)
- nullableOf (allow null)

```ts
import { andOf, whereOf, unionOf, literalOf, objectOf } from '@orkestrel/validator'
import { isString, isNumber } from '@orkestrel/validator'

const nonEmptyString = andOf(isString, (s: string): s is string => s.length > 0)
const alpha2 = whereOf(isString, s => /^[A-Za-z]+$/.test(s))

const Circle = objectOf({ kind: literalOf('circle'), r: isNumber })
const Rect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber })
const Shape = unionOf(Circle, Rect)
```

