# Deep checks

Two complementary validators:

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

Assertions
- assertDeepEqual(a, b, { path, ...opts })
- assertDeepClone(a, b, { path, allowSharedFunctions, allowSharedErrors, ...opts })
- Errors point to the first mismatch path: array index, object key, Map key/value slot, Set position (ordered mode)

Semantics and performance
- Object comparison covers enumerable own keys; non-enumerable descriptors are ignored
- Class instances are compared by enumerable state; invariants/private fields are not inspected
- Unordered Map/Set matching is O(n²) worst-case; prefer ordered options when insertion order is meaningful
- Avoid invoking user code (no getters/valueOf/toString calls)

Numbers
- Strict mode: +0 !== -0; NaN equals NaN
- Non-strict: standard equality; set strictNumbers: false to ignore -0/+0 distinction

