# Concepts

Core ideas you’ll use daily: guards, combinators, schema/builders, diagnostics, and deep checks.

Guards (validate unknown, narrow precisely)
- Guard<T> is a function (x: unknown) => x is T
- Primitives: isString, isNumber (finite), isBoolean, isFunction, isAsyncFunction, isDate, isRegExp, isError, isPromiseLike
- Function introspection: isZeroArg, isAsyncFunction, isGeneratorFunction, isAsyncGeneratorFunction, isPromiseFunction, isZeroArgAsync, isZeroArgGenerator, isZeroArgAsyncGenerator, isZeroArgPromise
- Objects: isObject, isRecord; keyOf derives a guard from object keys
- Arrays/Collections: isArray; arrayOf, tupleOf, recordOf; isMap/isSet + mapOf/setOf, iterableOf
- Strings/Numbers: matchOf, stringOf, numberOf, isLowercase, isUppercase, isAlphanumeric, isAscii, isHexColor, isIPv4String, isIPv6String, isHostnameString
- Size/length/count: lengthOf, sizeOf, countOf, minOf, maxOf, rangeOf, measureOf, multipleOf

Combinators (compose without DSLs)
- literalOf(...literals): one-of literal unions
- andOf, orOf, notOf, complementOf, unionOf, intersectionOf
- optionalOf, nullableOf for partial/nullable shapes
- lazyOf for recursive types, whereOf for predicate confirmation that preserves the base type
- discriminatedUnionOf('kind', { circle: guard, rect: guard })
- enumOf(Enum) to guard TS enums
- emptyOf, nonEmptyOf for emptiness-aware validation
- matchOf, stringOf, numberOf for exact string/number matching
- lengthOf, sizeOf, countOf for exact size constraints
- minOf, maxOf, rangeOf for range constraints across multiple shapes
- multipleOf for numeric divisibility checks
- mapOf, setOf, recordOf, keyOf, iterableOf for collection shapes
- measureOf for unified measure checks across numbers/strings/arrays/maps/sets/objects

Negation and typed exclusion
- notOf(guard) — simple negation when you only know “not this” (returns Guard<unknown>)
- complementOf(base, exclude) — typed exclusion when you know the base set (returns Guard<Exclude<Base, Excluded>>)
- Multi-exclude in one line using unionOf: complementOf(base, unionOf(a, b))

Schema and object builders
- isSchema(obj, schema): declarative object validation with static inference
- optionalOf(shape, keys, { rest? }): mark keys optional while remaining exact by default
- objectOf(guards, { rest? }): exact-by-default shape; provide `rest` to allow extra keys’ values to be validated

Diagnostics (LLM- and human-friendly)
- For deep, structured mismatches, use deepCompare(a, b, { identityMustDiffer, opts }):
  - Returns { equal: true } or { equal: false, path, reason, detail? }
  - path pinpoints the first mismatch; reason is a stable string
- For simple guard failures, compose tiny wrappers that throw TypeError with context (path/label) as needed

Deep structural checks
- isDeepEqual(a, b, { strictNumbers, compareSetOrder, compareMapOrder })
  - Cycle-safe; supports Array/Object/Date/RegExp/ArrayBuffer/DataView/TypedArrays/Map/Set
- isDeepClone(a, b, { allowSharedFunctions, allowSharedErrors, ...deepOptions })
  - Like isDeepEqual, plus verifies no shared object references anywhere

Emptiness and opposites
- isEmpty: string/array/map/set/object checks unified
- isEmptyString, isEmptyArray, isEmptyObject, isEmptyMap, isEmptySet and non-empty counterparts
- emptyOf(guard) — allows empty values or values passing the guard
- nonEmptyOf(guard) — requires non-empty values and passing the guard
- notOf: negate a guard; use complementOf for typed exclusion within a base set

Domain guards (ecosystem-friendly)
- UUIDv4, ISO date/date-time (RFC3339 subset), email (pragmatic), URL/HTTP URL, port number, MIME type, slug, base64, hex (with options), semver, JSON string/value, HTTP methods

Typing ethos and TSDoc
- Strict types, no any, no non-null assertions; narrow from unknown
- Readonly-friendly outputs; avoid mutation in helpers
- TSDoc on exported functions with concise, copy-pasteable examples using ts fences
- No TSDoc banners on types/interfaces; keep internal comments minimal
