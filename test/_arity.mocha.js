var assert = require('assert');

var _arity = require('../src/internal/_arity');

describe('_arity', function() {
    it('should return a function with the specified length', function() {
        var fn0 = _arity(0, function() {assert(arguments.length === 0); return 0;});
        var fn1 = _arity(1, function() {assert(arguments.length === 1); return 1;});
        var fn2 = _arity(2, function() {assert(arguments.length === 2); return 2;});
        var fn3 = _arity(3, function() {assert(arguments.length === 3); return 3;});
        var fn4 = _arity(4, function() {assert(arguments.length === 4); return 4;});
        var fn5 = _arity(5, function() {assert(arguments.length === 5); return 5;});
        var fn6 = _arity(6, function() {assert(arguments.length === 6); return 6;});
        var fn7 = _arity(7, function() {assert(arguments.length === 7); return 7;});
        var fn8 = _arity(8, function() {assert(arguments.length === 8); return 8;});
        var fn9 = _arity(9, function() {assert(arguments.length === 9); return 9;});
        var fn10 = _arity(10, function() {assert(arguments.length === 10); return 10;});
        var fn11 = _arity(11, function() {assert(arguments.length === 11); return 11;});
        var fn26 = _arity(26, function() {assert(arguments.length === 26); return 26;});


        assert.equal(fn0.length, 0);
        assert.equal(fn1.length, 1);
        assert.equal(fn2.length, 2);
        assert.equal(fn3.length, 3);
        assert.equal(fn4.length, 4);
        assert.equal(fn5.length, 5);
        assert.equal(fn6.length, 6);
        assert.equal(fn7.length, 7);
        assert.equal(fn8.length, 8);
        assert.equal(fn9.length, 9);
        assert.equal(fn10.length, 10);
        assert.equal(fn11.length, 11);
        assert.equal(fn26.length,26);

        assert.equal(fn0(), 0);
        assert.equal(fn1(0), 1);
        assert.equal(fn2(0, 1), 2);
        assert.equal(fn3(0, 1, 2), 3);
        assert.equal(fn4(0, 1, 2, 3), 4);
        assert.equal(fn5(0, 1, 2, 3, 4), 5);
        assert.equal(fn6(0, 1, 2, 3, 4, 5), 6);
        assert.equal(fn7(0, 1, 2, 3, 4, 5, 6), 7);
        assert.equal(fn8(0, 1, 2, 3, 4, 5, 6, 7), 8);
        assert.equal(fn9(0, 1, 2, 3, 4, 5, 6, 7, 8), 9);
        assert.equal(fn10(0, 1, 2, 3, 4, 5, 6, 7, 8, 9), 10);
        assert.equal(fn11(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10), 11);
        assert.equal(fn26(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25), 26);

    });
});
