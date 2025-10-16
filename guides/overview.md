# @orkestrel/validator overview

A tiny, TypeScript‑first library for runtime validation and narrowing with deterministic deep checks.

What it gives you
- Strongly-typed guards that accept unknown and narrow precisely
- Combinators to build complex shapes from small pieces
- Schema and object builders for ergonomic shape checks
- Domain guards for common ecosystem data (UUID, ISO dates, URLs, MIME, etc.)
- Deep structural checks (equality and clone verification), cycle-safe
- Emptiness and opposite predicates (not, hasNo) for crisp invariants

Highlights
- TypeScript-first, ESM-only, strict by default
- Honest types: no any, no non-null assertions, narrow from unknown
- Portable: browser + Node compatible; tests use Vitest
- Deterministic behavior: options and ordering are explicit and stable

Modules at a glance
- Primitives: isString, isNumber (finite), isBoolean, isFunction, isAsyncFunction, isDate, …
- Objects: isObject, isRecord, hasOwn, hasOnlyKeys, hasNo, keyOf
- Arrays & collections: isArray, arrayOf, tupleOf, recordOf, isMap, isSet, mapOf, setOf
- Strings & numbers: regex/length helpers, ASCII/alphanumeric, IPv4/hostname, intInRange, multiple-of
- Combinators: literalOf, and/or/not, union/intersection, optional/nullable, lazy, refine, discriminatedUnion, fromNativeEnum
- Schema & builders: hasSchema, hasPartialSchema, objectOf (optional/exact/rest)
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
