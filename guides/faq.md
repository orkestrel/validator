# FAQ

Basics

- Why does `isNumber` exclude NaN/Infinity?
  - Most runtime uses expect finite values. Use `Number.isFinite` semantics. If you need integers, use `isInteger` or `intInRange`.

- What’s the difference between `isObject` and `isRecord`?
  - `isObject` is any non-null object (arrays included). `isRecord` is non-null, non-array plain objects.

- How do I validate tuples?
  - Use `tupleOf(guardA, guardB, ...)`. It checks length and per-index guards.

- Literal unions vs enums?
  - Use `literalOf(...values)` for literal unions; `fromNativeEnum(Enum)` for TS enums (string or numeric).

Intermediate

- `hasSchema` vs `objectOf`?
  - `hasSchema` is a declarative check with primitive tags and nested guards; `objectOf` is a builder with optional/exact/rest options and strong static types.

- Why do “not” combinators return `Guard<unknown>`?
  - TypeScript cannot express the exact set complement. Use `assertNot` for fail-fast negatives or explicit positive guards for narrowing.

- What path shows up when assertions fail?
  - The nearest failing index/key (array index, object key, Map “@key/@value”, Set index in ordered mode) appended to your provided `path`.

Advanced

- Deep equality semantics: NaN and -0/+0?
  - Strict by default: +0 !== -0; NaN equals NaN. Set `strictNumbers: false` to ignore -0/+0 distinction.

- Map/Set order?
  - Unordered by default (content-based). Enable `compareMapOrder` / `compareSetOrder` for insertion-order checks.

- Class instances?
  - Compared by enumerable own state. Prototypes and non-enumerable properties are ignored.

- Async Iterable validation?
  - Guards are synchronous and boolean-returning; validating AsyncIterable would require async code. Prefer a dedicated validator function for async sequences.

- Why exclude non-enumerable keys and getters in deep checks?
  - To avoid invoking user code and keep comparisons predictable and side-effect free.

Troubleshooting

- I need richer error objects:
  - Use `AssertOptions` fields: path, label, hint, helpUrl. Errors carry structured metadata for programmatic handling.

- My Set/Map comparisons are slow:
  - Prefer “ordered” options when you can; it’s O(n) instead of O(n²) matching.

