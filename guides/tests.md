# Tests

Conventions to keep tests fast and deterministic.

Principles
- Mirror source: `tests/[file].test.ts` for every `src/[file].ts`
- Use Vitest for test runner and assertions
- No mocks/fakes/spies; use real values and small scenarios
- Prefer short timers and deterministic paths when timing matters
- Each test file uses a single top-level `describe()` suite named after the base file
- Tests within the suite use nested `describe()` blocks for each function/feature
- Split tests into focused, individual test cases rather than bundling multiple assertions

Patterns

Mirroring source with describe structure
```ts
// src/arrays.ts -> tests/arrays.test.ts
import { describe, test, expect } from 'vitest'
import { arrayOf, isString } from '@orkestrel/validator'

describe('arrays', () => {
  describe('arrayOf', () => {
    test('validates array elements with guard', () => {
      expect(arrayOf(isString)(['a','b'])).toBe(true)
    })

    test('returns false when element fails guard', () => {
      expect(arrayOf(isString)(['a', 1] as unknown[])).toBe(false)
    })
  })
})
```

Path-aware assertion diagnostics
```ts
import { describe, test, expect } from 'vitest'
import { assertArrayOf, isString } from '@orkestrel/validator'

describe('assert', () => {
  describe('assertArrayOf', () => {
    test('pinpoints failing index in error message', () => {
      expect(() => assertArrayOf(['a', 1], isString, { path: ['payload','tags'] }))
        .toThrow(/payload\.tags\[1\]/)
    })
  })
})
```

Deep checks
```ts
import { describe, test, expect } from 'vitest'
import { assertDeepEqual } from '@orkestrel/validator'

describe('deep', () => {
  describe('assertDeepEqual', () => {
    test('does not throw for equal values', () => {
      expect(() => assertDeepEqual({ a:[1] }, { a:[1] }, { path: ['state'] })).not.toThrow()
    })
  })
})
```

Policy
- Keep tests short and focused on single behaviors
- Use descriptive test names that explain what is being tested
- Cover happy path + key edge cases (NaN/+0/-0, cycles, Map/Set order, TypedArrays)
- Ensure typecheck is clean alongside tests and build


