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
import { isNumber, isRange } from '@orkestrel/validator'

const env: unknown = { PORT: 8080, ALLOWED: ['a','b'] }
const isValidPort = (x: unknown): x is number => isNumber(x) && isRange(1, 65535)(x)

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
import { literalOf, discriminatedUnionOf, objectOf, isNumber } from '@orkestrel/validator'

const isCircle = objectOf({ kind: literalOf('circle'), r: isNumber }, { exact: true })
const isRect = objectOf({ kind: literalOf('rect'), w: isNumber, h: isNumber }, { exact: true })
const isShape = discriminatedUnionOf('kind', { circle: isCircle, rect: isRect } as const)

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
import { objectOf, literalOf, stringMatchOf, isURL } from '@orkestrel/validator'

const isHeaderName = stringMatchOf(/^[A-Za-z0-9-]+$/)
const isHeaders = objectOf({ }, { rest: isHeaderName }) // any key -> header name; simplistic example
const isRequest = objectOf(
  { method: literalOf('GET','POST','PUT','PATCH','DELETE' as const), url: isURL, headers: isHeaders },
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
  isRecord,
  isNonEmptyString,
  isNonEmptyArray,
  isNonEmptyObject,
  isEmpty,
  emptyOf,
  nonEmptyOf,
  isString,
  arrayOf,
  isNumber,
} from '@orkestrel/validator'

function validateInput(input: unknown) {
  if (!isRecord(input)) throw new TypeError('object required')
  const { name, items, metadata, processed } = input

  if (!isNonEmptyString(name)) throw new TypeError('name required')
  if (!isNonEmptyArray(items)) throw new TypeError('items must be non-empty')
  if (!isNonEmptyObject(metadata)) throw new TypeError('metadata must be non-empty')
  if (!isEmpty(processed)) throw new TypeError('processed must be empty')
}

// Combinator variants
const maybeEmptyString = emptyOf(isString) // accepts '' or non-empty string
const nonEmptyNumbers = nonEmptyOf(arrayOf(isNumber)) // requires non-empty array
```

Function introspection
```ts
import {
  isZeroArg,
  isAsyncFunction,
  isGeneratorFunction,
  isAsyncGeneratorFunction,
  isPromiseFunction,
  isZeroArgAsync,
  isZeroArgGenerator,
  isZeroArgAsyncGenerator,
  isZeroArgPromise,
} from '@orkestrel/validator'

const f1 = () => 1
const f2 = (x: number) => x
const f3 = async () => 1
const f4 = function* () { yield 1 }
const f5 = async function* () { yield 1 }
const f6 = () => Promise.resolve(1)

console.log(isZeroArg(f1))                 // true - no parameters
console.log(isZeroArg(f2))                 // false - has parameter
console.log(isAsyncFunction(f3))           // true - native async function
console.log(isGeneratorFunction(f4))       // true - generator function
console.log(isAsyncGeneratorFunction(f5))  // true - async generator
console.log(isPromiseFunction(f6))         // true - returns Promise (heuristic)
console.log(isZeroArgAsync(f3))            // true - zero-arg async
console.log(isZeroArgGenerator(f4))        // true - zero-arg generator
console.log(isZeroArgAsyncGenerator(f5))   // true - zero-arg async generator
console.log(isZeroArgPromise(f6))          // true - zero-arg Promise-returning
```

Size and range constraints
```ts
import {
  lengthOf,
  sizeOf,
  countOf,
  minOf,
  maxOf,
  rangeOf,
  measureOf,
  multipleOf,
  isNumber,
} from '@orkestrel/validator'

// Exact constraints
const twoChars = lengthOf(2)      // string or array with length 2
const twoItems = sizeOf(2)        // Map or Set with size 2
const twoProps = countOf(2)       // object with 2 enumerable properties

// Range constraints (work across number/string/array/map/set/object)
const atLeast5 = minOf(5)         // measure >= 5
const atMost10 = maxOf(10)        // measure <= 10
const between1And10 = rangeOf(1, 10) // measure in [1, 10]

// Unified measure (exact value across all supported shapes)
const measureTwo = measureOf(2)   // number 2, string length 2, array length 2, etc.

// Numeric constraints
const evenNumber = multipleOf(2)  // checks x % 2 === 0
const divisibleBy3 = multipleOf(3)

console.log(twoChars('ab'))           // true
console.log(atLeast5([1,2,3,4,5]))    // true
console.log(between1And10('hello'))   // true (length 5)
console.log(measureTwo(2))            // true (number value)
console.log(measureTwo([1, 2]))       // true (array length)
console.log(evenNumber(10))           // true
```
