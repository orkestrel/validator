# Tests

Conventions to keep tests fast and deterministic.

Principles
- Mirror source: `tests/[file].test.ts` for every `src/[file].ts`
- Use Vitest for test runner and assertions
- No mocks/fakes/spies; use real values and small scenarios
- Prefer short timers and deterministic paths when timing matters

Patterns

Mirroring source
```ts
// src/arrays.ts -> tests/arrays.test.ts
import { test, expect } from 'vitest'
import { arrayOf, isString } from '@orkestrel/validator'

test('arrayOf', () => {
  expect(arrayOf(isString)(['a','b'])).toBe(true)
  expect(arrayOf(isString)(['a', 1] as unknown[])).toBe(false)
})
```

Path-aware assertion diagnostics
```ts
import { test, expect } from 'vitest'
import { assertArrayOf, isString } from '@orkestrel/validator'

test('pinpoints failing index', () => {
  expect(() => assertArrayOf(['a', 1], isString, { path: ['payload','tags'] }))
    .toThrow(/payload\.tags\[1\]/)
})
```

Deep checks
```ts
import { test, expect } from 'vitest'
import { assertDeepEqual } from '@orkestrel/validator'

test('deep equality', () => {
  expect(() => assertDeepEqual({ a:[1] }, { a:[1] }, { path: ['state'] })).not.toThrow()
})
```

Policy
- Keep tests short and focused
- Cover happy path + key edge cases (NaN/+0/-0, cycles, Map/Set order)
- Ensure typecheck is clean alongside tests and build

