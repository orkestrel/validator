# Diagnostics

This package focuses on guards and deterministic deep checks. For rich diagnostics (paths, reasons), use `deepCompare` or compose small wrappers around guards that throw `TypeError` with the context you need.

Deep diagnostics with deepCompare
- Returns `{ equal: true }` or `{ equal: false, path, reason, detail? }`
- `path` pinpoints the first mismatch (array index, object key, Map key/value slot, Set index when ordered)
- `reason` is a stable string you can branch on; `detail` adds a short hint

Example
```ts
import { deepCompare } from '@orkestrel/validator'

const r = deepCompare({ a: [1, 2] }, { a: [1, 3] }, { identityMustDiffer: false, opts: {} })
if (!r.equal) {
  console.error('Mismatch at', r.path.join('.'))
  console.error('Reason:', r.reason)
}
```

Composing your own assert wrappers
```ts
import { arrayOf, isString } from '@orkestrel/validator'

function assertArrayOfStrings(x: unknown, ctx: readonly (string | number)[]): asserts x is readonly string[] {
  if (!arrayOf(isString)(x)) {
    const path = ctx.join('.')
    throw new TypeError(`Expected array of strings at ${path}`)
  }
}
```

Best practices
- Keep messages precise and reference the nearest context (e.g., `payload.user.tags[1]`)
- Avoid invoking user code during diagnostics
- Do not include secrets in previews or logs
