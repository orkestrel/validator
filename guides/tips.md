# Tips

Practical guidance for composition, typing, and trade-offs.

Typing and narrowing
- Accept unknown at the edges; narrow progressively with guards
- Prefer readonly outputs and avoid mutation in helpers
- Use whereOf to confirm predicates on a known base type (e.g., non-empty string) while preserving the original type; use optionalOf/nullableOf for partials

Composition patterns
- Build small guard pieces and combine with andOf/orOf/unionOf
- Use literalOf for enums of strings/numbers/booleans; enumOf for TS enums
- For recursive shapes, wrap guards with lazyOf
- For maps/sets, prefer order-insensitive checks unless order matters; enable compareMapOrder / compareSetOrder when needed

Negation and exclusion (typed, one-liners)
- Simple negation when you only know “not this”:
  - `const notString = notOf(isString)` // Guard<unknown>
- Typed exclusion when you know the base set:
  - `const notCircle = complementOf(isShape, isCircle)` // Guard<Exclude<Shape, Circle>>
- Exclude multiple variants in one line with unionOf:
  - `const notCircleOrRect = complementOf(isShape, unionOf(isCircle, isRect))`

Combinator typing guarantees (at a glance)
- `andOf<A, B>(A, B)` → Guard<A & B>
- `orOf<A, B>(A, B)` → Guard<A | B>
- `unionOf(g1, g2, ...)` → Guard<T1 | T2 | ...>
- `intersectionOf(g1, g2, ...)` → Guard<T1 & T2 & ...>
- `optionalOf<T>(g)` → Guard<T | undefined>
- `nullableOf<T>(g)` → Guard<T | null>
- `whereOf<T>(base, predicate)` → Guard<T> (predicate confirms facts without changing the static type)
- `notOf(exclude)` → Guard<unknown>; `complementOf(base, exclude)` → Guard<Exclude<Base, Excluded>>

Schema vs objectOf
- hasSchema: simple, declarative, “string” primitives + nested guards
- objectOf: programmatic builder with optional keys, exactness, and “rest” guards; precise static types
- Use hasPartialSchema when keys are optional

Diagnostics in practice
- Provide path and label at the highest-level boundary (payload, env, config)
- Add hints when a common fix exists; reserve helpUrl for external docs
- Don’t leak secrets or large payloads; previews are intentionally short

Deep checks
- isDeepEqual for snapshots/deduping; isDeepClone for immutability checks
- Allow shared functions/errors in clone checks unless you must enforce complete separation
- Consider ordered options when comparing streams or append-only sets

Performance
- Prefer cheap checks in hot paths; move heavy deep comparisons away from main execution loops
- Unordered Map/Set comparisons are O(n²); use ordered modes where possible
- Avoid traversing very large graphs unless necessary; fail fast on length/size mismatches
