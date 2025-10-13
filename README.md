# @orkestrel/validator

TypeScript‑first, ESM‑only runtime validators and assertion helpers with rich, LLM‑friendly diagnostics.

Principles
- Determinism: same inputs, same outputs; preserve insertion and declared dependency order
- Strong typing: strict types with zero `any`, no non‑null assertions, honest boundaries
- Small surface: minimal, composable APIs; real use cases drive growth
- Portability: browser + Node compatible by default; no Node‑only primitives in public APIs

Typing ethos
- No `any`. No non‑null assertions (`!`). Avoid unsafe casts; prefer narrowing
- Validate at the edges: accept `unknown`, check, then type
- Prefer `readonly` for public outputs; avoid mutating returned values
- Keep helpers small and well‑typed; document invariants where helpful

TSDoc policy
- Exported functions: full TSDoc with description, `@param`, `@returns`, small `ts` examples
- Types and interfaces: no TSDoc blocks (keep comments minimal)
- Private/internal helpers: single‑line description comments only
- Options objects: document a single parameter; list properties in the description; no dotted `@param` names

Install
