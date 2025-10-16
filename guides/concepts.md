# Concepts

Core ideas you’ll use daily: guards, combinators, schema/builders, diagnostics, and deep checks.

Guards (validate unknown, narrow precisely)
- Guard<T> is a function (x: unknown) => x is T
- Primitives: isString, isNumber (finite), isBoolean, isFunction, isAsyncFunction, isDate, isRegExp, isError, isPromiseLike
- Objects: isObject, isRecord; keys: hasOwn, hasOnlyKeys, hasNo; keyOf derives a guard from object keys
- Arrays/Collections: isArray; arrayOf, nonEmptyArrayOf, tupleOf, recordOf; isMap/isSet + mapOf/setOf
- Strings/Numbers: stringMatching, stringMin/Max/Between, isLowercase/Uppercase, isAlphanumeric, isAscii, isHexColor, isIPv4String, isHostnameString; intInRange, isMultipleOf

Combinators (compose without DSLs)
- literalOf(...literals): one-of literal unions
- and/or/not, unionOf, intersectionOf
- optionalOf, nullableOf for partial/nullable shapes
- lazy for recursive types, refine for subtyping
- discriminatedUnion('kind', { circle: guard, rect: guard })
- fromNativeEnum(Enum) to guard TS enums

Negation and typed exclusion
- not(exclude) — simple negation when you only know “not this” (returns Guard<unknown>)
- not(base, exclude) — typed exclusion when you know the base set (returns Guard<Exclude<Base, Excluded>>)
- Multi-exclude in one line using unionOf: not(base, unionOf(a, b))

Schema and object builders
- hasSchema(obj, schema): declarative object validation with static inference
- hasPartialSchema: like hasSchema but keys are optional
- objectOf(guards, { optional, exact, rest }): runtime builder + precise types

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
- isEmptyString/Array/Object/Map/Set and non-empty counterparts
- hasNo: object owns none of the given keys
- not: negate a guard or exclude a subset with a base guard

Domain guards (ecosystem-friendly)
- UUIDv4, ISO date/date-time (RFC3339 subset), email (pragmatic), URL/HTTP URL, port number, MIME type, slug, base64, hex (with options), semver, JSON string/value, HTTP methods

Typing ethos and TSDoc
- Strict types, no any, no non-null assertions; narrow from unknown
- Readonly-friendly outputs; avoid mutation in helpers
- TSDoc on exported functions with concise, copy-pasteable examples using ts fences
- No TSDoc banners on types/interfaces; keep internal comments minimal
