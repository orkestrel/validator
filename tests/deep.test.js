import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepEqual, isDeepClone } from '../src/deep.js';
import { assertDeepEqual, assertDeepClone } from '../src/assert.js';
test('isDeepEqual primitives and number edge cases', () => {
    assert.equal(isDeepEqual('a', 'a'), true);
    assert.equal(isDeepEqual(0, -0), false);
    assert.equal(isDeepEqual(NaN, NaN), true);
    assert.equal(isDeepEqual(0, -0, { strictNumbers: false }), true);
});
test('isDeepEqual arrays and nested objects', () => {
    const a = [1, { x: ['y'] }];
    const b = [1, { x: ['y'] }];
    const c = [1, { x: ['z'] }];
    assert.equal(isDeepEqual(a, b), true);
    assert.equal(isDeepEqual(a, c), false);
});
test('isDeepEqual sets and maps (unordered by default)', () => {
    const sa = new Set([1, 2, 3]);
    const sb = new Set([3, 2, 1]);
    assert.equal(isDeepEqual(sa, sb), true);
    assert.equal(isDeepEqual(sa, sb, { compareSetOrder: true }), false);
    const ma = new Map([[{ k: 1 }, 'a'], [{ k: 2 }, 'b']]);
    const mb = new Map([[{ k: 2 }, 'b'], [{ k: 1 }, 'a']]);
    assert.equal(isDeepEqual(ma, mb), true);
    assert.equal(isDeepEqual(ma, mb, { compareMapOrder: true }), false);
});
test('isDeepEqual Dates, RegExps, Buffers and TypedArrays', () => {
    assert.equal(isDeepEqual(new Date(5), new Date(5)), true);
    assert.equal(isDeepEqual(new Date(5), new Date(6)), false);
    assert.equal(isDeepEqual(/a/gi, /a/gi), true);
    assert.equal(isDeepEqual(/a/g, /a/i), false);
    const ab1 = new ArrayBuffer(4);
    const ab2 = new ArrayBuffer(4);
    new Uint8Array(ab1).set([1, 2, 3, 4]);
    new Uint8Array(ab2).set([1, 2, 3, 4]);
    assert.equal(isDeepEqual(ab1, ab2), true);
    new Uint8Array(ab2)[2] = 9;
    assert.equal(isDeepEqual(ab1, ab2), false);
    assert.equal(isDeepEqual(new Uint16Array([1, 2]), new Uint16Array([1, 2])), true);
    assert.equal(isDeepEqual(new Uint16Array([1, 2]), new Uint16Array([2, 1])), false);
});
test('isDeepClone validations', () => {
    const a = { x: { y: 1 }, z: [1, 2] };
    const b = { x: { y: 1 }, z: [1, 2] };
    assert.equal(isDeepClone(a, b), true);
    const c = { x: 1 };
    assert.equal(isDeepClone(c, c), false);
    const shared = { y: 1 };
    const d = { x: shared };
    const e = { x: shared };
    assert.equal(isDeepClone(d, e), false);
    const fn = () => 1;
    const err = new Error('x');
    const f = { fn, e: err, k: { v: 1 } };
    const g = { fn, e: err, k: { v: 1 } };
    assert.equal(isDeepClone(f, g), true);
    assert.equal(isDeepClone(f, g, { allowSharedFunctions: false }), false);
    assert.equal(isDeepClone(f, g, { allowSharedErrors: false }), false);
});
test('assertDeepEqual and assertDeepClone diagnostics', () => {
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
//# sourceMappingURL=deep.test.js.map