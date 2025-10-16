# FAQ

Basics

- Why does `isNumber` exclude NaN/Infinity?
  - Most runtime uses expect finite values. Use `Number.isFinite` semantics. If you need integers, use `isInteger` or `isRange`.

- What’s the difference between `isObject` and `isRecord`?
  - `isObject` is any non-null object (arrays included). `isRecord` is non-null, non-array plain objects.

- How do I validate tuples?
  - Use `tupleOf(guardA, guardB, ...)`. It checks length and per-index guards.

- Literal unions vs enums?
  - Use `literalOf(...values)` for literal unions; `enumOf(Enum)` for TS enums (string or numeric).

Intermediate

- `hasSchema` vs `objectOf`?
  - `hasSchema` is a declarative check with primitive tags and nested guards; `objectOf` is a builder with optional/exact/rest options and strong static types.

- Why do “not” combinators return `Guard<unknown>` in the simple form?
  - TypeScript cannot express the exact set complement. Use `notOf(base, exclude)` to get a precise `Exclude<Base, Excluded>` when you know the base set.

- How do I exclude multiple variants?
  - Compose the excluded variants with `unionOf` and pass that to `notOf(base, exclude)`:
    ```ts
    const notCircleOrRect = notOf(isShape, unionOf(isCircle, isRect))
    ```
    This keeps the API minimal and one-liner friendly without a separate `exclude` helper.

- How can I get a path to the failing location?
  - Use `deepCompare(a, b, { identityMustDiffer, opts })` for deep diagnostics. It returns `{ equal: false, path, reason, detail? }` on first mismatch.

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
  - Compose a small assertion helper around guards or `deepCompare` that throws `TypeError` with the context you need (path, label, hint). For deep structures, use `deepCompare` to capture `path` and `reason`.

- My Set/Map comparisons are slow:
  - Prefer “ordered” options when you can; it’s O(n) instead of O(n²) matching.
