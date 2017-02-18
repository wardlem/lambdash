var assert = require('assert');

var productType = require('../src/productType');

var _ = require('../src/lambdash');

var Int = _.Int;

var Enum = require('../src/Enum');

var _arrEqual = require('../src/internal/_arrayEqual');

var Test = productType('Test', {val: Int});
Test.toInt = function(value) {
    return value.val + 1;
};
Test.fromInt = function(int) {
    return Test(int - 1);
};

describe('Enum', function() {
    describe('#toInt', function() {
        it('should return the integral value for implementing values', function() {
            assert.equal(Enum.toInt(435), 435);
            assert.equal(Enum.toInt(43.67), 43);
            assert.equal(Enum.toInt(-78.65), -78);
            assert.equal(Enum.toInt('a'), 97);
            assert.equal(Enum.toInt('apple'), 97);
            assert.equal(Enum.toInt(false), 0);
            assert.equal(Enum.toInt(true), 1);
            assert.equal(Enum.toInt(Test(1)), 2);
        });

        it('should throw an exception if given undefined', function() {
            try {
                Enum.toInt(undefined);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });

        it('should throw an exception if given null', function() {
            try {
                Enum.toInt(null);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });

        it('should throw an exception if given a value that does not implement Enum', function() {
            try {
                Enum.toInt([]);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#prev', function() {
        it('should return the previous value of the given type', function() {
            assert.equal(Enum.prev(435), 434);
            assert.equal(Enum.prev(43.67), 42);
            assert.equal(Enum.prev(-78.65), -79);
            assert.equal(Enum.prev('b'), 'a');
            assert.equal(Enum.prev('balloon'), 'a');
            // assert.equal(Enum.prev(false), true);
            assert.equal(Enum.prev(true), false);

            var prevTest = Enum.prev(Test(2));
            assert.equal(prevTest.val, 1);
        });

        it('should throw an exception if given undefined', function() {
            try {
                Enum.prev(undefined);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });

        it('should throw an exception if given null', function() {
            try {
                Enum.prev(null);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#next', function() {
        it('should return the next value of the given type', function() {
            assert.equal(Enum.next(435), 436);
            assert.equal(Enum.next(43.67), 44);
            assert.equal(Enum.next(-78.65), -77);
            assert.equal(Enum.next('b'), 'c');
            assert.equal(Enum.next('balloon'), 'c');
            assert.equal(Enum.next(false), true);
            // assert.equal(Enum.next(true), true);

            var prevTest = Enum.next(Test(2));
            assert.equal(prevTest.val, 3);
        });

        it('should throw an exception if given undefined', function() {
            try {
                Enum.next(undefined);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });

        it('should throw an exception if given null', function() {
            try {
                Enum.next(null);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#enumTo', function() {
        it('should return a enum of characters from the first up to and including the second', function() {
            assert(_arrEqual(Enum.enumTo(1,5), [1,2,3,4,5]));
            assert(_arrEqual(Enum.enumTo(3,3), [3]));
            assert(_arrEqual(Enum.enumTo(1.1, 5.4), [1,2,3,4,5]));
            assert(_arrEqual(Enum.enumTo(-45.3, -42.6), [-45, -44, -43, -42]));
            assert(_arrEqual(Enum.enumTo('a', 'e'), ['a', 'b', 'c', 'd', 'e']));
            assert(_arrEqual(Enum.enumTo(false, true), [false, true]));
            assert(_arrEqual(Enum.enumTo(false, false), [false]));
            assert(_arrEqual(Enum.enumTo(true, true), [true]));
        });

        it('should also work stepping down', function() {
            assert(_arrEqual(Enum.enumTo(5,1), [5,4,3,2,1]));
            assert(_arrEqual(Enum.enumTo(5.4, 1.1), [5,4,3,2,1]));
            assert(_arrEqual(Enum.enumTo(-42.6, -45.3), [-42, -43, -44, -45]));
            assert(_arrEqual(Enum.enumTo('e', 'a'), ['e', 'd', 'c', 'b', 'a']));
            assert(_arrEqual(Enum.enumTo(true, false), [true, false]));
        });

    });

    describe('#enumUntil', function() {
        it('should return a enum of characters from the first up to and not including the second', function() {
            assert(_arrEqual(Enum.enumUntil(1,5), [1,2,3,4]));
            assert(_arrEqual(Enum.enumUntil(3,3), []));
            assert(_arrEqual(Enum.enumUntil(1.1, 5.4), [1,2,3,4]));
            assert(_arrEqual(Enum.enumUntil(-45.3, -42.6), [-45, -44, -43]));
            assert(_arrEqual(Enum.enumUntil('a', 'e'), ['a', 'b', 'c', 'd']));
            assert(_arrEqual(Enum.enumUntil(false, true), [false]));
            assert(_arrEqual(Enum.enumUntil(false, false), []));
            assert(_arrEqual(Enum.enumUntil(true, true), []));
        });

        it('should also work stepping down', function() {
            assert(_arrEqual(Enum.enumUntil(5,1), [5,4,3,2]));
            assert(_arrEqual(Enum.enumUntil(5.4, 1.1), [5,4,3,2]));
            assert(_arrEqual(Enum.enumUntil(-42.6, -45.3), [-42, -43, -44]));
            assert(_arrEqual(Enum.enumUntil('e', 'a'), ['e', 'd', 'c', 'b']));
            assert(_arrEqual(Enum.enumUntil(true, false), [true]));
        });
    });

    describe('#enumFrom', function() {
        it('should create a enum with the specified number of elements', function() {
            assert(_arrEqual(Enum.enumFrom(4,3), [3,4,5,6]));
            assert(_arrEqual(Enum.enumFrom(5, 'a'), ['a', 'b', 'c', 'd', 'e']));
            assert(_arrEqual(Enum.enumFrom(2, false), [false, true]));
            assert(_arrEqual(Enum.enumFrom(0, 10), []));
        });

        it('should also work in reverse', function() {
            assert(_arrEqual(Enum.enumFrom(-5,3), [3,2,1,0,-1]));
            assert(_arrEqual(Enum.enumFrom(-5, 'e'), ['e', 'd', 'c', 'b', 'a']));
            assert(_arrEqual(Enum.enumFrom(-2, true), [true, false]));
        });

        it('should throw an exception if given a non integer as the count', function() {
            try {
                Enum.enumFrom(1.2, 2);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });


    });

    describe('#member', function() {
        it('should return true for a value that implements Enum false otherwise', function() {
            assert.equal(Enum.member(1), true);
            assert.equal(Enum.member(false), true);
            assert.equal(Enum.member([]), false);
            assert.equal(Enum.member({}), false);
            assert.equal(Enum.member(null), false);
            assert.equal(Enum.member(undefined), false);
        });
    });
});
