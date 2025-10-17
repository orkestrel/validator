# Domain guards

Pragmatic, ecosystem-friendly validators (not vendor-specific). Each returns boolean. For fail-fast behavior, compose tiny wrappers that throw with context when a guard fails.

Included
- isUUIDv4 — canonical v4 format
- isISODate — YYYY-MM-DD with calendar validity (UTC)
- isISODateTime — RFC3339 subset with timezone (Z or ±hh:mm)
- isEmail — practical email pattern (not exhaustive RFC)
- isURL — absolute URL (conservative parser)
- isPort — integer in [1, 65535]
- isMIMEType — type/subtype; case-insensitive with + and . support
- isSlug — lowercase kebab case
- isBase64 — RFC 4648 base64 with optional padding
- isHex — hex with options { allow0x, evenLength }
- isSemver — semver 2.0.0 pattern
- isJsonString — JSON.parse-able string
- isJsonValue — runtime JSON value (null/boolean/number/string/array/object; finite numbers only)
- isHTTPMethod — one of GET/HEAD/POST/PUT/DELETE/CONNECT/OPTIONS/TRACE/PATCH

Notes and caveats
- Email and MIME checks are intentionally pragmatic; rely on upstream systems for strict RFC validation when necessary
- URL checks are conservative absolute URL parsing; absolute URLs only
- JSON value excludes functions, undefined, symbols, and non-finite numbers (NaN/Infinity)
