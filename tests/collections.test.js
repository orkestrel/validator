import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isMap, isSet, isWeakMap, isWeakSet, mapOf, setOf, nonEmptySetOf } from '../src/collections.js';
import { isString, isNumber } from '../src/primitives.js';
test('isMap/isSet', () => {
    assert.equal(isMap(new Map()), true);
    assert.equal(isSet(new Set()), true);
    assert.equal(isMap({}), false);
    assert.equal(isSet([]), false);
});
test('weak collections', () => {
    assert.equal(isWeakMap(new WeakMap()), true);
    assert.equal(isWeakSet(new WeakSet()), true);
});
test('mapOf validates', () => {
    const m = new Map([[1, 'a'], [2, 'b']]);
    const g = mapOf(isNumber, isString);
    assert.equal(g(m), true);
    const bad = new Map([[1, 2]]);
    assert.equal(g(bad), false);
});
test('setOf and nonEmptySetOf', () => {
    const s = new Set(['a', 'b']);
    assert.equal(setOf(isString)(s), true);
    assert.equal(nonEmptySetOf(isString)(s), true);
    assert.equal(nonEmptySetOf(isString)(new Set()), false);
});
//# sourceMappingURL=collections.test.js.map