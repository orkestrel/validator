import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertString, assertNumber, assertArrayOf, assertNonEmptyArrayOf, assertRecordOf, assertTupleOf, assertSchema, assertDefined, assertDeepEqual, assertDeepClone, assertNot, assertHasNo, } from '../src/assert.js';
import { isString, isNumber } from '../src/primitives.js';
test('assertString/Number', () => {
    assert.doesNotThrow(() => assertString('x'));
    assert.doesNotThrow(() => assertNumber(42));
});
test('assertString diagnostics', () => {
    try {
        assertString(42, { path: ['payload', 'name'], label: 'User.name', hint: 'Use String(value)' });
        assert.fail('should have thrown');
    }
    catch (e) {
        const err = e;
        assert.match(err.message, /expected string/i);
        assert.match(err.message, /payload\.name/);
        assert.equal(err.hint, 'Use String(value)');
        assert.ok(Array.isArray(err.path));
    }
});
test('assertArrayOf pinpoints index', () => {
    const input = ['a', 1, 'c'];
    try {
        assertArrayOf(input, isString, { path: ['tags'] });
        assert.fail('should have thrown');
    }
    catch (e) {
        const err = e;
        assert.match(err.message, /element matching guard/i);
        assert.match(err.message, /\[1\]/);
        assert.match(err.message, /tags/);
    }
});
test('assertNonEmptyArrayOf', () => {
    assert.doesNotThrow(() => assertNonEmptyArrayOf(['a'], isString));
    try {
        assertNonEmptyArrayOf([], isString);
        assert.fail('should have thrown');
    }
    catch (e) {
        assert.match(e.message, /non-empty array/i);
    }
});
test('assertRecordOf pinpoints key', () => {
    const input = { a: 'x', b: 2 };
    try {
        assertRecordOf(input, isString, { path: ['attrs'] });
        assert.fail('should have thrown');
    }
    catch (e) {
        const err = e;
        assert.match(err.message, /property value matching guard/i);
        assert.match(err.message, /attrs\.b/);
    }
});
test('assertTupleOf pinpoints index', () => {
    const input = ['x', 2];
    try {
        assertTupleOf(input, [isString, isString], { path: ['pair'] });
        assert.fail('should have thrown');
    }
    catch (e) {
        const err = e;
        assert.match(err.message, /tuple element 1 matching guard/i);
        assert.match(err.message, /pair\[1\]/);
    }
});
test('assertSchema and assertDefined', () => {
    const schema = {
        id: 'string',
        meta: {
            tags: (_x) => Array.isArray(_x) && _x.every(isString),
            count: isNumber,
        },
    };
    const good = { id: 'x', meta: { tags: ['a', 'b'], count: 1 } };
    assert.doesNotThrow(() => assertSchema(good, schema, { path: ['user'] }));
    const bad1 = { id: 1, meta: { tags: ['a'], count: 1 } };
    try {
        assertSchema(bad1, schema, { path: ['user'] });
        assert.fail('should have thrown');
    }
    catch (e) {
        const err = e;
        assert.match(err.message, /property "id" of type string/i);
        assert.match(err.message, /user\.id/);
    }
    const v = 'x';
    assert.doesNotThrow(() => assertDefined(v));
    try {
        assertDefined(undefined);
        assert.fail('should have thrown');
    }
    catch (e) {
        assert.match(e.message, /defined value/i);
    }
});
test('assertDeepEqual/Clone', () => {
    assert.doesNotThrow(() => assertDeepEqual({ a: [1] }, { a: [1] }, { path: ['root'] }));
    try {
        assertDeepEqual({ a: [1, 2] }, { a: [1, 3] }, { path: ['root'] });
        assert.fail('should throw');
    }
    catch (e) {
        const err = e;
        assert.match(err.message, /deep equality/i);
        assert.match(err.message, /root\.a\[1\]/);
    }
    const a = { x: { y: 1 } };
    const b = { x: { y: 1 } };
    assert.doesNotThrow(() => assertDeepClone(a, b, { path: ['obj'] }));
});
test('assertNot and assertHasNo', () => {
    assert.doesNotThrow(() => assertNot('x', isNumber));
    try {
        assertNot('x', isString, { path: ['where'] });
        assert.fail('should throw');
    }
    catch (e) {
        const err = e;
        assert.match(err.message, /not/i);
        assert.match(err.message, /where/);
    }
    const o = { a: 1 };
    assert.doesNotThrow(() => assertHasNo(o, 'b', 'c'));
    try {
        assertHasNo(o, 'a', { path: ['obj'] });
        assert.fail('should throw');
    }
    catch (e) {
        assert.match(e.message, /without keys/i);
    }
});
//# sourceMappingURL=assert.test.js.map