var assert = require('assert');

var _ = require('../src/lambdash');
var Arr = _.Array;

var assertEqual = function(left, right) {
    if (!_.eq(left,right)) {
        assert.fail(left, right, undefined, 'eq');
    }
};

describe('Array', function() {
    describe('#eq', function() {
        it('should return true if two arrays are structurally equal', function() {
            var l = [1,2,3];
            var r = [1,2,3];

            assert(Arr.eq(l, r));
            assert(Arr.eq(l)(r));

            l = [[1,2,3],[4,5,6]];
            r = [[1,2,3],[4,5,6]];

            assert(Arr.eq(l, r));
            assert(Arr.eq(l)(r));
        });

        it('should return false if two arrays are not structurally equal', function() {
            var l = [1,2,3];
            var r = [1,2,4];

            assert(!Arr.eq(l, r));
            assert(!Arr.eq(l)(r));

            l = [[1,2,3],[4,5,7]];
            r = [[1,2,3],[4,5,6]];

            assert(!Arr.eq(l, r));
            assert(!Arr.eq(l)(r));
        });
    });

    describe('#compare', function() {
        it('should return _.EQ if two arrays are referentially equal', function() {
            var arr = [1,2,3];
            assert.equal(Arr.compare(arr, arr), _.EQ);
        });

        it('should return _.EQ if two arrays are structurally equal', function() {
            var left = [1,2,3];
            var right = [1,2,3];

            assert.equal(Arr.compare(left, right), _.EQ);

            left = [[1,2,3],[4,5,6]];
            right = [[1,2,3],[4,5,6]];

            assert.equal(Arr.compare(left, right), _.EQ);
        });

        it('should return _.LT if the left array is structurally less than the right', function() {
            var left = [1,2,3,4];
            var right = [1,2,4];

            assert.equal(Arr.compare(left, right), _.LT);

            left = [1,2,3];
            right = [1,2,3,4];

            assert.equal(Arr.compare(left, right), _.LT);

            left = [[1,2,3],[4,5,6]];
            right = [[1,2,3],[4,6,6]];

            assert.equal(Arr.compare(left, right), _.LT);
        });

        it('should return _.GT if the left array is structurally less than the right', function() {
            var left = [1,2,4];
            var right = [1,2,3,4];

            assert.equal(Arr.compare(left, right), _.GT);

            left = [1,2,3,4];
            right = [1,2,3];

            assert.equal(Arr.compare(left, right), _.GT);

            left = [[1,2,3],[4,6,6]];
            right = [[1,2,3],[4,5,6]];

            assert.equal(Arr.compare(left, right), _.GT);
        });
    });

    describe('#fmap', function() {
        it('should return a new array with a function mapped over the values', function() {
            var arr = [1,2,3];
            var res = Arr.fmap(_.pipe(_.add(1), _.show), arr);
            assert(Arr.eq(res, ['2', '3', '4']));
            assert(_.eq(arr, [1,2,3]));
        });
    });

    describe('#foldl', function() {
        it('should fold an array from left to right', function() {
            var fn = function(accum, v) {
                return accum + v;
            };

            var arr = ['a', 'b', 'c'];

            var res = Arr.foldl(fn, 'z', arr);
            assert.equal(res, 'zabc');
            assert(_.eq(arr, ['a', 'b', 'c']));
        });
    });

    describe('#foldr', function() {
        it('should fold an array from right to left', function() {
            var fn = function(accum, v) {
                return accum + v;
            };

            var arr = ['a', 'b', 'c'];

            var res = Arr.foldr(fn, 'z', arr);
            assert.equal(res, 'zcba');
            assert(_.eq(arr, ['a', 'b', 'c']));
        });
    });

    describe('#concat', function() {
        it('should join two arrays together', function() {
            var left = [1,2,3];
            var right = [4,5,6];

            assert(_.eq(Arr.concat(left, right), [1,2,3,4,5,6]));
        });

        it('should obey the monoid laws', function() {
            var arr = [1,2,3];
            assert(Arr.eq(arr, Arr.concat(arr, [])));
            assert(Arr.eq(arr, Arr.concat([], arr)));
        });
    });

    describe('#empty', function() {
        it('should return an empty array', function() {
            assert(_.eq([], Arr.empty()));
        });
    });

    describe('#ap', function() {
        it('should apply functions in the left array to values in the right array', function() {
            var fn = [_.add(1), _.mul(3)];

            var arr = [1,2,3];

            var res = Arr.ap(fn)(arr);

            assert(_.eq(res, [2,3,4,3,6,9]));
        });
    });

    describe('#of', function() {
        it('should return an array with the given value as its only element', function() {
            assert(_.eq(Arr.of(1), [1]));
        });
    });

    describe('#flatten', function() {
        it('should concatenate nested arrays into a single array', function() {
            var arr = [[1,2,3],[4,5,6],[7,8,9]];

            var res = Arr.flatten(arr);

            assert(_.eq(res, [1,2,3,4,5,6,7,8,9]));
            assert(_.eq(arr, [[1,2,3],[4,5,6],[7,8,9]]));
        });
    });

    describe('#applyTo', function() {
        it('should apply a given array to a function', function() {
            var fn = function(a, b) {
                return a + b;
            };

            var arr = [1,2];

            assert.equal(Arr.applyTo(fn, arr), 3);
        });
    });

    describe('#nth', function() {
        it('should return the value at a given index', function() {
            var arr = [1,2,3,4];

            assert.equal(Arr.nth(2)(arr),3);
        });

        it('should throw a RangeError if the given index is less than 0', function() {
            var arr = [1,2,3,4];

            try {
                Arr.nth(-1, arr);
                assert(false);
            } catch (e) {
                assert(e instanceof RangeError);
            }
        });

        it('should throw a RangeError if the given index is greater than the arrays max index', function() {
            var arr = [1,2,3,4];

            try {
                Arr.nth(4, arr);
                assert(false);
            } catch (e) {
                assert(e instanceof RangeError);
            }
        });
    });

    describe('#len', function() {
        it('should return the length of an array', function() {
            assert.equal(Arr.len([1,2,3,4,5]), 5);
            assert.equal(Arr.len([]), 0);
        });
    });

    describe('#reverse', function() {
        it('should reverse the order of an array', function() {
            var arr = [1,2,3,4,5];
            var res = Arr.reverse(arr);

            assert(_.eq(arr), [1,2,3,4,5]);
            assert(_.eq(res), [5,4,3,2,1]);
        });
    });

    describe('#intersperse', function() {
        it('should create a new array with a value between all the elements', function() {
            var arr = ['c', 'r', 'c', 's'];
            var caracas = Arr.intersperse('a')(arr);

            assert(_.eq(arr, ['c', 'r', 'c', 's']));
            assert(_.eq(caracas, ['c', 'a', 'r', 'a', 'c', 'a', 's']));
        });

        it('should return an empty array if given an empty array', function() {
            assert(_.eq([], Arr.intersperse('a', [])));
        });
    });

    describe('#exists', function() {
        it('should return true if there is at least one value in an array equal to a given value, false otherwise', function() {
            assert.equal(Arr.exists(1)([1,2,3,4,5]), true);
            assert.equal(Arr.exists(6)([1,2,3,4,5]), false);
            assert.equal(Arr.exists([3])([[1],[2],[3],[4]]),true);
            assert.equal(Arr.exists([5])([[1],[2],[3],[4]]),false);
        });
    });

    describe('#insert', function() {
        it('should add a value to an array if it does not already exist', function() {
            assertEqual(Arr.insert(3, [1,2,3,4]), [1,2,3,4]);
            assertEqual(Arr.insert(5, [1,2,3,4]), [1,2,3,4,5]);
        });
    });

    describe('#remove', function() {
        it('should remove all instances of a value from an array', function() {
            assertEqual(Arr.remove(1, [1,1,1,1,1,1,1,1]), []);
            assertEqual(Arr.remove(1, [1,2,3,4,5,1,2,3,4,5]), [2,3,4,5,2,3,4,5]);
            assertEqual(Arr.remove(1, [2,3,4,5,6,7,8,9]), [2,3,4,5,6,7,8,9]);
        });
    });

    describe('#union', function() {
        it('should join two arrays together without duplicating values', function() {
            var arr1 = [1,2,3,4,4,5];
            var arr2 = [8,7,6,6,5,4];

            assertEqual(Arr.union(arr1, arr2), [1,2,3,4,5,8,7,6]);
        });
    });

    describe('#difference', function() {
        it('should give all the values in left not in right', function() {
            var arr1 = [1,2,3,4,4,5];
            var arr2 = [8,7,6,6,5,4];

            assertEqual(Arr.difference(arr1, arr2), [1,2,3]);
        });
    });

    describe('#intersection', function() {
        it('should return an array of all the values in left and right', function() {
            var arr1 = [1,2,3,4,4,5];
            var arr2 = [8,7,6,6,5,4];

            assertEqual(Arr.intersection(arr1, arr2), [4,5]);
        });
    });

    describe('#symmetricDifference', function() {
        it('should return all the values in left or right but not both', function() {
            var arr1 = [1,2,3,4,4,5];
            var arr2 = [8,7,6,6,5,4];

            assertEqual(Arr.symmetricDifference(arr1, arr2), [1,2,3,8,7,6]);
        });
    });

    describe('#show', function() {
        it('should create a string representation of an array', function() {
            assert.equal(Arr.show([1,2,3]), '[1,2,3]');
        });
    });

    describe('#fromArrayLike', function() {
        it('should create an array from an array like value', function() {
            var arrayLike = {
                0: 'ok',
                1: 'hmm',
                2: 1,
                length: 3,
            };

            var arr = Arr.fromArrayLike(arrayLike);
            assertEqual(arr, ['ok','hmm', 1]);
            assert(Array.isArray(arr));
        });
    });

});
