# Start

Install
```sh
npm install @orkestrel/validator
```

Prerequisites
- Node.js 18+ (for tests) and TypeScript 5+
- ESM-only; bundlers or modern Node resolve “moduleResolution: bundler”

Quick try: narrow unknown JSON and assert
```ts
import {
  isRecord, isString, arrayOf,
  assertRecord, assertArrayOf, assertSchema,
} from '@orkestrel/validator'

const input: unknown = JSON.parse('{"id":"u1","tags":["x","y"],"count":1}')

if (isRecord(input) && isString(input.id) && arrayOf(isString)(input.tags)) {
  console.log(input.id, input.tags.join(','))
}

assertRecord(input, { path: ['payload'] })
assertArrayOf(input.tags, isString, { path: ['payload','tags'] })

const schema = {
  id: 'string',
  tags: (x: unknown): x is readonly string[] => Array.isArray(x) && x.every(isString),
  count: 'number',
} as const

assertSchema(input, schema, { path: ['payload'] })
```

Deep checks: equality and clone verification
```ts
import {
  isDeepEqual, isDeepClone,
  assertDeepEqual, assertDeepClone,
} from '@orkestrel/validator'

const a = { x: [1, { y: 2 }] }
const b = { x: [1, { y: 2 }] }

console.log(isDeepEqual(a, b)) // true
console.log(isDeepClone(a, b)) // true

assertDeepEqual(a, b, { path: ['state'] })
assertDeepClone(a, b, { path: ['state'] })
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
  isEmpty, isNot, isString,
  assertEmpty, assertNot, assertHasNo
} from '@orkestrel/validator'

console.log(isEmpty([]), isNot(isString)(123)) // true true
assertEmpty('', { path: ['input','name'] })
assertNot('x', isString, { path: ['should','not','be','string'] }) // throws
assertHasNo({ a: 1 }, 'b', 'c') // ok; owns none of them
```

Where next
- Concepts for a deeper mental model
- Examples for realistic snippets
- Tips for composition patterns and troubleshooting
- Tests to mirror your source and stay fast/deterministic

