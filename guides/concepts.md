# Concepts

Core ideas you’ll use daily: guards, combinators, and schema/builders.

Guards (validate unknown, narrow precisely)
- Guard<T> is a function `(x: unknown) => x is T`
- Primitives: `isString`, `isNumber` (typeof), `isBoolean`, `isBigInt`, `isSymbol`, `isFunction`, `isDate`, `isRegExp`, `isError`, `isPromiseLike`, `isPromise`, `isArrayBuffer`, `isSharedArrayBuffer`, `isIterable`, `isAsyncIterator`
- Arrays/views: `isArray`, `isArrayBufferView`, typed arrays (`isInt8Array`, `isUint8Array`, `isUint8ClampedArray`, `isInt16Array`, `isUint16Array`, `isInt32Array`, `isUint32Array`, `isFloat32Array`, `isFloat64Array`, `isBigInt64Array`, `isBigUint64Array`), `isDataView`
- Function introspection: `isZeroArg`, `isAsyncFunction`, `isGeneratorFunction`, `isAsyncGeneratorFunction`, `isZeroArgAsync`, `isZeroArgGenerator`, `isZeroArgAsyncGenerator`
- Objects: `isObject` (primitive object: non‑null, arrays allowed), `isRecord` (plain object with string keys); `keyOf` derives a guard from object keys
- Arrays/Collections: `isArray`; `arrayOf`, `tupleOf`, `recordOf`; `isMap`/`isSet` + `mapOf`/`setOf`, `iterableOf`
- Numbers: compose predicates or add domain helpers in your project as needed
- Emptiness: `isEmptyString`, `isEmptyArray`, `isEmptyObject`, `isEmptyMap`, `isEmptySet` and non‑empty counterparts

Combinators (compose without DSLs)
- `literalOf(...literals)` — one‑of literal unions
- `enumOf(Enum)` — guard TS enum values
- `andOf`, `orOf`, `notOf`, `complementOf`, `unionOf`, `intersectionOf`, `composedOf`
- `whereOf` — confirm a predicate on a known base type (preserves the base type)
- `lazyOf` — for recursive types
- `transformOf` — validate a projection while preserving the base type
- `nullableOf` — allow `null` in addition to values accepted by a guard

Schema and object builders
- `objectOf(shape, optional?)` — exact‑by‑default object shape from property guards; `optional` can be `true` (all optional) or a readonly array of optional keys
- `arrayOf(elemGuard)` — array with element guard
- `tupleOf(...guards)` — fixed‑length tuple
- `mapOf(keyGuard, valueGuard)` / `setOf(elemGuard)` — Map/Set with guarded entries
- `recordOf(shape, optional?)` — exact record (string keys only) with optional keys
- `iterableOf(elemGuard)` — Iterable with guarded elements

Typing ethos and TSDoc
- Strict types, no `any`, no non‑null assertions; narrow from `unknown`
- Readonly‑friendly outputs; avoid mutation in helpers
- TSDoc on exported functions with concise, copy‑pasteable examples using `ts` fences
