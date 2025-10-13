import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isObject, isRecord, hasOwn, hasOnlyKeys, keyOf, hasNo } from '../src/objects.js';
import { assertHasNo } from '../src/assert.js';
test('isObject and isRecord', () => {
    assert.equal(isObject({}), true);
    assert.equal(isObject(null), false);
    assert.equal(isRecord({}), true);
    assert.equal(isRecord([]), false);
});
test('hasOwn with prototype-less objects', () => {
    const o = Object.create(null);
    o.x = 1;
    assert.equal(hasOwn(o, 'x'), true);
    assert.equal(hasOwn(o, 'y'), false);
});
test('hasOnlyKeys exactness', () => {
    assert.equal(hasOnlyKeys({ a: 1, b: 2 }, 'a', 'b'), true);
    assert.equal(hasOnlyKeys({ a: 1 }, 'a', 'b'), false);
    assert.equal(hasOnlyKeys({}), true);
});
test('keyOf guard', () => {
    const isSeverity = keyOf({ info: 1, warn: 2, error: 3 });
    assert.equal(isSeverity('warn'), true);
    assert.equal(isSeverity('oops'), false);
});
test('hasNo and assertHasNo', () => {
    const o = { a: 1 };
    assert.equal(hasNo(o, 'b', 'c'), true);
    assert.equal(hasNo(o, 'a'), false);
    assert.doesNotThrow(() => assertHasNo(o, 'b', 'c'));
    try {
        assertHasNo(o, 'a', { path: ['obj'] });
        assert.fail('should throw');
    }
    catch (e) {
        const err = e;
        assert.match(err.message, /without keys/i);
        assert.match(err.message, /obj/);
    }
});
//# sourceMappingURL=objects.test.js.map