# Domain guards

Pragmatic, ecosystem-friendly validators (not vendor-specific). Each returns boolean and has an assertion counterpart.

Included
- isUUIDv4 — canonical v4 format
- isISODateString — YYYY-MM-DD with calendar validity (UTC)
- isISODateTimeString — RFC3339 subset with timezone (Z or ±hh:mm)
- isEmail — practical email pattern (not exhaustive RFC)
- isURLString — absolute URL per WHATWG parser
- isHttpUrlString — URL with http: or https:
- isPortNumber — integer in [1, 65535]
- isMimeType — type/subtype; case-insensitive with + and . support
- isSlug — lowercase kebab case
- isBase64String — RFC 4648 base64 with optional padding
- isHexString — hex with options { allow0x, evenLength }
- isSemver — semver 2.0.0 pattern
- isJsonString — JSON.parse-able string
- isJsonValue — runtime JSON value (null/boolean/number/string/array/object; finite numbers only)
- isHttpMethod — one of GET/HEAD/POST/PUT/DELETE/CONNECT/OPTIONS/TRACE/PATCH

Notes and caveats
- Email and MIME checks are intentionally pragmatic; rely on upstream systems for strict RFC validation when necessary
- URL checks use the platform URL; absolute URLs only
- JSON value excludes functions, undefined, symbols, and non-finite numbers (NaN/Infinity)

