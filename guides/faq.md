# FAQ

Basics

- Why does `isNumber` exclude NaN/Infinity?
  - It doesn’t. `isNumber` checks typeof only. For finite checks, compose a predicate (e.g., `x => typeof x === 'number' && Number.isFinite(x)`) or layer it via `whereOf`.

- What’s the difference between `isObject` and `isRecord`?
  - `isObject` narrows to the primitive `object` type: any non‑null object (arrays allowed). Property keys can be strings, symbols, or numbers (numbers are coerced to strings in JavaScript). Use this when you want the broad object category.
  - `isRecord` narrows to a plain object with string keys (non‑array). Use it when you want a typical dictionary shape with string keys.

- How do I validate tuples?
  - Use `tupleOf(guardA, guardB, ...)`. It checks length and per-index guards.

- Literal unions vs enums?
  - Use `literalOf(...values)` for literal unions; `enumOf(Enum)` for TS enums (string or numeric).

Intermediate

- `objectOf` vs a declarative string schema?
  - Prefer `objectOf` for programmatic, precise shapes with optional keys and exactness. Compose with `arrayOf`, `mapOf`, `setOf`, and `recordOf` as needed.

- Why do simple negation combinators return `Guard<unknown>`?
  - TypeScript cannot express the exact set complement for arbitrary types. Use `complementOf(base, exclude)` when you know the base set to get `Exclude<Base, Excluded>`.

- How do I exclude multiple variants?
  - Combine exclusions with `unionOf`:
    ```ts
    const notCircleOrRect = complementOf(isShape, unionOf(isCircle, isRect))
    ```

- Can I get a path to the failing location?
  - This package provides boolean guards. For path‑rich diagnostics, build a small assertion/diagnostic helper around the guards for your use case.

Advanced

- Map/Set order?
  - Guards validate types and elements, not ordering. If you need ordered checks, validate after conversion or via a custom predicate with `whereOf`.

- Class instances?
  - For specific classes, use `instanceOf(Ctor, value)`. For a coarse object check use `isObject`; for plain records use `isRecord`; for structural validation prefer `objectOf` and friends.

Troubleshooting

- I need richer error objects:
  - Compose a small assertion helper around guards that throws `TypeError` with the context you need (path, label, hint). Keep the guards themselves small and deterministic.
