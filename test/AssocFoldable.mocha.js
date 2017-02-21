var assert = require('assert');
var _ = require('../src/lambdash');
var AssocFoldable = _.AssocFoldable;

var assertEqual = function(left, right) {
    if (!_.eq(left,right)) {
        assert.fail(left, right, undefined, 'eq');
    }
};

var ArrayMap = _.Type.product('ArrayMap', {data: _.Arr});

ArrayMap.exists = _.curry(function(key, map) {
    var ind = 0;
    var data = map.data;
    while (ind < data.length) {
        if (_.eq(data[ind][0], key)) {
            return true;
        }
        ind += 1;
    }

    return false;
});

ArrayMap.assoc = _.curry(function(key, value, map) {
    var ind = 0;
    var data = map.data;
    var result = _.drop(0, data);
    while (ind < data.length) {
        if (_.eq(data[ind][0], key)) {
            result[ind][1] = value;
            return ArrayMap(result);
        }
        ind += 1;
    }

    result.push([key, value]);
    return ArrayMap(result);
});

ArrayMap.dissoc = _.curry(function(key, map) {
    var ind = 0;
    var data = map.data;
    while (ind < data.length) {
        if (_.eq(data[ind][0], key)) {
            return ArrayMap(_.concat(_.take(ind, data), _.drop(ind + 1, data)));
        }
        ind += 1;
    }

    return map;
});

ArrayMap.lookup = _.curry(function(key, map) {
    var ind = 0;
    var data = map.data;
    while (ind < data.length) {
        if (_.eq(data[ind][0], key)) {
            return data[ind][1];
        }
        ind += 1;
    }

    return undefined;
});

ArrayMap.foldlAssoc = _.curry(function(fn, init, map) {
    var ind = 0;
    var data = map.data;
    while (ind < data.length) {
        init = fn(init, data[ind][1], data[ind][0]);
        ind += 1;
    }

    return init;
});

ArrayMap.foldrAssoc = _.curry(function(fn, init, map) {
    var data = map.data;
    var ind = data.length - 1;
    while (ind >= 0) {
        init = fn(init, data[ind][1], data[ind][0]);
        ind += 1;
    }

    return init;
});

ArrayMap.empty = function() {
    return ArrayMap([]);
};

describe('AssocFoldable', function() {
    describe('#foldlAssoc', function() {
        it('folds an assocative container from left to right', function() {
            const fn = (accum, v, k) => accum + v + k;
            const obj = {a: 1, b: 2, c: 3};
            assertEqual(AssocFoldable.foldlAssoc(fn, 'p', obj), 'p1a2b3c');
        });

        it('throws a TypeError if the value does not implement foldable', function() {
            const fn = (accum, v, k) => accum + v + k;

            try {
                AssocFoldable.foldlAssoc(fn, 1, 1);
            } catch (e) {
                assert(e instanceof TypeError);
                return;
            }

            assert(false);
        });
    });

    describe('#foldrAssoc', function() {
        it('folds an assocative container from right to left', function() {
            const fn = (accum, v, k) => accum + v + k;
            const obj = {a: 1, b: 2, c: 3};
            assertEqual(AssocFoldable.foldrAssoc(fn, 'p', obj), 'p3c2b1a');
        });

        it('throws a TypeError if the value does not implement foldable', function() {
            const fn = (accum, v, k) => accum + v + k;

            try {
                AssocFoldable.foldrAssoc(fn, 1, 1);
            } catch (e) {
                assert(e instanceof TypeError);
                return;
            }

            assert(false);
        });
    });

    describe('#keys', function() {
        it('returns all the keys of a container as an array', function() {
            assertEqual(AssocFoldable.keys({a:1,b:2,c:3}), ['a','b','c']);
            assertEqual(AssocFoldable.keys(ArrayMap([['a', 1],['b', 2],['c', 3]])), ['a','b','c']);
        });

        it('throws a TypeError if the value does not implement foldable', function() {
            try {
                AssocFoldable.keys(1);
            } catch (e) {
                assert(e instanceof TypeError);
                return;
            }

            assert(false);
        });
    });

    describe('#values', function() {
        it('returns all the values of a container as an array', function() {
            assertEqual(AssocFoldable.values({a:1,b:2,c:3}), [1,2,3]);
            assertEqual(AssocFoldable.values(ArrayMap([['a', 1],['b', 2],['c', 3]])), [1,2,3]);
        });

        it('throws a TypeError if the value does not implement foldable', function() {
            try {
                AssocFoldable.values(1);
            } catch (e) {
                assert(e instanceof TypeError);
                return;
            }

            assert(false);
        });
    });

    describe('#pairs', function() {
        it('returns all the key value pairs in a container as an array of arrays', function() {
            var obj = {a:1,b:2,c:3};
            var map = ArrayMap([['a', 1],['b', 2],['c', 3]]);
            assertEqual(AssocFoldable.pairs(obj), [['a',1],['b',2],['c',3]]);
            assertEqual(AssocFoldable.pairs(map), [['a',1],['b',2],['c',3]]);
        });

        it('throws a TypeError if the value does not implement foldable', function() {
            try {
                AssocFoldable.pairs(1);
            } catch (e) {
                assert(e instanceof TypeError);
                return;
            }

            assert(false);
        });
    });

    describe('#filterAssoc', function() {
        it('filters an associative container by value and key', function() {
            var obj = {a:1,b:2,c:3};
            var map = ArrayMap([['a', 1],['b', 2],['c', 3]]);
            var fn1 = (v, k) => v === 3 || k === 'a';
            var fn2 = (v, k) => v === 1 || k === 'b';

            assertEqual(AssocFoldable.filterAssoc(fn1, obj), {a: 1, c: 3});
            assertEqual(AssocFoldable.filterAssoc(fn2, obj), {a: 1, b: 2});
            assertEqual(AssocFoldable.filterAssoc(fn1, map), ArrayMap([['a',1],['c',3]]));
            assertEqual(AssocFoldable.filterAssoc(fn2, map), ArrayMap([['a',1],['b',2]]));
        });

        it('throws a TypeError if the value does not implement foldable', function() {
            var fn = (v, k) => v === 3 || k === 'a';

            try {
                AssocFoldable.filterAssoc(fn, false);
            } catch (e) {
                assert(e instanceof TypeError);
                return;
            }

            assert(false);
        });
    });

    describe('#mapAssoc', function() {
        it('applies a function to each value of an associative container', function() {
            var obj = {a:1,b:2,c:3};
            var map = ArrayMap([['a', 1],['b', 2],['c', 3]]);

            var fn = (v, k) => k.toUpperCase() + (v + 1);

            assertEqual(AssocFoldable.mapAssoc(fn, obj), {a: 'A2', b: 'B3', c: 'C4'});
            assertEqual(AssocFoldable.mapAssoc(fn, map), ArrayMap([['a', 'A2'],['b', 'B3'],['c','C4']]));
        });

        it('throws a TypeError if the value does not implement foldable', function() {
            var fn = (v, k) => k.toUpperCase() + (v + 1);

            try {
                AssocFoldable.mapAssoc(fn, false);
            } catch (e) {
                assert(e instanceof TypeError);
                return;
            }

            assert(false);
        });
    });

    describe('#member', function() {
        it('returns true if a value implements AssocFoldable', function() {
            assert.equal(AssocFoldable.member({}), true);
            assert.equal(AssocFoldable.member(ArrayMap.empty()), true);
            assert.equal(AssocFoldable.member(false), false);
            assert.equal(AssocFoldable.member(1), false);
        });
    });
});
