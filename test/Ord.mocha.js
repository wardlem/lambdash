var assert = require('assert');

var Ord = require('../src/Ord');
var Ordering = require('../src/Ordering');
var LT = Ordering.LT;
var EQ = Ordering.EQ;
var GT = Ordering.GT;

var Bool = require('../src/Boolean');
var Num = require('../src/Number');
var Str = require('../src/String');
var Obj = require('../src/Object');
var Arr = require('../src/Array');

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

        // it('should use a default sort for functions', function() {
        //     var fn1 = function(a) {return a;};
        //     var fn2 = function(b) {return b;};
        //
        //     assert.equal(Ord.compare(fn1,fn2), Ord.compare(String(fn1),String(fn2)));
        //     assert.equal(Ord.compare(fn2,fn1), Ord.compare(String(fn2),String(fn1)));
        // });
    });

    describe('#gt', function() {
        it('should return whether or not the first value is greater than the second', function() {
            assert.equal(Ord.gt(1,1), false);
            assert.equal(Ord.gt(1,2), false);
            assert.equal(Ord.gt(2,1), true);

            assert.equal(Ord.gt('a','a'), false);
            assert.equal(Ord.gt('a','b'), false);
            assert.equal(Ord.gt('b','a'), true);
        });
    });

    describe('#lt', function() {
        it('should return whether or not the first value is greater than the second', function() {
            assert.equal(Ord.lt(1,1), false);
            assert.equal(Ord.lt(1,2), true);
            assert.equal(Ord.lt(2,1), false);

            assert.equal(Ord.lt('a','a'), false);
            assert.equal(Ord.lt('a','b'), true);
            assert.equal(Ord.lt('b','a'), false);
        });
    });

    describe('#gte', function() {
        it('should return whether or not the first value is greater than the second', function() {
            assert.equal(Ord.gte(1,1), true);
            assert.equal(Ord.gte(1,2), false);
            assert.equal(Ord.gte(2,1), true);

            assert.equal(Ord.gte('a','a'), true);
            assert.equal(Ord.gte('a','b'), false);
            assert.equal(Ord.gte('b','a'), true);
        });
    });

    describe('#lte', function() {
        it('should return whether or not the first value is greater than the second', function() {
            assert.equal(Ord.lte(1,1), true);
            assert.equal(Ord.lte(1,2), true);
            assert.equal(Ord.lte(2,1), false);

            assert.equal(Ord.lte('a','a'), true);
            assert.equal(Ord.lte('a','b'), true);
            assert.equal(Ord.lte('b','a'), false);
        });
    });

    describe('#min', function() {
        it('should return the lesser value of two', function() {
            assert.equal(Ord.min(1,1), 1);
            assert.equal(Ord.min(1,2), 1);
            assert.equal(Ord.min(2,1), 1);

            assert.equal(Ord.min('a', 'a'), 'a');
            assert.equal(Ord.min('a', 'b'), 'a');
            assert.equal(Ord.min('b', 'a'), 'a');
        });
    });

    describe('#max', function() {
        it('should return the lesser value of two', function() {
            assert.equal(Ord.max(1,1), 1);
            assert.equal(Ord.max(1,2), 2);
            assert.equal(Ord.max(2,1), 2);

            assert.equal(Ord.max('a', 'a'), 'a');
            assert.equal(Ord.max('a', 'b'), 'b');
            assert.equal(Ord.max('b', 'a'), 'b');
        });
    });


});
