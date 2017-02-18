var assert = require('assert');

var _ = require('../src/lambdash');

var Monoid = _.Monoid;

var Sum = _.Type.product('Sum', {val: _.Num});

Sum.empty = function() {
    return Sum(0);
};

Sum.concat = function(left, right) {
    return Sum(left.val + right.val);
};

describe('Monoid', function() {
    describe('#empty', function() {
        it('should return the empty value for a type', function() {
            assert(_.eq(Monoid.empty([]), []));
            assert.equal(Monoid.empty(Sum(1)).val, 0);
            assert.equal(Monoid.empty('abacus'), '');
        });
    });

    describe('#isEmpty', function() {
        it('should return true if the value is equal to its types empty value, false otherwise', function() {
            assert.equal(Monoid.isEmpty([]), true);
            assert.equal(Monoid.isEmpty([1]), false);
            assert.equal(Monoid.isEmpty(''), true);
            assert.equal(Monoid.isEmpty('abacus'), false);
            assert.equal(Monoid.isEmpty(Sum(0)), true);
            assert.equal(Monoid.isEmpty(Sum(12)), false);
        });
    });

    describe('#cycleN', function() {
        it('should repeat a value a specified number of times', function() {
            assert(_.eq(Monoid.cycleN(3, [1,2,3]), [1,2,3,1,2,3,1,2,3]));
            assert(_.eq(Monoid.cycleN(3, []), []));
            assert(_.eq(Monoid.cycleN(0, [1,2,3]), []));

            assert.equal(Monoid.cycleN(3, 'abc'), 'abcabcabc');
            assert.equal(Monoid.cycleN(3, ''), '');
            assert.equal(Monoid.cycleN(0, 'abc'), '');

            assert(_.eq(Monoid.cycleN(3)(Sum(3)), Sum(9)));
            assert(_.eq(Monoid.cycleN(3)(Sum(0)), Sum(0)));
            assert(_.eq(Monoid.cycleN(0)(Sum(3)), Sum(0)));
        });
    });

    describe('#member', function() {
        it('should return true if a value implements Monoid, false otherwise', function() {
            assert(Monoid.member([]));
            assert(Monoid.member('string'));
            assert(Monoid.member(Sum(7)));

            assert(!Monoid.member(4));
            assert(!Monoid.member(false));
        });
    });
});
