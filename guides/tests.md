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
import { arrayOf } from '../src/arrays.js'
import { isString } from '../src/primitives.js'

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

Path-aware deep diagnostics
```ts
import { describe, test, expect } from 'vitest'
import { deepCompare } from '../src/deep.js'

describe('deep', () => {
  describe('deepCompare', () => {
    test('pinpoints failing index and reason', () => {
      const r = deepCompare({ a: [1, 2] }, { a: [1, 3] }, { identityMustDiffer: false, opts: {} })
      expect(r.equal).toBe(false)
      if (!r.equal) {
        expect(r.path).toEqual(['a', 1])
      }
    })
  })
})
```

Policy
- Keep tests short and focused on single behaviors
- Use descriptive test names that explain what is being tested
- Cover happy path + key edge cases (NaN/+0/-0, cycles, Map/Set order, TypedArrays)
- Ensure typecheck is clean alongside tests and build
