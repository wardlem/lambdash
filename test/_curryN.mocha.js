var assert = require('assert');

var _curryN = require('../src/internal/_curryN');
var _ = require('../src/internal/_blank');

describe('_curryN', function() {
    it('should create a curried function', function() {
        var fn = _curryN(2, function(a, b) {
            return a + b;
        });

        assert.equal(fn.length, 2);

        var fn1 = fn(1);
        assert.equal(typeof fn1, 'function');
        assert.equal(fn1.length, 1);

        assert.equal(fn1(2), 3);
        assert.equal(fn1(3), 4);

        assert.equal(fn(2,3), 5);
        assert.equal(fn(5)(6), 11);
    });

    it('should allow a blank to be inserted to delay application of an argument', function() {
        var fn = _curryN(3, function(a, b, c) {
            return a + b + c;
        });

        assert.equal(fn.length, 3);

        var fn1 = fn('a');
        assert.equal(typeof fn1, 'function');
        assert.equal(fn1.length, 2);

        var fn2 = fn1('b');
        assert.equal(typeof fn2, 'function');
        assert.equal(fn2.length, 1);

        var fn3 = fn2('c');
        assert.equal(typeof fn3, 'string');
        assert.equal(fn3, 'abc');

        assert.equal(fn('a', 'b', 'c'), 'abc');
        assert.equal(fn('a', 'b')('c'), 'abc');
        assert.equal(fn('a')('b', 'c'), 'abc');
        assert.equal(fn('a')('b')('c'), 'abc');
        assert.equal(fn()()()()('a')()()()('b')()()()('c'), 'abc');



        var b1 = fn(_, _, 'c');
        assert.equal(typeof b1, 'function');
        assert.equal(b1.length, 2);
        var b2 = b1(_, 'b');
        assert.equal(typeof b2, 'function');
        assert.equal(b2.length, 1);
        var b3 = b2('a');
        assert.equal(typeof b3, 'string');
        assert.equal(b3, 'abc');

        assert.equal(fn('a', _, 'c')('b'), 'abc');
        assert.equal(fn(_, _, 'c')(_, 'b')('a'), 'abc');
    });
});
