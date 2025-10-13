import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getTag, isNull, isUndefined, isDefined, isString, isNumber, isInteger, isSafeInteger, numberInRange, isNonNegativeNumber, isPositiveNumber, isBoolean, isBigInt, isSymbol, isFunction, isAsyncFunction, isZeroArg, isDate, isRegExp, isError, isPromiseLike, } from '../src/primitives.js';
test('getTag basics', () => {
    assert.equal(getTag([]), '[object Array]');
    assert.equal(getTag(new Date()), '[object Date]');
});
test('null/undefined/defined', () => {
    assert.equal(isNull(null), true);
    assert.equal(isUndefined(undefined), true);
    assert.equal(isDefined(0), true);
    assert.equal(isDefined(null), false);
});
test('strings and numbers', () => {
    assert.equal(isString('a'), true);
    assert.equal(isNumber(1), true);
    assert.equal(isNumber(NaN), false);
    assert.equal(isInteger(3), true);
    assert.equal(isInteger(3.1), false);
    assert.equal(isSafeInteger(Number.MAX_SAFE_INTEGER), true);
    assert.equal(numberInRange(1, 3)(2), true);
    assert.equal(isNonNegativeNumber(0), true);
    assert.equal(isPositiveNumber(1), true);
    assert.equal(isPositiveNumber(0), false);
});
test('booleans/bigint/symbol/function', () => {
    assert.equal(isBoolean(false), true);
    assert.equal(isBigInt(1n), true);
    assert.equal(isSymbol(Symbol('x')), true);
    const f = (a) => a;
    assert.equal(isFunction(f), true);
    assert.equal(isZeroArg(() => 1), true);
    assert.equal(isZeroArg(((x) => x)), false);
});
test('async function, objects', () => {
    assert.equal(isAsyncFunction(async () => { }), true);
    assert.equal(isAsyncFunction(() => Promise.resolve(1)), false);
    assert.equal(isDate(new Date()), true);
    assert.equal(isRegExp(/x/), true);
    assert.equal(isError(new Error('x')), true);
});
test('promise-like', () => {
    const thenable = { then: (r) => r(1) };
    assert.equal(isPromiseLike(Promise.resolve(1)), true);
    assert.equal(isPromiseLike(thenable), true);
    assert.equal(isPromiseLike(1), false);
});
//# sourceMappingURL=primitives.test.js.map