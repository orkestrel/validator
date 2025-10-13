# Concepts

Core ideas you’ll use daily: guards, assertions, combinators, schema/builders, diagnostics, and deep checks.

Guards (validate unknown, narrow precisely)
- Guard<T> is a function (x: unknown) => x is T
- Primitives: isString, isNumber (finite), isBoolean, isFunction, isAsyncFunction, isDate, isRegExp, isError, isPromiseLike
- Objects: isObject, isRecord; keys: hasOwn, hasOnlyKeys, hasNo; keyOf derives a guard from object keys
- Arrays/Collections: isArray; arrayOf, nonEmptyArrayOf, tupleOf, recordOf; isMap/isSet + mapOf/setOf
- Strings/Numbers: stringMatching, stringMin/Max/Between, isLowercase/Uppercase, isAlphanumeric, isAscii, isHexColor, isIPv4String, isHostnameString; intInRange, isMultipleOf

Assertions (fail-fast with diagnostics)
- assertX variants mirror guards and throw TypeError with structured metadata
- Deep variants (arrays/records/schema) pinpoint failing indices/keys via path

Combinators (compose without DSLs)
- literalOf(...literals): one-of literal unions
- and/or/not (isNot alias), unionOf, intersectionOf
- optionalOf, nullableOf for partial/nullable shapes
- lazy for recursive types, refine for subtyping
- discriminatedUnion('kind', { circle: guard, rect: guard })
- fromNativeEnum(Enum) to guard TS enums

Schema and object builders
- hasSchema(obj, schema): declarative object validation with static inference
- hasPartialSchema: like hasSchema but keys are optional
- objectOf(guards, { optional, exact, rest }): runtime builder + precise types

Diagnostics (LLM- and human-friendly)
- createTypeError(expected, received, { path, label, hint, helpUrl }) creates rich TypeErrors:
  - Message: expected, location (path), label, received type/tag/preview, optional hint/help
  - Metadata: { expected, path, label, receivedType, receivedTag, receivedPreview, hint, helpUrl }
- pathToString(['meta','tags',1,'id']) → "meta.tags[1].id"
- extendPath to build nested locations incrementally

Deep structural checks
- isDeepEqual(a, b, { strictNumbers, compareSetOrder, compareMapOrder })
  - Cycle-safe; supports Array/Object/Date/RegExp/ArrayBuffer/DataView/TypedArrays/Map/Set
- isDeepClone(a, b, { allowSharedFunctions, allowSharedErrors, ...deepOptions })
  - Like isDeepEqual, plus verifies no shared object references anywhere
- Assertions: `assertDeepEqual` / `assertDeepClone`

Emptiness and opposites
- isEmpty: string/array/map/set/object checks unified
- isEmptyString/Array/Object/Map/Set and non-empty counterparts
- hasNo: object owns none of the given keys
- assertEmpty, assertHasNo, assertNot for fail-fast invariants

Domain guards (ecosystem-friendly)
- UUIDv4, ISO date/date-time (RFC3339 subset), email (pragmatic), URL/HTTP URL, port number, MIME type, slug, base64, hex (with options), semver, JSON string/value, HTTP methods

Typing ethos and TSDoc
- Strict types, no any, no non-null assertions; narrow from unknown
- Readonly-friendly outputs; avoid mutation in helpers
- TSDoc on exported functions with concise, copy-pasteable examples using ts fences
- No TSDoc banners on types/interfaces; keep internal comments minimal

