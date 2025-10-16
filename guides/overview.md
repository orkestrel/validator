# @orkestrel/validator overview

A tiny, TypeScript‑first library for runtime validation and narrowing with helpful diagnostics.

What it gives you
- Strongly-typed guards that accept unknown and narrow precisely
- Comprehensive assert-style helpers: every guard has a corresponding assert function
- Assert helpers throw TypeError with rich, LLM-friendly context including path, label, hint, and help URL
- Combinators to build complex shapes from small pieces
- Schema and object builders for ergonomic shape checks
- Domain guards for common ecosystem data (UUID, ISO dates, URLs, MIME, etc.)
- Deep structural checks (equality and clone verification), cycle-safe
- Emptiness and opposite predicates (isNot, hasNo) for crisp invariants
- Full coverage: 80+ guards, 90+ assert functions, all with proper typing and TSDoc

Highlights
- TypeScript-first, ESM-only, strict by default
- Honest types: no any, no non-null assertions, narrow from unknown
- Portable: browser + Node compatible; tests use Vitest
- LLM-friendly diagnostics: errors include path, previews, and machine-readable metadata

Modules at a glance
- Primitives: isString, isNumber (finite), isBoolean, isFunction, isAsyncFunction, isDate, …
- Objects: isObject, isRecord, hasOwn, hasOnlyKeys, hasNo, keyOf
- Arrays & collections: isArray, arrayOf, tupleOf, recordOf, isMap, isSet, mapOf, setOf
- Strings & numbers: regex/length helpers, ASCII/alphanumeric, IPv4/hostname, intInRange, multiple-of
- Combinators: literalOf, and/or/not (isNot), union/intersection, optional/nullable, lazy, refine, discriminatedUnion, fromNativeEnum
- Schema & builders: hasSchema, hasPartialSchema, objectOf (optional/exact/rest)
- Domains: UUIDv4, ISO dates, email, URL/HTTP URL, port, MIME, slug, base64, hex, semver, JSON, HTTP methods
- Deep checks: isDeepEqual, isDeepClone (no shared refs), with options
- Diagnostics: createTypeError, pathToString, extendPath
- Emptiness: isEmpty (+ specific) and non-empty counterparts

See also
- Start: installation and a 5‑minute guided try
- Concepts: guards, assertions, combinators, schema/builders, diagnostics
- Examples: copy‑paste snippets solving common tasks
- Tips: composition patterns, trade-offs, and gotchas
- Tests: conventions for fast, deterministic tests
- FAQ: quick answers and edge-case behavior

API reference can be generated with TypeDoc if you want a browsable index of public symbols.

