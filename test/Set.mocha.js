const assert = require('assert');

const _ = require('../src/lambdash');
const _Set = _.Set;

const assertEqual = function(left, right) {
    if (!_.eq(left,right)) {
        assert.fail(left, right, undefined, 'eq');
    }
};

describe('Set', function() {
    describe('#eq', function() {
        it('returns true if two sets are strictly equal in their contents', function() {
            assert(_Set.eq(new Set(), new Set()));
            assert(_Set.eq(new Set([1]), new Set([1])));
            assert(_Set.eq(new Set([1,2]), new Set([2,1])));

            const obj1 = {};
            const obj2 = {};
            assert(_Set.eq(new Set([obj1, obj2]), new Set([obj2, obj1])));

            const set = new Set();
            assert(_Set.eq(set, set));
        });

        it('returns false if two sets are not strictly equal in their contents', function() {
            assert(!_Set.eq(new Set(), new Set([1])));
            assert(!_Set.eq(new Set([1]), new Set([])));

            const obj1 = {};
            const obj2 = {};

            assert(!_Set.eq(new Set([obj1]), new Set([obj2])));
        });
    });

    describe('#fmap', function() {
        it('returns a new set with each item in the original altered by a function', function() {
            const set = new Set([1,2,3]);
            const res = _Set.fmap(_.pipe(_.add(1), _.show), set);
            assertEqual(res, new Set(['2', '3', '4']));
        });
    });

    describe('#foldl', function() {
        it('performs a reduction of the values of the set', function() {
            const set = new Set([1,2,3]);
            const res = _Set.foldl(_.add, 5, set);
            assert.equal(res, 11);
        });
    });

    describe('#foldr', function() {
        it('performs a reduction of the values of the set', function() {
            const set = new Set([1,2,3]);
            const res = _Set.foldr(_.add, 5, set);
            assert.equal(res, 11);
        });
    });

    describe('#concat', function() {
        it('joins two sets together', function() {
            const set1 = new Set([1,2,3]);
            const set2 = new Set([3,4,5]);
            const concatted = _Set.concat(set1, set2);

            assert.equal(concatted.size, 5);
            assertEqual(concatted, new Set([1,2,3,4,5]));
            assert(set1 !== concatted);
            assert(set2 !== concatted);

            assertEqual(set1, new Set([1,2,3]));
            assertEqual(set2, new Set([3,4,5]));
        });
    });

    describe('#empty', function() {
        it('always returns an empty set', function() {
            const empty = _Set.empty();

            assert.equal(empty.size, 0);
            assert(empty instanceof Set);
        });
    });

    describe('#ap', function() {
        it('applys the functions in one set to the values in another set', function() {
            const fns = new Set([_.add(1), _.mul(3)]);
            const values = new Set([1,2,3]);
            const expected = new Set([2,3,4,3,6,9]);
            const res = _Set.ap(fns, values);

            assertEqual(res, expected);
        });
    });

    describe('#of', function() {
        it('creates a new set with its only value as the argument', function() {
            assertEqual(_Set.of('value'), new Set(['value']));
        });
    });

    describe('#flatten', function() {
        it('combines a set of sets into a single set', function() {
            const sets = new Set([
                new Set([1,2,3]),
                new Set([3,4,5]),
                new Set([5,6,7,8]),
            ]);

            const flattened = _Set.flatten(sets);
            const expected = new Set([1,2,3,4,5,6,7,8]);
            assertEqual(flattened, expected);
        });
    });

    describe('#union', function() {
        it('creates a set with the values of two other sets', function() {
            const set1 = new Set([1,2,3]);
            const set2 = new Set([3,4,5]);

            const union = _Set.union(set1, set2);
            assertEqual(union, new Set([1,2,3,4,5]));
        });
    });

    describe('#difference', function() {
        it('returns a set with all values in one set not in another', function() {
            const set1 = new Set([1,2,3]);
            const set2 = new Set([2,4,5]);

            const union = _Set.difference(set1, set2);
            assertEqual(union, new Set([1,3]));
        });
    });

    describe('#intersection', function() {
        it('returns a set of all values that exist in both of two other sets', function() {
            const set1 = new Set([1,2,3]);
            const set2 = new Set([2,3,5]);

            const union = _Set.intersection(set1, set2);
            assertEqual(union, new Set([2,3]));
        });
    });

    describe('#symmetricDifference', function() {
        it('returns a set of all values in either of two sets, but not in both', function() {
            const set1 = new Set([1,2,3]);
            const set2 = new Set([2,3,5]);

            const union = _Set.symmetricDifference(set1, set2);
            assertEqual(union, new Set([1,5]));
        });
    });

    describe('#exists', function() {
        it('returns true if a value is in a set, false otherwise', function() {
            const set = new Set([1,5,6]);

            assert(_Set.exists(5, set));
            assert(!_Set.exists(9, set));
        });
    });

    describe('#insert', function() {
        it('creates a set from another with an additional value', function() {
            const set = new Set([2,3,4]);
            const newSet = _Set.insert(5, set);

            assert(set !== newSet);
            assertEqual(newSet, new Set([2,3,4,5]));
            assertEqual(set, new Set([2,3,4]));
        });
    });

    describe('#remove', function() {
        it('creates a set from another with a value removed', function() {
            const set = new Set([2,3,4]);
            const newSet = _Set.remove(3, set);

            assert(set !== newSet);
            assertEqual(newSet, new Set([2,4]));
            assertEqual(set, new Set([2,3,4]));
        });
    });

    describe('#show', function() {
        it('creates a string representation of a set', function() {
            const set = new Set([2,3,4]);
            const shown = _Set.show(set);

            assert.equal(shown, 'Set(2,3,4)');
        });
    });

    describe('@implements', function() {
        const set = new Set();
        it('implements Eq', function() {
            assert(_.Eq.member(set));
        });

        it('implements Functor', function() {
            assert(_.Functor.member(set));
        });

        it('implements Foldable', function() {
            assert(_.Foldable.member(set));
        });

        it('implements Semigroup', function() {
            assert(_.Semigroup.member(set));
        });

        it('implements Monoid', function() {
            assert(_.Monoid.member(set));
        });

        it('implements Applicative', function() {
            assert(_.Applicative.member(set));
        });

        it('implements Monad', function() {
            assert(_.Monad.member(set));
        });

        it('implements SetOps', function() {
            assert(_.SetOps.member(set));
        });

        it('implements SetKind', function() {
            assert(_.SetKind.member(set));
        });

        it('implements Show', function() {
            assert(_.Show.member(set));
        });
    });
});
