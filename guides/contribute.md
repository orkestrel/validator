# Contribute

A compact guide so humans and coding agents can ship high‑quality changes with confidence.

Principles (what we optimize for)
- Determinism: same inputs, same outputs; stable comparison options documented
- Strong typing: strict types with zero `any`, no non‑null assertions, honest boundaries
- Small surface: minimal, composable APIs; real use cases drive growth
- Portability: browser + Node compatible; no Node-only primitives in public APIs

Quick workflow (how to work)
1) Edit source in `src/`
2) Mirror tests in `tests/` (one test file per source file)
3) Run locally:
   - `npm run check` — typecheck everything
   - `npm test` — run unit tests with Vitest
   - `npm run build` — build ESM and types
   - `npm run format` — ESLint autofix

Project organization
- Public helpers live in focused modules under `src/` (primitives, objects, arrays, collections, combinators, schema, domains, deep, etc.)
- Shared public types are centralized in `src/types.ts`

Typing ethos (strict, helpful, honest)
- No `any`. No non‑null assertions (`!`). Avoid unsafe casts; prefer narrowing
- Validate at the edges: accept `unknown`, check, then type
- Prefer `readonly` for public outputs; avoid mutating returned values
- Keep helpers small and well‑typed; document invariants where helpful
- Do not define new `type`/`interface` declarations outside `src/types.ts`
- When adding options to a function, create a named `...Options` interface in `src/types.ts` and import it
- Type predicate design (preserving overloads)
  - Public validators that return type predicates must preserve original subtypes via generic, preserving overloads (do not widen to a generic type and lose information).
  - Provide two overloads:
      - a generic preserving overload: `fn is F` for `F extends <shape>`
      - a general/narrowing overload from `unknown`/broad input to the canonical function shape
  - Keep a single runtime implementation; do not duplicate logic.
  - TSDoc: describe behavior concisely; overload signatures themselves get a single‑line comment.

Example
```ts
// Preserve the original async function subtype when validation succeeds
export function isAsyncFunction<F extends (...args: unknown[]) => Promise<unknown>>(fn: F): fn is F
export function isAsyncFunction(fn: unknown): fn is (...args: unknown[]) => Promise<unknown>
export function isAsyncFunction(fn: unknown): boolean {
  if (typeof fn !== 'function') return false
  const name = (fn as { constructor?: { name?: unknown } }).constructor?.name
  return typeof name === 'string' && name === 'AsyncFunction'
}
```

TSDoc policy (what to document)
- Public exported classes and their public methods: full TSDoc
    - Include: description, `@param` and `@returns` with descriptions, an `@example`, and `@remarks` if helpful
    - Examples must use fenced code blocks with the `ts` language tag (```ts)
- Exported functions: full TSDoc as above
- Simple getters and setters: no `@example`. Provide a concise description and meaningful `@returns`.
- Private methods, non‑exported classes/functions, and overload signatures: use a single‑line description comment only
- Types and interfaces: keep comments concise
    - Prefer single‑line comments for type and interface declarations, especially in `src/types.ts`
    - For options interfaces, it’s okay to add short one‑line comments for the interface and its members
- TSDoc does not support dotted `@param` names (e.g., `@param opts.foo`).
- For options objects, document a single parameter for the object, and list its properties in the description or under `@remarks`.
- Do not include type annotations in JSDoc; rely on TypeScript types.
- Avoid inline object types in parameter positions for exported functions. Define a named interface in `src/types.ts` and reference it; document its fields under `@remarks`.
- Adopted style for options objects
    - Use a single `@param` for the object and describe its fields under `@remarks`.
    - Do not write dotted `@param` names. Keep property details readable as a bullet list.
    - Keep `@example` small and copy‑paste friendly.

Example
````ts
/**
 * Build an object guard from a shape of property guards.
 *
 * `props` maps property names to guards. `options.optional` may list keys that
 * are allowed to be missing. When `options.exact` is true, additional keys on
 * the object are disallowed. `options.rest` is a guard applied to any extra
 * property values when `exact` is false.
 *
 * @param props - Mapping of property names to guard functions
 * @param options - Optional configuration
 * @remarks
 * Properties on `options`:
 * - optional — readonly array of keys from `props` that may be missing
 * - exact — boolean; when true additional object keys are disallowed
 * - rest — a Guard<unknown> applied to any extra property values when `exact` is false
 * @returns A guard function that validates objects matching `props` with the given options
 * @example
 * ```ts
 * const g = objectOf({ a: (x): x is number => typeof x === 'number' })
 * g({ a: 1 }) // true
 * ```
 */
````

Consistency
- Diagnostics should be clear; deep mismatches can be collected with `deepCompare`
- Mirror test files and cover golden paths + key edge cases

API and change control
- Avoid expanding public API without concrete, multi-site need
- Prefer tiny extensions to existing shapes over new abstractions
- Keep semantics stable; evolve via narrowly scoped, additive methods with rationale

Testing conventions and QA
- Tests mirror source files: `tests/[file].test.ts`
- Use built-ins only where appropriate; prefer direct values over heavy mocks
- Cover edge cases: NaN/+0/-0, cycles, Map/Set order, path diagnostics
- Keep tests fast (seconds, not minutes)

Code of Conduct
- Be kind. Assume good intent. Discuss ideas, not people.
