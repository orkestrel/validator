# Tips

Practical guidance for composition, typing, and trade-offs.

Typing and narrowing
- Accept unknown at the edges; narrow progressively with guards
- Prefer readonly outputs and avoid mutation in helpers
- Use `whereOf` to confirm predicates on a known base type (e.g., non-empty string) while preserving the original type; use `nullableOf` for nullables

Composition patterns
- Build small guard pieces and combine with `andOf`/`orOf`/`unionOf`
- Use `literalOf` for enums of strings/numbers/booleans; `enumOf` for TS enums
- For recursive shapes, wrap guards with `lazyOf`
- For maps/sets, use `mapOf`/`setOf`; for plain objects, `recordOf`; for exact shapes, `objectOf`

Negation and exclusion (typed, one-liners)
- Simple negation when you only know “not this”:
  - `const notString = notOf(isString)` // Guard<unknown>
- Typed exclusion when you know the base set:
  - `const notCircle = complementOf(isShape, isCircle)` // Guard<Exclude<Shape, Circle>>
- Exclude multiple variants in one line with `unionOf`:
  - `const notCircleOrRect = complementOf(isShape, unionOf(isCircle, isRect))`

Combinator typing guarantees (at a glance)
- `andOf<A, B>(A, B)` → Guard<A & B>
- `orOf<A, B>(A, B)` → Guard<A | B>
- `unionOf(g1, g2, ...)` → Guard<T1 | T2 | ...>
- `intersectionOf(g1, g2, ...)` → Guard<T1 & T2 & ...>
- `nullableOf<T>(g)` → Guard<T | null>
- `whereOf<T>(base, predicate)` → Guard<T> (predicate confirms facts without changing the static type)
- `notOf(exclude)` → Guard<unknown>; `complementOf(base, exclude)` → Guard<Exclude<Base, Excluded>>

Schema builders
- `objectOf(shape, optional?)` — exact-by-default; `optional` can be `true` (all optional) or a readonly array of keys
- `arrayOf(elemGuard)`, `tupleOf(...guards)`, `recordOf(valueGuard)`
- `mapOf(keyGuard, valueGuard)`, `setOf(elemGuard)`, `iterableOf(elemGuard)`

Diagnostics
- Keep guards synchronous and boolean; layer assertions or error reporting on top when needed
- Don’t leak secrets or large payloads in messages; keep previews intentionally short

Performance
- Prefer cheap checks in hot paths; avoid heavy derived assertions in critical loops
- Avoid traversing very large graphs unless necessary; fail fast on size/length mismatches