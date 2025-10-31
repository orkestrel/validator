# Examples

Object shape
```ts
import { objectOf, isString, isNumber } from '@orkestrel/validator'

const User = objectOf({ id: isString, age: isNumber })
User({ id: 'u1', age: 1 }) // true
User({ id: 'u1', age: 1, extra: true } as unknown) // false (extra key)
```

Record shape (string keys only)
```ts
import { recordOf, isString } from '@orkestrel/validator'

const R = recordOf({ a: isString })
R({ a: 'x' }) // true
R({ a: 'x', b: 'y' } as unknown) // false
```

Iterables
```ts
import { isIterable } from '@orkestrel/validator'

isIterable('abc') // true (strings are iterable)
isIterable(new Set([1, 2])) // true
isIterable({}) // false
```

Parse JSON safely and narrow deeply
```ts
import { objectOf, arrayOf } from '@orkestrel/validator'
import { isString, isNumber } from '@orkestrel/validator'

const raw = '{"user":{"id":"u1","tags":["pro","beta"],"age":41}}'
const input: unknown = JSON.parse(raw)

const Address = objectOf({ street: isString, zip: isString })
const User = objectOf({ id: isString, tags: arrayOf(isString), age: isNumber, addr: Address }, ['addr'] as const)
const Payload = objectOf({ user: User })

if (Payload(input)) {
  // input.user is now narrowed with id/tags/age
} else {
  // handle invalid structure (throw, Result, etc.)
}
```

Environment variables
```ts
import { objectOf, arrayOf, literalOf } from '@orkestrel/validator'
import { isString, isNumber } from '@orkestrel/validator'

const env: unknown = { PORT: 8080, MODE: 'prod', ALLOWED: ['a','b'] }
const Env = objectOf({
  PORT: isNumber,
  MODE: literalOf('dev','staging','prod' as const),
  ALLOWED: arrayOf(isString),
})

if (Env(env)) {
  // env is valid
} else {
  // invalid env
}
```

Discriminated unions
```ts
import { literalOf, objectOf, unionOf } from '@orkestrel/validator'
import { isNumber } from '@orkestrel/validator'

const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber })
const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber })
const isShape = unionOf(isCircle, isRect)

function area(x: unknown): number {
  if (!isShape(x)) throw new TypeError('not a shape')
  return x.kind === 'circle' ? Math.PI * x.r * x.r : x.w * x.h
}
```

Optional with exact-by-default objects
```ts
import { objectOf } from '@orkestrel/validator'
import { isString, isNumber } from '@orkestrel/validator'

const User = objectOf({ id: isString, age: isNumber, note: isString }, ['note'] as const)
console.log(User({ id: 'u1', age: 41 })) // true
console.log(User({ id: 'u1', age: 41, extra: 1 })) // false (extra key)

const PartialUser = objectOf({ id: isString, age: isNumber }, true)
console.log(PartialUser({})) // true (all optional)
```

HTTP request guard
```ts
import { objectOf, literalOf, recordOf } from '@orkestrel/validator'
import { isString } from '@orkestrel/validator'

const isHeaderName = (x: unknown): x is string => typeof x === 'string' && /^[A-Za-z0-9-]+$/.test(x)
const isHeaders = recordOf(isString)
const isRequest = objectOf({
  method: literalOf('GET','POST','PUT','PATCH','DELETE' as const),
  url: isString,
  headers: isHeaders,
})

declare const input: unknown
if (!isRequest(input)) throw new TypeError('Invalid request')
```

Pragmatic fail-fast pattern
```ts
import { arrayOf } from '@orkestrel/validator'
import { isString } from '@orkestrel/validator'

function assertArrayOfStrings(x: unknown, ctx: string): asserts x is readonly string[] {
  if (!arrayOf(isString)(x)) {
    throw new TypeError(`${ctx}: expected array of strings`)
  }
}

// Usage
const tags: unknown = ['a', 'b']
assertArrayOfStrings(tags, 'payload.tags')
```

Combinators and enums
```ts
import { literalOf, enumOf, andOf, whereOf } from '@orkestrel/validator'
import { isString } from '@orkestrel/validator'

enum Color { Red = 'RED', Blue = 'BLUE' }
const isColor = enumOf(Color)
const nonEmptyString = andOf(isString, (s: string): s is string => s.length > 0)
const alpha2 = whereOf(isString, s => /^[A-Za-z]+$/.test(s))

console.log(isColor('RED'), nonEmptyString('x'), alpha2('ab')) // true true true
```
