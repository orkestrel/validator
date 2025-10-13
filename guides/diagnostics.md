# Diagnostics

All assertions throw TypeError created via `createTypeError(expected, received, options)` for human and machine-friendly debugging.

What the message contains
- Expected condition, e.g., “string” or “tuple element 1 matching guard”
- Location path (rendered) like `payload.user.tags[1].id`
- Optional label for extra context
- Received type and tag (e.g., `[object Number]`) and a safe preview
- Optional hint and helpUrl for guided fixes

Structured metadata on the error object
- expected: string
- path: readonly (string|number)[]
- label?: string
- receivedType: string
- receivedTag: string
- receivedPreview: string
- hint?: string
- helpUrl?: string

Rendering and path helpers
- pathToString(['meta','tags',1,'id']) → "meta.tags[1].id"
- extendPath(path, seg): append segments immutably while walking

Best practices
- Always provide `path` in `AssertOptions` at the callsite most aware of context (e.g., top-level “payload”)
- Use `label` to add semantic context (“User.name”)
- Add a short `hint` when a common fix exists (“Use String(value)”) 
- Prefer precise expectations (“tuple element 2 matching guard”) to generic ones
- Don’t include secrets in previews; previews are short and safe but still derived from values

