# @orkestrel/validator

Focused, composable runtime type guards for TypeScript (ESM‑only).

- TypeScript‑first, strict by default (no any, safe narrowing from unknown)
- Deterministic, tiny helpers that only narrow types meaningfully
- Portable: browser + Node compatible; tests use Vitest

Repository: https://github.com/orkestrel/validator

Contents
- [Install](#install)
- [Quick start](#quick-start)
- [Guards](#guards)
- [TypeScript and build](#typescript-and-build)
- [Contributing](#contributing)
- [License](#license)

## Install

```sh
npm i @orkestrel/validator
```

Requirements
- Node 18+ (for tests), TypeScript 5+
- ESM‑only (package.json "type": "module"); moduleResolution: bundler

## Quick start

```ts
import { isRecord, isString, isArray, isNumber } from '@orkestrel/validator'

const input: unknown = JSON.parse('{"id":"u1","tags":["x","y"],"count":1}')

if (isRecord(input) && isString(input.id) && isArray(input.tags) && input.tags.every(isString) && isNumber(input.count)) {
  // id: string, tags: readonly string[], count: number
}
```

### Quick start (schema builders)

```ts
import { objectOf, arrayOf } from '@orkestrel/validator'
import { isString, isNumber } from '@orkestrel/validator'

const input: unknown = JSON.parse('{"id":"u1","tags":["x","y"],"count":1}')

const Payload = objectOf({
  id: isString,
  tags: arrayOf(isString),
  count: isNumber,
})

if (Payload(input)) {
  // input is now narrowed with id/tags/count
}
```

## Guards

- Primitives: `isNull`, `isUndefined`, `isDefined`, `isString`, `isNumber`, `isBoolean`, `isBigInt`, `isSymbol`, `isFunction`, `isDate`, `isRegExp`, `isError`, `isPromise`, `isPromiseLike`, `isArrayBuffer`, `isSharedArrayBuffer`, `isIterable`, `isAsyncIterator`
- Arrays & views: `isArray`, `isArrayBufferView`, `isTypedArray`, each concrete `*Array`, `isDataView`
- Collections & objects: `isObject`, `isMap`, `isSet`, `isWeakMap`, `isWeakSet`, `isRecord`
- Emptiness: `isEmptyString`, `isEmptyArray`, `isEmptyObject`, `isEmptyMap`, `isEmptySet`, `isNonEmptyString`, `isNonEmptyArray`, `isNonEmptyObject`, `isNonEmptyMap`, `isNonEmptySet`
- Function introspection: `isZeroArg`, `isAsyncFunction`, `isGeneratorFunction`, `isAsyncGeneratorFunction`, `isPromiseFunction`, `isZeroArgAsync`, `isZeroArgGenerator`, `isZeroArgAsyncGenerator`, `isZeroArgPromise`
- Schema & combinators: `arrayOf`, `tupleOf`, `objectOf` (second param `optional` supports `true` or a key array), `mapOf`, `setOf`, `recordOf`, `iterableOf`, `literalOf`, `enumOf`, `keyOf`, `pickOf`, `omitOf`, `andOf`, `orOf`, `notOf`, `complementOf`, `unionOf`, `intersectionOf`, `composedOf`, `whereOf`, `lazyOf`, `transformOf`, `nullableOf`, `instanceOf`

Each function accepts `unknown` (or the relevant supertype) and returns a precise `x is T` predicate for meaningful narrowing.

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
node --version
```

## Contributing

We value determinism, strict typing, and small, composable APIs. See guides/contribute.md for principles and workflow.

## License

MIT © Orkestrel
