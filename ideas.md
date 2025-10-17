# @orkestrel/validator — vNext direction (validators first, lean *Of combinators)

This document lays out a pragmatic plan to keep this package focused, small, and ergonomic: validators are the core; combinators are `*Of` builders that compose validators and other combinators. Strict typing, deterministic behavior, and a small surface area guide all decisions.

---

## Vision
- Make this package “validators + lean combinators.” Validators are tiny, single-purpose, type-narrowing `is*` checks (camelCase across the board). Combinators are guard builders named `*Of` that compose validators and other combinators.
- Keep runtime simple and predictable; keep types precise without branding or casts. “What goes in comes out with a more accurate type.”
- Keep the surface minimal; avoid specialized variants when composition can express the same constraints. Provide a few ergonomic `*Of` wrappers for common validator patterns.

## Naming and structure
- Validators: strictly `is*` camelCase naming (e.g., `isString`, `isMin`, `isRange`, `isMeasure`).
- Combinators: always named with an `*Of` suffix to signal that they build a guard from inputs: `objectOf`, `arrayOf`, `tupleOf`, `recordOf`, `literalOf`, `unionOf`, `intersectionOf`, `whereOf`, plus ergonomic/simple ones and generic measurement wrappers (see Wrapper map below).
- Utility helpers that don’t build a new guard (e.g., `tap`) are not considered combinators and need not use `*Of`.

## Package split proposal
- This package (keep name as-is):
  - Export: strict, composable validators; ergonomic, minimal `*Of` combinators. Combinators accept both validators and other combinators where applicable.
  - Do not ship assertion variants here; those live in `@orkestrel/assert`.
  - Keep deep equality/clone and stringly schema out of this core.
- New packages (depend on validators/combinators):
  1) @orkestrel/deep-compare — deterministic deep equals/clone/compare built on combinators.
  2) @orkestrel/schema — schema helpers (string/JSON-friendly) that compile to combinators.
  3) @orkestrel/assert — assertion wrappers around guards from this package, throwing `TypeError` with structured diagnostics.

## Principles
- Determinism: same inputs → same outputs. No time/locale/random side effects.
- Strict types: no `any`, no `!`, narrow from `unknown`, model nullability explicitly.
- Small surface: many small validators over mega-options; express constraints by composing validators and combinators.
- Validators: first parameter is the value; rest parameters are plain JS primitives/guards.
- Pure functions; prefer readonly outputs, do not mutate inputs. Precise generics; no branding.
- ESM-only, browser + Node compatible. No Node-only in public API.

## Core type building blocks
- Guard<T> = (value: unknown) => value is T
- Export from `src/types.ts` to aid composition.

```ts
export type Guard<T> = (value: unknown) => value is T
```

## Validators (focused, single-purpose)
- Primitives, numbers, strings, arrays/typed arrays, collections, objects, functions, domains, emptiness, and measurements follow the `is*` naming and are composed by `*Of` combinators. See Wrapper map below for ergonomic combinators that wrap these validators.

## Combinators (build guards; named `*Of`)
- Core: `intersectionOf`, `unionOf`, `complementOf` (carefully typed), `arrayOf`, `tupleOf`, `recordOf`, `objectOf`, `literalOf`, `whereOf`.
- Measurements (generic wrappers): `measureOf`, `minOf`, `maxOf`, `rangeOf`.
- Ergonomic/simple: `stringOf`, `nonEmptyOf`, and legacy numeric wrappers `lengthOf`, `sizeOf`, `countOf`.
- String wrappers: `matchOf`, `startingWithOf`, `endingWithOf`, `containingOf`.

Notes
- Avoid specialized combinators like `discriminatedUnionOf`, `exactObjectOf`, `partialObjectOf`. Express these via composition.
- Non-empty arrays/strings/collections: `nonEmptyOf(arrayOf(T))` or `minOf(arrayOf(T), 'length', 1)`; likewise for `'size'`/`'count'`.
- Exact objects: `whereOf(objectOf(shape), v => isExactKeys(v, Object.keys(shape)))`.

## Wrapper map (ergonomic/simple combinators → underlying validators)

Primitives

| Wrapper             | Validator           | Notes |
|---------------------|---------------------|-------|
| nullOf              | isNull              |       |
| undefinedOf         | isUndefined         |       |
| definedOf           | isDefined           |       |
| stringOf            | isString            |       |
| numberOf            | isNumber            |       |
| booleanOf           | isBoolean           |       |
| bigIntOf            | isBigInt            |       |
| symbolOf            | isSymbol            |       |
| functionOf          | isFunction          |       |
| dateOf              | isDate              |       |
| regExpOf            | isRegExp            |       |
| errorOf             | isError             |       |
| promiseLikeOf       | isPromiseLike       |       |
| promiseOf           | isPromise           |       |
| arrayBufferOf       | isArrayBuffer       |       |
| sharedArrayBufferOf | isSharedArrayBuffer |       |
| iterableOf          | isIterable          |       |
| asyncIteratorOf     | isAsyncIterator     |       |
| primitiveOf         | isPrimitive         |       |

Arrays and typed arrays

| Wrapper              | Validator           | Notes |
|----------------------|---------------------|-------|
| dataViewOf           | isDataView          |       |
| arrayBufferViewOf    | isArrayBufferView   |       |
| typedArrayOf         | isTypedArray        |       |
| int8ArrayOf          | isInt8Array         |       |
| uint8ArrayOf         | isUint8Array        |       |
| uint8ClampedArrayOf  | isUint8ClampedArray |       |
| int16ArrayOf         | isInt16Array        |       |
| uint16ArrayOf        | isUint16Array       |       |
| int32ArrayOf         | isInt32Array        |       |
| uint32ArrayOf        | isUint32Array       |       |
| float32ArrayOf       | isFloat32Array      |       |
| float64ArrayOf       | isFloat64Array      |       |
| bigInt64ArrayOf      | isBigInt64Array     |       |
| bigUint64ArrayOf     | isBigUint64Array    |       |

Collections

| Wrapper     | Validator | Notes |
|-------------|-----------|-------|
| mapOf       | isMap     |       |
| setOf       | isSet     |       |
| weakMapOf   | isWeakMap |       |
| weakSetOf   | isWeakSet |       |

Numbers

| Wrapper       | Validator        | Notes |
|---------------|------------------|-------|
| finiteOf      | isFiniteNumber   |       |
| integerOf     | isInteger        |       |
| safeIntegerOf | isSafeInteger    |       |
| positiveOf    | isPositiveNumber |       |
| negativeOf    | isNegativeNumber |       |

Strings

| Wrapper             | Validator       | Notes |
|---------------------|-----------------|-------|
| lowercaseOf         | isLowercase     |       |
| uppercaseOf         | isUppercase     |       |
| alphanumericOf      | isAlphanumeric  |       |
| matchOf(guard, re)  | isMatching      |       |
| startingWithOf      | isStartingWith  |       |
| endingWithOf        | isEndingWith    |       |
| containingOf        | isContaining    |       |

Functions (zero-arg variants intentionally excluded)

| Wrapper                   | Validator                | Notes |
|---------------------------|--------------------------|-------|
| asyncFunctionOf           | isAsyncFunction          |       |
| generatorFunctionOf       | isGeneratorFunction      |       |
| asyncGeneratorFunctionOf  | isAsyncGeneratorFunction |       |
| promiseFunctionOf         | isPromiseFunction        |       |

Domains

| Wrapper            | Validator        | Notes            |
|--------------------|------------------|------------------|
| uuidV4Of           | isUUIDv4         |                  |
| isoDateOf          | isISODate        |                  |
| isoDateTimeOf      | isISODateTime    |                  |
| emailOf            | isEmail          |                  |
| urlOf              | isURL            |                  |
| portOf             | isPort           |                  |
| mimeTypeOf         | isMIMEType       |                  |
| slugOf             | isSlug           |                  |
| base64Of           | isBase64         |                  |
| hexStringOf(opts?) | isHex            | forwards options |
| semverOf           | isSemver         |                  |
| jsonStringOf       | isJsonString     |                  |
| jsonValueOf        | isJsonValue      |                  |
| httpMethodOf       | isHTTPMethod     |                  |
| identifierOf       | isIdentifier     |                  |
| hostOf             | isHost           |                  |
| asciiOf            | isAscii          |                  |
| hexColorOf(opts?)  | isHexColor       | forwards options |
| ipv4StringOf       | isIPv4String     |                  |
| ipv6StringOf       | isIPv6String     |                  |
| hostnameStringOf   | isHostnameString |                  |

Emptiness

| Wrapper           | Validator | Notes                                       |
|-------------------|-----------|---------------------------------------------|
| emptyOf(guard)    | isEmpty   |                                             |
| nonEmptyOf(guard) | isEmpty   | negation or minOf(..., 1) depending on kind |

Measurements (generic; legacy wrappers kept)

| Wrapper                        | Validator family        | Notes                                             |
|--------------------------------|-------------------------|---------------------------------------------------|
| measureOf(guard, kind, n)      | isMeasure(kind, n)      | kind: 'length' | 'size' | 'count' | 'value' |
| minOf(guard, kind, min)        | isMin(kind, min)        | same kinds                                        |
| maxOf(guard, kind, max)        | isMax(kind, max)        | same kinds                                        |
| rangeOf(guard, kind, min, max) | isRange(kind, min, max) | same kinds                                        |
| lengthOf(n)                    | isLength(n)             | legacy numeric wrapper (strings/arrays/functions) |
| sizeOf(n)                      | isSize(n)               | legacy numeric wrapper (Map/Set)                  |
| countOf(n)                     | isCount(n)              | legacy numeric wrapper (objects)                  |

## Deep compare (in @orkestrel/deep-compare)
- Build deep equality/clone/compare on top of combinators, not value-vs-value primitives.

## Schema (in @orkestrel/schema)
- Provide lightweight, string/JSON friendly descriptors that compile to combinators.

## Assertions (in @orkestrel/assert)
- Provide assertion wrappers around guards from `@orkestrel/validator`.

## Typing strategy and overloads
- Validators: single signature when possible. Overloads only where they change return type meaningfully.
- Combinators: parametric on inner guards; outputs computed from inputs; prefer readonly results.

## Ergonomics
- First-arg-is-value for validators keeps usage terse in leaf checks; compose via `*Of`.

## Repo organization
- Keep: `primitives.ts`, `numbers.ts`, `strings.ts`, `arrays.ts`, `objects.ts`, `collections.ts`, `combinators.ts`, `functions.ts`, `emptiness.ts`, `domains.ts`, `measurements.ts`, `types.ts`, `index.ts`.
- Exclude from this core: deep/schema implementations (to dedicated packages).
- Ensure `index.ts` only exports validators and the minimal `*Of` combinators plus the ergonomic wrappers listed above.

## Testing strategy
- Mirror tests: `tests/[file].test.ts` per `src/[file].ts`.
- Prefer real values; deterministic assertions; validate both runtime and type inference via TSDoc examples.
- Keep runs fast; avoid randomness and long timers.

## Documentation updates
- README: position “validators first; composable, strict `*Of` combinators,” show 2-3 copyable examples.
- Add a short “Measurements” guide (length/size/count/value, including function length) with generic validators/wrappers and composition examples.
- Add a “Compose constraints, don’t specialize” guide (non-empty arrays via `nonEmptyOf`/`minOf`, exact objects via `isExactKeys`, discriminated unions via `unionOf`).

## Delivery plan (incremental)
- Phase 1: Tighten typings; add/refine validators and minimal `*Of` combinators; implement measurement validators (`isMeasure`, `isMin`, `isMax`, `isRange`) and wrappers (`measureOf`, `minOf`, `maxOf`, `rangeOf`); keep `lengthOf`/`sizeOf`/`countOf` and `nonEmptyOf`; introduce string wrappers (`matchOf`, `startingWithOf`, `endingWithOf`, `containingOf`). Add mirrored tests and examples.
- Phase 2: Implement `@orkestrel/deep-compare` built on combinators; document semantics.
- Phase 3: Implement `@orkestrel/schema` as sugar over combinators; keep zero-deps and strict typing.
- Phase 4: Publish `@orkestrel/assert` with structured diagnostics and guard-to-assert wrappers.

## Examples (sketches)

```ts
// Validators
if (isString(input) && isMin(input, 'length', 3) && isMatching(input, /^a/)) {
  // input: string (narrowed)
}

// Functions have length too
function f(a: number, b: string) {}
if (isMin(f, 'length', 2)) {
  // f.length >= 2
}

// Combinators (all *Of)
const User = objectOf({
  id: isString,
  age: intersectionOf(isNumber, whereOf(isNumber, n => n >= 0 && n <= 130)),
})

// Non-empty array via ergonomic sugar
const Users = nonEmptyOf(arrayOf(User))

// A username with length in range and pattern
const Username = intersectionOf(
  stringOf(),
  rangeOf(stringOf(), 'length', 3, 20),
  matchOf(stringOf(), /^[a-z][a-z0-9_]*$/i),
)
```

---

## Progress log
- 2025-10-17: Consolidated on `whereOf` for predicate confirmation that preserves the base type `T`. Removed mentions of “refineOf/refinementOf” from direction docs and public guides; code already exposes `whereOf` with strict, overload-backed typing and tests in `tests/combinators.test.ts`.
