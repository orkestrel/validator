# Examples

Parse JSON safely and narrow deeply
```ts
import { isRecord, isString, arrayOf, assertSchema } from '@orkestrel/validator'

const raw = '{"user":{"id":"u1","tags":["pro","beta"],"age":41}}'
const input: unknown = JSON.parse(raw)

const schema = {
  user: {
    id: 'string',
    tags: (x: unknown): x is readonly string[] => Array.isArray(x) && x.every(isString),
    age: 'number',
  },
} as const

assertSchema(input, schema, { path: ['payload'] })
// input now typed; TS understands input.user.id is string, etc.
```

Environment variables
```ts
import { isNumber, intInRange, assertSchema } from '@orkestrel/validator'

const env: unknown = { PORT: 8080, ALLOWED: ['a','b'] }
const schema = {
  PORT: (x: unknown): x is number => isNumber(x) && intInRange(1, 65535)(x),
  ALLOWED: (x: unknown): x is readonly string[] => Array.isArray(x) && x.every(s => typeof s === 'string'),
} as const

assertSchema(env, schema, { path: ['env'] }) // throws with precise path if invalid
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
import { isDeepEqual, isDeepClone, assertDeepEqual, assertDeepClone } from '@orkestrel/validator'

const a = { x: [{ v: 1 }], s: new Set([1,2,3]) }
const b = { x: [{ v: 1 }], s: new Set([3,2,1]) }

isDeepEqual(a, b) // true (Set order ignored)
assertDeepEqual(a, b)

const shared = { v: 1 }
const c = { x: shared }
const d = { x: shared }
isDeepClone(c, d) // false
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

Using assertions for fail-fast validation
```ts
import {
  assertString,
  assertNumber,
  assertArrayOf,
  assertNonEmptyString,
  assertPositiveNumber,
  assertEmailString,
  assertUUIDv4,
  assertRecord,
  isString,
} from '@orkestrel/validator'

function processUser(data: unknown) {
  // Throws TypeError with rich diagnostics if validation fails
  assertRecord(data, { path: ['user'] })
  
  const { id, email, age, tags } = data
  
  assertUUIDv4(id, { path: ['user', 'id'], label: 'User ID' })
  assertEmailString(email, { path: ['user', 'email'], label: 'Email' })
  assertPositiveNumber(age, { path: ['user', 'age'], hint: 'Age must be > 0' })
  assertArrayOf(tags, isString, { path: ['user', 'tags'] })
  
  // All assertions passed - data is now validated
  return { id, email, age, tags }
}
```

Comprehensive type narrowing with assertions
```ts
import {
  assertInteger,
  assertNonEmptyArray,
  assertMap,
  assertSet,
  assertDate,
  assertIterable,
  assertUint8Array,
} from '@orkestrel/validator'

// Type narrowing: value goes from unknown to specific types
function processData(value: unknown) {
  assertInteger(value) // value is now number (integer)
  // or
  assertNonEmptyArray(value) // value is now readonly [unknown, ...unknown[]]
  // or
  assertMap(value) // value is now ReadonlyMap<unknown, unknown>
  // or
  assertSet(value) // value is now ReadonlySet<unknown>
  // or
  assertDate(value) // value is now Date
  // or
  assertIterable(value) // value is now Iterable<unknown>
}

// Typed array assertions
function processBuffer(data: unknown) {
  assertUint8Array(data) // data is now Uint8Array
  // Work with typed data
  return data.slice(0, 10)
}
```

Emptiness and non-emptiness checks
```ts
import {
  assertNonEmptyString,
  assertNonEmptyArray,
  assertNonEmptyObject,
  assertEmptySet,
  assertRecord,
} from '@orkestrel/validator'

function validateInput(input: unknown) {
  assertRecord(input)
  
  const { name, items, metadata, processed } = input
  
  assertNonEmptyString(name) // Ensures name is not ''
  assertNonEmptyArray(items) // Ensures items has at least one element
  assertNonEmptyObject(metadata) // Ensures metadata has at least one key
  assertEmptySet(processed) // Ensures Set is empty
}
```

