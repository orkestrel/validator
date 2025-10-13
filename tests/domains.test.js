import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isUUIDv4, isISODateString, isISODateTimeString, isEmail, isURLString, isHttpUrlString, isPortNumber, isMimeType, isSlug, isBase64String, isHexString, isSemver, isJsonString, isJsonValue, isHttpMethod, } from '../src/domains.js';
test('UUID v4', () => {
    assert.equal(isUUIDv4('123e4567-e89b-12d3-a456-426614174000'), true);
    assert.equal(isUUIDv4('123e4567-e89b-12d3-a456-zzzzzzzzzzzz'), false);
    assert.equal(isUUIDv4('not-a-uuid'), false);
});
test('ISO date', () => {
    assert.equal(isISODateString('2024-02-29'), true);
    assert.equal(isISODateString('2024-13-01'), false);
    assert.equal(isISODateString('2024-01-32'), false);
    assert.equal(isISODateString('2024-1-1'), false);
});
test('ISO datetime (RFC3339 subset)', () => {
    assert.equal(isISODateTimeString('2024-10-12T16:59:32Z'), true);
    assert.equal(isISODateTimeString('2024-10-12T16:59:32.123Z'), true);
    assert.equal(isISODateTimeString('2024-10-12T16:59:32+05:30'), true);
    assert.equal(isISODateTimeString('2024-10-12 16:59:32Z'), false);
    assert.equal(isISODateTimeString('not-time'), false);
});
test('Email', () => {
    assert.equal(isEmail('a@b.co'), true);
    assert.equal(isEmail('a@b'), false);
    assert.equal(isEmail('@b.com'), false);
    assert.equal(isEmail('a b@c.com'), false);
});
test('URL strings', () => {
    assert.equal(isURLString('https://example.com/x?y=1'), true);
    assert.equal(isURLString('ftp://example.com'), true);
    assert.equal(isURLString('/relative/path'), false);
    assert.equal(isHttpUrlString('https://example.com'), true);
    assert.equal(isHttpUrlString('http://example.com'), true);
    assert.equal(isHttpUrlString('ftp://example.com'), false);
});
test('Port numbers', () => {
    assert.equal(isPortNumber(1), true);
    assert.equal(isPortNumber(65535), true);
    assert.equal(isPortNumber(0), false);
    assert.equal(isPortNumber(70000), false);
    assert.equal(isPortNumber(3.14), false);
});
test('MIME types', () => {
    assert.equal(isMimeType('text/plain'), true);
    assert.equal(isMimeType('application/json'), true);
    assert.equal(isMimeType('application/vnd.api+json'), true);
    assert.equal(isMimeType('not-a-type'), false);
    assert.equal(isMimeType('/json'), false);
});
test('Slug', () => {
    assert.equal(isSlug('hello-world'), true);
    assert.equal(isSlug('Hello-World'), false);
    assert.equal(isSlug('hello_world'), false);
    assert.equal(isSlug(''), false);
});
test('Base64', () => {
    assert.equal(isBase64String(''), true);
    assert.equal(isBase64String('TWFu'), true);
    assert.equal(isBase64String('TWE='), true);
    assert.equal(isBase64String('TQ=='), true);
    assert.equal(isBase64String('@@@'), false);
});
test('Hex', () => {
    assert.equal(isHexString('deadBEEF'), true);
    assert.equal(isHexString('0xdeadbeef', { allow0x: true }), true);
    assert.equal(isHexString('abc'), true);
    assert.equal(isHexString('abc', { evenLength: true }), false);
    assert.equal(isHexString('xyz'), false);
});
test('SemVer', () => {
    assert.equal(isSemver('1.2.3'), true);
    assert.equal(isSemver('1.2.3-alpha.1+build.5'), true);
    assert.equal(isSemver('01.2.3'), false);
    assert.equal(isSemver('1.2'), false);
});
test('JSON strings and values', () => {
    assert.equal(isJsonString('{"a":1}'), true);
    assert.equal(isJsonString('{a:1}'), false);
    assert.equal(isJsonValue({ a: [1, 'x', true, null] }), true);
    assert.equal(isJsonValue({ a: [1, undefined] }), false);
    assert.equal(isJsonValue({ fn: () => { } }), false);
});
test('HTTP methods', () => {
    assert.equal(isHttpMethod('GET'), true);
    assert.equal(isHttpMethod('PATCH'), true);
    assert.equal(isHttpMethod('get'), false);
});
//# sourceMappingURL=domains.test.js.map