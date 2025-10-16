# Ecosystem

This library is designed to slot into your stack with minimal friction.

Where it fits
- Libraries and services that validate inputs at boundaries (APIs, CLIs, env, configs)
- Apps that value compile-time contracts and explicit validation over inference magic
- Codebases that prefer small, composable helpers with predictable cost

Interoperability
- Works with any bundler that supports ESM and modern TypeScript targets
- Guards are runtime-only; no code generation required
- Deep diagnostics (via `deepCompare` or small wrappers) integrate with logs and error pipelines
- Results can guide UI or API responses (e.g., mapping mismatch `path` to form fields)

Typical integrations
- API servers: validate request bodies/params/headers at the edge; log mismatch paths when useful
- Worker/CLI tools: validate config/env upfront; exit early with actionable messages
- Libraries: export guards as public contracts alongside TypeScript types

Out of scope
- Full schema DSLs or code generation; prefer composition over macro systems
- Heavyweight async validation; guards are synchronous by design

Versioning and stability
- Expect stable semantics within a major. Deep-check options and domain guards are documented for clarity.
