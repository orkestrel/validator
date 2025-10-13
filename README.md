# @orkestrel/validator

Tiny, composable runtime validators and assertion helpers for TypeScript with LLM‑friendly diagnostics.

- TypeScript‑first, ESM‑only, strict by default
- Honest types: no `any`, no non‑null assertions, narrow from `unknown`
- Portable: browser + Node compatible; tests use Vitest
- Diagnostics that help humans and LLMs debug quickly (paths, previews, metadata)

Repository: https://github.com/orkestrel/validator

Contents
- [Install](#install)
- [Why this library](#why-this-library)
- [Quick start](#quick-start)
- [Guards and assertions](#guards-and-assertions)
- [Combinators](#combinators)
- [Schema and object builders](#schema-and-object-builders)
- [Domain guards](#domain-guards)
- [Deep checks](#deep-checks)
- [Emptiness and “opposites”](#emptiness-and-opposites)
- [Diagnostics](#diagnostics)
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
- Rich, path‑aware assertion errors with machine‑readable metadata for tooling and UIs.
- Predictable semantics for deep equality and clone checks with cycle safety.

## Quick start

```ts
import {
  isRecord, isString, arrayOf,
  assertRecord, assertArrayOf, assertSchema,
} from '@orkestrel/validator'

const input: unknown = JSON.parse('{"id":"u1","tags":["x","y"],"count":1}')

// Narrow and use
if (isRecord(input) && isString(input.id) && arrayOf(isString)(input.tags)) {
  console.log(input.id, input.tags.join(','))
}

// Or fail-fast with path-aware diagnostics
assertRecord(input, { path: ['payload'] })
assertArrayOf(input.tags, isString, { path: ['payload','tags'] })

// Declarative schema with nested guard
const schema = {
  id: 'string',
  tags: (x: unknown): x is readonly string[] => Array.isArray(x) && x.every(isString),
  count: 'number',
} as const

assertSchema(input, schema, { path: ['payload'] })
```

## Guards and assertions

- Primitives: `isString`, `isNumber` (finite), `isBoolean`, `isFunction`, `isAsyncFunction`, `isDate`, `isRegExp`, `isError`, `isPromiseLike`
- Objects & keys: `isObject`, `isRecord`, `hasOwn`, `hasOnlyKeys`, `hasNo`, `keyOf`
- Arrays/collections: `isArray`, `arrayOf`, `nonEmptyArrayOf`, `tupleOf`, `recordOf`, `isMap`, `isSet`, `mapOf`, `setOf`
- Strings/numbers: `stringMatching`, `stringMinLength/MaxLength/LengthBetween`, `isLowercase/Uppercase`, `isAlphanumeric`, `isAscii`, `isHexColor`, `isIPv4String`, `isHostnameString`, `intInRange`, `isMultipleOf`

Each guard has matching assert variants that throw `TypeError` with rich context:
- `assertString`, `assertNumber`, `assertArrayOf`, `assertTupleOf`, `assertRecordOf`, `assertSchema`, `assertDefined`, …
- Opposites: `assertNot` (fail if guard passes), `assertHasNo` (object owns none of keys)

Example (pinpoint failing index):

```ts
import { assertArrayOf, isString } from '@orkestrel/validator'

try {
  assertArrayOf(['a', 1, 'c'], isString, { path: ['payload','tags'] })
} catch (e) {
  // Error message includes "payload.tags[1]" and attaches metadata
}
```

## Combinators

Build complex shapes from small parts:

```ts
import {
  literalOf, and, or, isNot, unionOf, intersectionOf,
  optionalOf, nullableOf, lazy, refine, fromNativeEnum, discriminatedUnion,
  isString, isNumber, objectOf,
} from '@orkestrel/validator'

// Literal unions and refinement
const isId = refine(isString, (s): s is string => s.length > 0)
const isLevel = literalOf('info','warn','error' as const)

// Discriminated unions
const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
const isRect   = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
const isShape  = discriminatedUnion('kind', { circle: isCircle, rect: isRect } as const)
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
- Email/URL: `isEmail`, `isURLString`, `isHttpUrlString`
- Net: `isPortNumber`, `isHostnameString`, `isIPv4String`
- Content: `isMimeType`, `isSlug`, `isBase64String`, `isHexString({ allow0x, evenLength })`, `isSemver`
- JSON: `isJsonString`, `isJsonValue`
- HTTP: `isHttpMethod`

## Deep checks

Two complementary validators and assert‑style throwers (cycle‑safe):

```ts
import {
  isDeepEqual, isDeepClone,
  assertDeepEqual, assertDeepClone,
} from '@orkestrel/validator'

const a = { x: [{ v: 1 }], s: new Set([1,2,3]) }
const b = { x: [{ v: 1 }], s: new Set([3,2,1]) }

isDeepEqual(a, b) // true (unordered Set/Map by default)
assertDeepEqual(a, b)

const shared = { v: 1 }
isDeepClone({ x: shared }, { x: shared }) // false (shared ref)
```

Options:
- `strictNumbers` (default true): distinguish `+0`/`-0`; `NaN` equals `NaN`
- `compareSetOrder` / `compareMapOrder`: order‑sensitive comparisons

## Emptiness and “opposites”

- `isEmpty` for strings/arrays/maps/sets/objects; specific variants: `isEmptyString/Array/Object/Map/Set`
- Non‑empty counterparts: `isNonEmptyString/Array/Object/Map/Set`
- Opposites:
    - `isNot(guard)` — negate a guard (returns `Guard<unknown>`)
    - `hasNo(obj, ...keys)` — object owns none of these keys
    - Assertions: `assertEmpty`, `assertHasNo`, `assertNot`

## Diagnostics

All assertions throw `TypeError` created by `createTypeError(expected, received, options)`:

- Message includes: expected condition, path (e.g., `payload.tags[1]`), optional label, received type/tag/preview, optional hint/helpUrl.
- The error also carries enumerable metadata:
    - `expected`, `path`, `label?`, `receivedType`, `receivedTag`, `receivedPreview`, `hint?`, `helpUrl?`.

This makes errors easy to display and easy for tools/LLMs to reason about.

## TypeScript and build

Recommended TS config (excerpt):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM"],
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

Example:

```ts
import { test, expect } from 'vitest'
import { assertArrayOf, isString } from '@orkestrel/validator'

test('pinpoints failing index', () => {
  expect(() => assertArrayOf(['a', 1], isString, { path: ['payload','tags'] }))
    .toThrow(/payload\.tags\[1\]/)
})
```

## Guides

- Overview: https://github.com/orkestrel/validator/blob/HEAD/guides/overview.md
- Start: https://github.com/orkestrel/validator/blob/HEAD/guides/start.md
- Concepts: https://github.com/orkestrel/validator/blob/HEAD/guides/concepts.md
- Examples: https://github.com/orkestrel/validator/blob/HEAD/guides/examples.md
- Deep checks: https://github.com/orkestrel/validator/blob/HEAD/guides/deep.md
- Diagnostics: https://github.com/orkestrel/validator/blob/HEAD/guides/diagnostics.md
- Domain guards: https://github.com/orkestrel/validator/blob/HEAD/guides/domains.md
- Tips: https://github.com/orkestrel/validator/blob/HEAD/guides/tips.md
- Tests: https://github.com/orkestrel/validator/blob/HEAD/guides/tests.md
- FAQ: https://github.com/orkestrel/validator/blob/HEAD/guides/faq.md
- Contribute: https://github.com/orkestrel/validator/blob/HEAD/guides/contribute.md
- Ecosystem: https://github.com/orkestrel/validator/blob/HEAD/guides/ecosystem.md

## Contributing

We value determinism, strict typing, and small, composable APIs. See [Contribute](https://github.com/orkestrel/validator/blob/HEAD/guides/contribute.md) for principles and workflow. For issues and feature requests, visit https://github.com/orkestrel/validator/issues.

## License

MIT © Orkestrel

