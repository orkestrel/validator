# @orkestrel/validator overview

A tiny, TypeScript‑first library for runtime validation and narrowing.

What it gives you
- Strongly‑typed guards that accept unknown and narrow precisely
- Combinators to build complex shapes from small pieces
- Schema builders for ergonomic shape checks
- Emptiness and opposite predicates for crisp invariants

Highlights
- TypeScript‑first, ESM‑only, strict by default
- Honest types: no any, no non‑null assertions, narrow from unknown
- Portable: browser + Node compatible; tests use Vitest
- Deterministic behavior: options and ordering are explicit and stable

Modules at a glance
- Primitives: `isString`, `isNumber` (typeof), `isBoolean`, `isFunction`, `isDate`, `isRegExp`, `isError`, `isPromise`, `isPromiseLike`, `isIterable`, `isAsyncIterator`, ArrayBuffer/TypedArray guards
- Function introspection: `isZeroArg`, `isAsyncFunction`, `isGeneratorFunction`, `isAsyncGeneratorFunction`, `isZeroArgAsync`, `isZeroArgGenerator`, `isZeroArgAsyncGenerator`
- Objects: `isRecord`, `keyOf`, `isObject`
- Arrays & collections: `isArray`, `arrayOf`, `tupleOf`, `recordOf`, `isMap`, `isSet`, `mapOf`, `setOf`, `iterableOf`
- Combinators: `literalOf`, `enumOf`, `andOf`, `orOf`, `notOf`, `complementOf`, `unionOf`, `intersectionOf`, `composedOf`, `whereOf`, `lazyOf`, `transformOf`, `nullableOf`, `instanceOf`
- Emptiness: `isEmptyString` (+ others) and non‑empty counterparts

See also
- Start: installation and a 5‑minute guided try
- Concepts: guards, combinators, schema/builders
- Examples: copy‑paste snippets solving common tasks
- Tips: composition patterns, trade‑offs, and gotchas
- Tests: conventions for fast, deterministic tests

API reference can be generated with TypeDoc if you want a browsable index of public symbols.
