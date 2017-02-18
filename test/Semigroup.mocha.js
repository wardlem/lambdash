var assert = require('assert');

var _ = require('../src/lambdash');
var Semigroup = _.Semigroup;

var Sum = _.Type.product('Sum', {val: _.Num});

var assertEqual = function(left, right) {
    if (!_.eq(left,right)) {
        assert.fail(left, right, undefined, 'eq');
    }
};

Sum.concat = function(left, right) {
    return Sum(left.val + right.val);
};

describe('Semigroup', function() {
    describe('#concat', function() {
        it('should concatenate two semigroups together', function() {
            assertEqual(Semigroup.concat(Sum(1), Sum(2)), Sum(3));
            assertEqual(Semigroup.concat([1,2,3], [4,5,6]), [1,2,3,4,5,6]);
        });
    });

    describe('#concatAll', function() {
        it('should concatenate a foldable of values together', function() {
            var arr = [[1,2],[3,4],[5,6]];
            var obj = {
                a: [1,2],
                c: [5,6],
                b: [3,4],
            };

            assertEqual(Semigroup.concatAll(arr), [1,2,3,4,5,6]);
            assertEqual(Semigroup.concatAll(obj), [1,2,5,6,3,4]);
        });

        it('should throw an exception if the foldable is empty', function() {
            try {
                Semigroup.concatAll([]);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#member', function() {
        it('should return true if a value implements semigroup, false otherwise', function() {
            assert.equal(Semigroup.member({}), true);
            assert.equal(Semigroup.member(Sum(1)), true);
            assert.equal(Semigroup.member([]), true);
            assert.equal(Semigroup.member(undefined), true);
            assert.equal(Semigroup.member(null), true);
            assert.equal(Semigroup.member(1), false);
            assert.equal(Semigroup.member(''), true);
            assert.equal(Semigroup.member(false), false);
            assert.equal(Semigroup.member(true), false);
        });
    });
});
