# Examples

Parse JSON safely and narrow deeply
```ts
import { isRecord, isString, arrayOf } from '@orkestrel/validator'

const raw = '{"user":{"id":"u1","tags":["pro","beta"],"age":41}}'
const input: unknown = JSON.parse(raw)

const schema = {
  user: {
    id: 'string',
    tags: (x: unknown): x is readonly string[] => Array.isArray(x) && x.every(isString),
    age: 'number',
  },
} as const

if (
  isRecord(input)
  && isRecord(input.user)
  && isString(input.user.id)
  && Array.isArray(input.user.tags) && input.user.tags.every(isString)
  && typeof input.user.age === 'number'
) {
  // input is now safely usable
} else {
  // handle invalid structure (throw, return Result, etc.)
}
```

Environment variables
```ts
import { isNumber, intInRange } from '@orkestrel/validator'

const env: unknown = { PORT: 8080, ALLOWED: ['a','b'] }
const isValidPort = (x: unknown): x is number => isNumber(x) && intInRange(1, 65535)(x)

if (
  isRecord(env)
  && isValidPort(env.PORT)
  && Array.isArray(env.ALLOWED) && env.ALLOWED.every(isString)
) {
  // env is valid
} else {
  // invalid env
}
```

Discriminated unions
```ts
import { literalOf, discriminatedUnion, objectOf, isNumber } from '@orkestrel/validator'

const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
const isShape = discriminatedUnion('kind', { circle: isCircle, rect: isRect } as const)

function area(x: unknown): number {
  if (!isShape(x)) throw new TypeError('not a shape')
  return x.kind === 'circle' ? Math.PI * x.r * x.r : x.w * x.h
}
```

Optional/exact/rest objectOf
```ts
import { objectOf, isString, isNumber } from '@orkestrel/validator'

const User = objectOf({ id: isString, age: isNumber, note: isString }, { optional: ['note'], exact: true })
console.log(User({ id: 'u1', age: 41 })) // true
console.log(User({ id: 'u1', age: 41, extra: 1 })) // false

const Config = objectOf({ name: isString }, { rest: isNumber })
console.log(Config({ name: 'svc', port: 8080 })) // true
```

Deep equality and clone checks
```ts
import { isDeepEqual, isDeepClone, deepCompare } from '@orkestrel/validator'

const a = { x: [{ v: 1 }], s: new Set([1,2,3]) }
const b = { x: [{ v: 1 }], s: new Set([3,2,1]) }

isDeepEqual(a, b) // true (Set order ignored)

const shared = { v: 1 }
const c = { x: shared }
const d = { x: shared }
isDeepClone(c, d) // false

// Diagnostics
const r = deepCompare({ a: [1, 2] }, { a: [1, 3] }, { identityMustDiffer: false, opts: {} })
if (!r.equal) {
  console.log(r.path) // ['a', 1]
}
```

HTTP request guard
```ts
import { objectOf, literalOf, stringMatching, isHttpUrlString } from '@orkestrel/validator'

const isHeaderName = stringMatching(/^[A-Za-z0-9-]+$/)
const isHeaders = objectOf({ }, { rest: isHeaderName }) // any key -> header name; simplistic example
const isRequest = objectOf(
  { method: literalOf('GET','POST','PUT','PATCH','DELETE' as const), url: isHttpUrlString, headers: isHeaders },
  { exact: true },
)

declare const input: unknown
if (!isRequest(input)) throw new TypeError('Invalid request')
```

Pragmatic fail-fast pattern
```ts
import { arrayOf, isString } from '@orkestrel/validator'

function assertArrayOfStrings(x: unknown, ctx: string): asserts x is readonly string[] {
  if (!arrayOf(isString)(x)) {
    throw new TypeError(`${ctx}: expected array of strings`)
  }
}

// Usage
const tags: unknown = ['a', 'b']
assertArrayOfStrings(tags, 'payload.tags')
```

Emptiness and non-emptiness checks
```ts
import {
  isNonEmptyString,
  isNonEmptyArray,
  isNonEmptyObject,
  isEmpty,
} from '@orkestrel/validator'

function validateInput(input: unknown) {
  if (!isRecord(input)) throw new TypeError('object required')
  const { name, items, metadata, processed } = input

  if (!isNonEmptyString(name)) throw new TypeError('name required')
  if (!isNonEmptyArray(items)) throw new TypeError('items must be non-empty')
  if (!isNonEmptyObject(metadata)) throw new TypeError('metadata must be non-empty')
  if (!isEmpty(processed)) throw new TypeError('processed must be empty')
}
```
