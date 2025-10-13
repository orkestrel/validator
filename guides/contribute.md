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

Typing ethos (strict, helpful, honest)
- No `any`. No non‑null assertions (`!`). Avoid unsafe casts; prefer narrowing
- Validate at the edges: accept `unknown`, check, then type
- Prefer `readonly` for public outputs; avoid mutating returned values
- Keep helpers small and well‑typed; document invariants where helpful

TSDoc policy (what to document)
- Exported functions: full TSDoc with description, `@param`, `@returns`, and minimal `ts` examples
- Private/non-exported helpers: single-line comments only
- Types/interfaces: no TSDoc banners

Consistency
- Examples should be minimal and copy‑paste friendly
- Diagnostics should be clear, path-aware, and include structured metadata
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

