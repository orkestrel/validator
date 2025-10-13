import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isNegativeNumber, intInRange, isMultipleOf } from '../src/numbers.js';
test('isNegativeNumber', () => {
    assert.equal(isNegativeNumber(-1), true);
    assert.equal(isNegativeNumber(0), false);
});
test('intInRange', () => {
    const g = intInRange(1, 3);
    assert.equal(g(2), true);
    assert.equal(g(2.5), false);
    assert.equal(g(4), false);
});
test('isMultipleOf', () => {
    assert.equal(isMultipleOf(3)(9), true);
    assert.equal(isMultipleOf(3)(10), false);
});
//# sourceMappingURL=numbers.test.js.map