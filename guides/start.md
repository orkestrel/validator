# Start

Install
```sh
npm install @orkestrel/validator
```

Prerequisites
- Node.js 18+ (for tests) and TypeScript 5+
- ESM-only; bundlers or modern Node resolve “moduleResolution: bundler”

Quick try: narrow unknown JSON
```ts
import {
  isRecord, isString, arrayOf,
} from '@orkestrel/validator'

const input: unknown = JSON.parse('{"id":"u1","tags":["x","y"],"count":1}')

if (isRecord(input) && isString(input.id) && arrayOf(isString)(input.tags)) {
  console.log(input.id, input.tags.join(','))
} else {
  // Choose your preferred error strategy (throw, return Result, etc.)
}

const schema = {
  id: 'string',
  tags: (x: unknown): x is readonly string[] => Array.isArray(x) && x.every(isString),
  count: 'number',
} as const
```

Deep checks: equality, clone, and diagnostics
```ts
import {
  isDeepEqual, isDeepClone, deepCompare,
} from '@orkestrel/validator'

const a = { x: [1, { y: 2 }] }
const b = { x: [1, { y: 2 }] }

console.log(isDeepEqual(a, b)) // true
console.log(isDeepClone(a, b)) // true

// Need the first mismatch path and reason? Use deepCompare
const r = deepCompare({ a: [1, 2] }, { a: [1, 3] }, { identityMustDiffer: false, opts: {} })
if (!r.equal) {
  console.log(r.path, r.reason)
}
```

Zero-boilerplate combinators
```ts
import {
  literalOf, unionOf, and, optionalOf, isString, isNumber
} from '@orkestrel/validator'

const isId = and(isString, (s: string): s is string => s.length > 0)
const isLevel = literalOf('info','warn','error' as const)
const isMaybeCount = optionalOf(isNumber)

console.log(isLevel('warn'), isMaybeCount(undefined)) // true true
```

Emptiness and opposite checks
```ts
import {
  isEmpty, not, isString,
} from '@orkestrel/validator'

console.log(isEmpty([]), not(isString)(123)) // true true
```

Where next
- Concepts for a deeper mental model
- Examples for realistic snippets
- Tips for composition patterns and troubleshooting
- Tests to mirror your source and stay fast/deterministic
