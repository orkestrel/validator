# @orkestrel/validator

Tiny, composable runtime validators for TypeScript with deterministic deep checks.

- TypeScript‑first, ESM‑only, strict by default
- Honest types: no `any`, no non‑null assertions, narrow from `unknown`
- Portable: browser + Node compatible; tests use Vitest
- Deterministic helpers and stable options; same inputs → same outputs

Repository: https://github.com/orkestrel/validator

Contents
- [Install](#install)
- [Why this library](#why-this-library)
- [Quick start](#quick-start)
- [Guards](#guards)
- [Combinators](#combinators)
- [Schema and object builders](#schema-and-object-builders)
- [Domain guards](#domain-guards)
- [Deep checks](#deep-checks)
- [Emptiness and “opposites”](#emptiness-and-opposites)
- [TypeScript and build](#typescript-and-build)
- [Testing](#testing)
- [Guides](#guides)
- [Contributing](#contributing)
- [License](#license)

## Install

```sh
npm i @orkestrel/validator
```

Requirements
- Node 18+ (for tests), TypeScript 5+
- ESM‑only (package.json "type": "module"); moduleResolution: bundler

## Why this library

- Validate at the edges, keep internals typed: accept `unknown`, then narrow precisely.
- Small, composable helpers instead of a monolithic schema DSL.
- Predictable semantics for deep equality and clone checks with cycle safety.

## Quick start

```ts
import {
  isRecord, isString, arrayOf,
} from '@orkestrel/validator'

const input: unknown = JSON.parse('{"id":"u1","tags":["x","y"],"count":1}')

// Narrow and use
if (isRecord(input) && isString(input.id) && arrayOf(isString)(input.tags)) {
  console.log(input.id, input.tags.join(','))
}

// Declarative schema with nested guard
const schema = {
  id: 'string',
  tags: (x: unknown): x is readonly string[] => Array.isArray(x) && x.every(isString),
  count: 'number',
} as const

// Use your preferred error strategy if narrowing fails (throw, return Result, etc.)
```

## Guards

- Primitives: `isString`, `isNumber` (finite), `isBoolean`, `isFunction`, `isAsyncFunction`, `isDate`, `isRegExp`, `isError`, `isPromiseLike`
- Function introspection: `isZeroArg`, `isAsyncFunction`, `isGeneratorFunction`, `isAsyncGeneratorFunction`, `isPromiseFunction`, `isZeroArgAsync`, `isZeroArgGenerator`, `isZeroArgAsyncGenerator`, `isZeroArgPromise`
- Objects & keys: `isObject`, `isRecord`, `hasOwn`, `hasOnlyKeys`, `hasNo`, `keyOf`
- Arrays/collections: `isArray`, `arrayOf`, `tupleOf`, `recordOf`, `isMap`, `isSet`, `mapOf`, `setOf`, `iterableOf`
- Strings/numbers: `stringMatchOf`, `stringOf`, `numberOf`, `isLowercase`, `isUppercase`, `isAlphanumeric`, `isAscii`, `isHexColor`, `isIPv4String`, `isIPv6String`, `isHostnameString`
- Size/length/count: `lengthOf`, `sizeOf`, `countOf`, `minOf`, `maxOf`, `rangeOf`, `measureOf`, `multipleOf`

Each guard accepts `unknown` and returns a precise `x is T` predicate. Helpers are pure and do not mutate inputs.

## Combinators

Build complex shapes from small parts:

```ts
import {
  literalOf, andOf, orOf, notOf, unionOf, intersectionOf,
  optionalOf, nullableOf, lazyOf, refineOf, enumOf, discriminatedUnionOf,
  isString, isNumber, objectOf,
  emptyOf, nonEmptyOf, stringMatchOf, stringOf, numberOf,
  lengthOf, sizeOf, countOf, minOf, maxOf, rangeOf, multipleOf,
  mapOf, setOf, keyOf, recordOf, iterableOf, measureOf,
} from '@orkestrel/validator'

// Literal unions and refinement
const isId = refineOf(isString, (s): s is string => s.length > 0)
const isLevel = literalOf('info','warn','error' as const)

// Logical combinators
const isStringAndNonEmpty = andOf(isString, nonEmptyOf(isString))
const isStringOrNumber = orOf(isString, isNumber)

// Negation
const notString = notOf(isString) // Guard<unknown>

// Typed exclusion using a base guard (precise Exclude)
const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
const isRect   = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
const isShape  = unionOf(isCircle, isRect)
const notCircle = notOf(isShape, isCircle) // Guard<{ kind: 'rect', w: number, h: number }>

// Size/length/count constraints
const twoChars = lengthOf(2)        // string or array with length 2
const between1And10 = rangeOf(1, 10) // number/string/array/map/set/object measure in [1, 10]
const atLeast5 = minOf(5)           // measure >= 5
const atMost100 = maxOf(100)        // measure <= 100

// Empty/non-empty variants
const maybeEmptyString = emptyOf(isString)     // '' or non-empty string
const mustHaveItems = nonEmptyOf(arrayOf(isNumber)) // non-empty number array
```

## Schema and object builders

- `hasSchema(obj, schema)` — declarative shape with primitive tags and nested guards.
- `hasPartialSchema` — like `hasSchema` but keys are optional.
- `objectOf(props, { optional, exact, rest })` — build guards for objects programmatically with precise types.

```ts
import { objectOf, isString, isNumber } from '@orkestrel/validator'

const User = objectOf(
  { id: isString, age: isNumber, note: isString },
  { optional: ['note'], exact: true } as const,
)

User({ id: 'u1', age: 41 })           // true
User({ id: 'u1', age: 41, extra: 1 }) // false (exact)
```

## Domain guards

Pragmatic, ecosystem‑friendly checks:

- UUID: `isUUIDv4`
- Time: `isISODateString`, `isISODateTimeString`
- Email/URL: `isEmailString`, `isURLString`, `isHttpUrlString`
- Net: `isPortNumber`, `isHostnameString`, `isIPv4String`
- Content: `isMimeType`, `isSlug`, `isBase64String`, `isHexString({ allow0x, evenLength })`, `isSemver`
- JSON: `isJsonString`, `isJsonValue`
- HTTP: `isHttpMethod`

## Deep checks

Two complementary validators (cycle‑safe):

```ts
import { isDeepEqual, isDeepClone, deepCompare } from '@orkestrel/validator'

const a = { x: [{ v: 1 }], s: new Set([1,2,3]) }
const b = { x: [{ v: 1 }], s: new Set([3,2,1]) }

isDeepEqual(a, b) // true (unordered Set/Map by default)

const shared = { v: 1 }
isDeepClone({ x: shared }, { x: shared }) // false (shared ref)

// Need diagnostics? Use deepCompare for the first mismatch path/reason.
const r = deepCompare({ a: [1, 2] }, { a: [1, 3] }, { identityMustDiffer: false, opts: {} })
if (!r.equal) console.log(r.path, r.reason)
```

Options:
- `strictNumbers` (default true): distinguish `+0`/`-0`; `NaN` equals `NaN`
- `compareSetOrder` / `compareMapOrder`: order‑sensitive comparisons
- `allowSharedFunctions` / `allowSharedErrors` for clone checks

## Emptiness and “opposites”

- `isEmpty` for strings/arrays/maps/sets/objects; specific variants: `isEmptyString`, `isEmptyArray`, `isEmptyObject`, `isEmptyMap`, `isEmptySet`
- Non‑empty counterparts: `isNonEmptyString`, `isNonEmptyArray`, `isNonEmptyObject`, `isNonEmptyMap`, `isNonEmptySet`
- Emptiness-aware combinators:
    - `emptyOf(guard)` — allows empty values or values passing the guard
    - `nonEmptyOf(guard)` — requires non-empty values and passing the guard
- Opposites:
    - `notOf(guard)` — simple negation (returns `Guard<unknown>`)
    - `notOf(base, exclude)` — typed exclusion: `Exclude<Base, Excluded>`
    - `hasNo(obj, ...keys)` — object owns none of these keys

## TypeScript and build

Recommended TS config (excerpt):

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext", "DOM"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

ESM‑only usage in Node:

```sh
node --version  # 18+ recommended
```

## Testing

- Use Vitest for tests and assertions.
- Mirror source files: for `src/foo.ts` create `tests/foo.test.ts`.

Run:

```sh
npm test
```

Example (pinpoint deep mismatch path using `deepCompare`):

```ts
import { test, expect } from 'vitest'
import { deepCompare } from '@orkestrel/validator'

test('pinpoints failing index', () => {
  const r = deepCompare({ a: [1, 2] }, { a: [1, 3] }, { identityMustDiffer: false, opts: {} })
  expect(r.equal).toBe(false)
  expect(r.path).toEqual(['a', 1])
})
```

## Guides

- Overview: https://github.com/orkestrel/validator/blob/HEAD/guides/overview.md
- Start: https://github.com/orkestrel/validator/blob/HEAD/guides/start.md
- Concepts: https://github.com/orkestrel/validator/blob/HEAD/guides/concepts.md
- Examples: https://github.com/orkestrel/validator/blob/HEAD/guides/examples.md
- Deep checks: https://github.com/orkestrel/validator/blob/HEAD/guides/deep.md
- Domain guards: https://github.com/orkestrel/validator/blob/HEAD/guides/domains.md
- Tips: https://github.com/orkestrel/validator/blob/HEAD/guides/tips.md
- Tests: https://github.com/orkestrel/validator/blob/HEAD/guides/tests.md
- FAQ: https://github.com/orkestrel/validator/blob/HEAD/guides/faq.md
- Contribute: https://github.com/orkestrel/validator/blob/HEAD/guides/contribute.md
- Ecosystem: https://github.com/orkestrel/validator/blob/HEAD/guides/ecosystem.md

## Contributing

We value determinism, strict typing, and small, composable APIs. See Contribute for principles and workflow. For issues and feature requests, visit https://github.com/orkestrel/validator/issues.

## License

MIT © Orkestrel
