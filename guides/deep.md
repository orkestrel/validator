# Deep checks

Two complementary validators and a diagnostic helper:

isDeepEqual(a, b, opts?)
- Deep structural equality
- Cycle-safe; short-circuits on first difference
- Supports Array, Object (enumerable own keys incl. symbols), Date, RegExp, ArrayBuffer, DataView, TypedArrays, Map, Set
- Options:
  - strictNumbers (default true) — distinguish +0/-0; NaN equals NaN
  - compareSetOrder (default false) — order-sensitive Set comparison
  - compareMapOrder (default false) — order-sensitive Map comparison

isDeepClone(a, b, opts?)
- All of isDeepEqual, plus:
  - Verify the two values share no object references anywhere
  - Defaults: allow shared functions and Error objects; override with allowSharedFunctions / allowSharedErrors

Diagnostic helper: deepCompare(a, b, { identityMustDiffer, opts })
- Returns `{ equal: true }` or `{ equal: false, path, reason, detail? }`
- `identityMustDiffer: true` enables clone-style checks (no shared references)
- `path` points to the first mismatch; `reason` is a stable string; `detail` is a short hint

Examples
```ts
import { isDeepEqual, isDeepClone, deepCompare } from '@orkestrel/validator'

// Equality
isDeepEqual({ a: [1] }, { a: [1] }) // true
isDeepEqual(new Set([1,2,3]), new Set([3,2,1])) // true (unordered by default)

// Order-sensitive options
isDeepEqual(new Set([1,2,3]), new Set([3,2,1]), { compareSetOrder: true }) // false

// Clone checks
const shared = { v: 1 }
isDeepClone({ x: shared }, { x: shared }) // false (shared ref)

// Diagnostics
const r = deepCompare({ a: [1, 2] }, { a: [1, 3] }, { identityMustDiffer: false, opts: {} })
if (!r.equal) {
  // r.path -> ['a', 1]
  // r.reason -> e.g., 'valueMismatch' or a specific typed array mismatch
}
```

Semantics and performance
- Object comparison covers enumerable own keys; non-enumerable descriptors are ignored
- Class instances are compared by enumerable state; invariants/private fields are not inspected
- Unordered Map/Set matching is O(n²) worst-case; prefer ordered options when insertion order is meaningful
- Avoid invoking user code (no getters/valueOf/toString calls)

Numbers
- Strict mode: +0 !== -0; NaN equals NaN
- Non-strict: standard equality; set strictNumbers: false to ignore -0/+0 distinction
