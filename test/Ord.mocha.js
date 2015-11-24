var assert = require('assert');

var Ord = require('../src/Ord');
var Ordering = require('../src/Ordering');
var LT = Ordering.LT;
var EQ = Ordering.EQ;
var GT = Ordering.GT;

var Bool = require('../src/Bool');
var Num = require('../src/Num');
var Str = require('../src/Str');
var Obj = require('../src/Obj');
var Arr = require('../src/Arr');

describe('Ord', function() {
    describe('#compare', function() {
        it('should return a comparison result for boolean values', function() {
            assert.equal(Ord.compare(false, false), EQ);
            assert.equal(Ord.compare(false, true), LT);
            assert.equal(Ord.compare(true, false), GT);
            assert.equal(Ord.compare(true, true), EQ);
        });

        it('should return a comparison result for numerical values', function() {
            assert.equal(Ord.compare(0,0), EQ);
            assert.equal(Ord.compare(-567, 567), LT);
            assert.equal(Ord.compare(567, -567), GT);
        });

        it('should return a comparison result for string values', function() {
            assert.equal(Ord.compare('', ''), EQ);
            assert.equal(Ord.compare('a', 'a'), EQ);
            assert.equal(Ord.compare('abacus', 'abacus'), EQ);
            assert.equal(Ord.compare('abacus', 'abacur'), GT);
            assert.equal(Ord.compare('abacus', 'abacut'), LT);
            assert.equal(Ord.compare('abacus', 'abacuses'), LT);
            assert.equal(Ord.compare('abacuses', 'abacus'), GT);
            assert.equal(Ord.compare('a', ''), GT);
            assert.equal(Ord.compare('', 'a'), LT);
        });

        it('should return a comparison result for array values', function() {
            assert.equal(Ord.compare([],[]), EQ);
            assert.equal(Ord.compare([],[1]), LT);
            assert.equal(Ord.compare([1],[0]), GT);
            assert.equal(Ord.compare([1],[2]), LT);
            assert.equal(Ord.compare([[1,2,3],[4,5,6]],[[1,2,3],[4,5,6]]), EQ);
            assert.equal(Ord.compare([[1,2,3],[4,5,6]],[[1,2,3],[4,5,7]]), LT);
            assert.equal(Ord.compare([[1,2,3],[4,5,6]],[[1,2,3],[4,5,5]]), GT);
            assert.equal(Ord.compare([1,2,3,4,5,6,7],[1,2,3,4,5,6]), GT);
            assert.equal(Ord.compare([1,2,3,4,5,6],[1,2,3,4,5,6,7]), LT);
        });
    });

    describe('#isGreaterThan', function(){
        it('should return whether or not the first value is greater than the second', function(){
            assert.equal(Ord.isGreaterThan(1,1), false);
            assert.equal(Ord.isGreaterThan(1,2), false);
            assert.equal(Ord.isGreaterThan(2,1), true);

            assert.equal(Ord.isGreaterThan('a','a'), false);
            assert.equal(Ord.isGreaterThan('a','b'), false);
            assert.equal(Ord.isGreaterThan('b','a'), true);
        });
    });

    describe('#isLessThan', function(){
        it('should return whether or not the first value is greater than the second', function(){
            assert.equal(Ord.isLessThan(1,1), false);
            assert.equal(Ord.isLessThan(1,2), true);
            assert.equal(Ord.isLessThan(2,1), false);

            assert.equal(Ord.isLessThan('a','a'), false);
            assert.equal(Ord.isLessThan('a','b'), true);
            assert.equal(Ord.isLessThan('b','a'), false);
        });
    });

    describe('#isGreaterThanOrEqual', function(){
        it('should return whether or not the first value is greater than the second', function(){
            assert.equal(Ord.isGreaterThanOrEqual(1,1), true);
            assert.equal(Ord.isGreaterThanOrEqual(1,2), false);
            assert.equal(Ord.isGreaterThanOrEqual(2,1), true);

            assert.equal(Ord.isGreaterThanOrEqual('a','a'), true);
            assert.equal(Ord.isGreaterThanOrEqual('a','b'), false);
            assert.equal(Ord.isGreaterThanOrEqual('b','a'), true);
        });
    });

    describe('#isLessThanOrEqual', function(){
        it('should return whether or not the first value is greater than the second', function(){
            assert.equal(Ord.isLessThanOrEqual(1,1), true);
            assert.equal(Ord.isLessThanOrEqual(1,2), true);
            assert.equal(Ord.isLessThanOrEqual(2,1), false);

            assert.equal(Ord.isLessThanOrEqual('a','a'), true);
            assert.equal(Ord.isLessThanOrEqual('a','b'), true);
            assert.equal(Ord.isLessThanOrEqual('b','a'), false);
        });
    });

    describe('#min', function() {
        it('should return the lesser value of two', function(){
            assert.equal(Ord.min(1,1), 1);
            assert.equal(Ord.min(1,2), 1);
            assert.equal(Ord.min(2,1), 1);

            assert.equal(Ord.min('a', 'a'), 'a');
            assert.equal(Ord.min('a', 'b'), 'a');
            assert.equal(Ord.min('b', 'a'), 'a');
        });
    });

    describe('#max', function() {
        it('should return the lesser value of two', function(){
            assert.equal(Ord.max(1,1), 1);
            assert.equal(Ord.max(1,2), 2);
            assert.equal(Ord.max(2,1), 2);

            assert.equal(Ord.max('a', 'a'), 'a');
            assert.equal(Ord.max('a', 'b'), 'b');
            assert.equal(Ord.max('b', 'a'), 'b');
        });
    });


});