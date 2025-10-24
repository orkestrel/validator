# Ecosystem

This library is designed to slot into your stack with minimal friction.

Where it fits
- Libraries and services that validate inputs at boundaries (APIs, CLIs, env, configs)
- Apps that value compile-time contracts and explicit validation over inference magic
- Codebases that prefer small, composable helpers with predictable cost

Interoperability
- Works with any bundler that supports ESM and modern TypeScript targets
- Guards are runtime-only; no code generation required
- Diagnostics can be layered on top of guards via small assertion helpers tailored to your app
- Results can guide UI or API responses (e.g., mapping mismatch locations to form fields)

Typical integrations
- API servers: validate request bodies/params/headers at the edge
- Worker/CLI tools: validate config/env upfront; exit early with actionable messages
- Libraries: export guards as public contracts alongside TypeScript types

Out of scope
- Full schema DSLs or code generation; prefer composition over macro systems
- Heavyweight async validation; guards are synchronous by design

Versioning and stability
- Expect stable semantics within a major. Builder/combinator options are documented for clarity.
