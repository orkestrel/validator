# @orkestrel/validator overview

A tiny, TypeScript‑first library for runtime validation and narrowing with deterministic deep checks.

What it gives you
- Strongly-typed guards that accept unknown and narrow precisely
- Combinators to build complex shapes from small pieces
- Schema and object builders for ergonomic shape checks
- Domain guards for common ecosystem data (UUID, ISO dates, URLs, MIME, etc.)
- Deep structural checks (equality and clone verification), cycle-safe
- Emptiness and opposite predicates (not) for crisp invariants

Highlights
- TypeScript-first, ESM-only, strict by default
- Honest types: no any, no non-null assertions, narrow from unknown
- Portable: browser + Node compatible; tests use Vitest
- Deterministic behavior: options and ordering are explicit and stable

Modules at a glance
- Primitives: isString, isNumber (finite), isBoolean, isFunction, isAsyncFunction, …
- Function introspection: isZeroArg, isAsyncFunction, isGeneratorFunction, isAsyncGeneratorFunction, isPromiseFunction, isZeroArgAsync, isZeroArgGenerator, isZeroArgAsyncGenerator, isZeroArgPromise
- Objects: isObject, isRecord, keyOf
- Arrays & collections: isArray, arrayOf, tupleOf, recordOf, isMap, isSet, mapOf, setOf, iterableOf
- Strings & numbers: matchOf, stringOf, numberOf, isLowercase, isUppercase, isAlphanumeric, isAscii, isHexColor, isIPv4String, isIPv6String, isHostnameString
- Size/length/count: lengthOf, sizeOf, countOf, minOf, maxOf, rangeOf, measureOf, multipleOf
- Combinators: literalOf, andOf, orOf, notOf, complementOf, unionOf, intersectionOf, optionalOf, nullableOf, lazyOf, whereOf, discriminatedUnionOf, enumOf, emptyOf, nonEmptyOf
- Schema & builders: isSchema; optionalOf/objectOf for optional/exact/rest behavior (objectOf is exact by default; use rest to allow extras)
- Domains: UUIDv4, ISO dates, email, URL/HTTP URL, port, MIME, slug, base64, hex, semver, JSON, HTTP methods
- Deep checks: isDeepEqual, isDeepClone, and diagnostic-oriented deepCompare
- Emptiness: isEmpty (+ specific) and non-empty counterparts

See also
- Start: installation and a 5‑minute guided try
- Concepts: guards, combinators, schema/builders, deep checks
- Examples: copy‑paste snippets solving common tasks
- Tips: composition patterns, trade-offs, and gotchas
- Tests: conventions for fast, deterministic tests
- FAQ: quick answers and edge-case behavior

API reference can be generated with TypeDoc if you want a browsable index of public symbols.
