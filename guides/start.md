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
import { isRecord, isString, arrayOf, objectOf } from '@orkestrel/validator'

const input: unknown = JSON.parse('{"id":"u1","tags":["x","y"],"count":1}')

const Payload = objectOf({ id: isString, tags: arrayOf(isString), count: (x: unknown): x is number => typeof x === 'number' })

if (Payload(input)) {
  console.log(input.id, input.tags.join(','))
} else {
  // Choose your preferred error strategy (throw, return Result, etc.)
}
```

Compose shapes with builders
```ts
import { objectOf, arrayOf, literalOf } from '@orkestrel/validator'
import { isString, isNumber } from '@orkestrel/validator'

const Address = objectOf({ street: isString, zip: isString })
const User = objectOf({ id: isString, tags: arrayOf(isString), age: isNumber, addr: Address }, ['addr'] as const)
const Payload = objectOf({ user: User })
```

Optional keys & exactness
```ts
import { objectOf } from '@orkestrel/validator'
import { isString, isNumber } from '@orkestrel/validator'

const User = objectOf({ id: isString, age: isNumber, note: isString }, ['note'] as const)
User({ id: 'u1', age: 41 }) // true
User({ id: 'u1', age: 41, extra: 1 }) // false (extra key)

const PartialUser = objectOf({ id: isString, age: isNumber }, true)
PartialUser({}) // true
```

Where next
- Concepts for a deeper mental model
- Examples for realistic snippets
- Schema for builder‑focused docs and composition patterns
- Tips for composition patterns and troubleshooting
- Tests to mirror your source and stay fast/deterministic
```
