var assert = require('assert');
var _ = require('../src/lambdash');
var Associative = _.Associative;

var assertEqual = function(left, right){
    if (!_.eq(left,right)){
        assert.fail(left, right, undefined, 'eq');
    }
};

var ArrayMap = _.Type.product('ArrayMap', {data: _.Arr});

ArrayMap.exists = function(key, map) {
    var ind = 0;
    var data = map.data;
    while (ind < data.length) {
        if (_.eq(data[ind][0], key)) {
            return true;
        }
        ind += 1;
    }

    return false;
}

ArrayMap.assoc = function(key, value, map) {
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
}

ArrayMap.dissoc = function(key, map) {
    var ind = 0;
    var data = map.data;
    while (ind < data.length) {
        if (_.eq(data[ind][0], key)) {
            return ArrayMap(_.concat(_.take(ind, data), _.drop(ind+1, data)));
        }
        ind += 1;
    }

    return map;
}

ArrayMap.lookup = function(key, map) {
    var ind = 0;
    var data = map.data;
    while(ind < data.length) {
        if (_.eq(data[ind][0], key)) {
            return data[ind][1];
        }
        ind += 1;
    }

    return undefined;
}

ArrayMap.empty = function(){
    return ArrayMap([]);
}

describe('Associative', function(){
    describe('#assoc', function(){
        it('should associate a key with a value in an associative container', function(){
            assertEqual(Associative.assoc('a',1, {}), {a:1});
            assertEqual(Associative.assoc('a',1, ArrayMap.empty()), ArrayMap([['a',1]]));
        });

        it('should overwrite an existing key if present', function(){
            assertEqual(Associative.assoc('a',2, {a:1}), {a:2});
            assertEqual(Associative.assoc('a',2, ArrayMap([['a', 1]])), ArrayMap([['a',2]]));
        });
    });

    describe('#dissoc', function(){
        it('should remove a key from an associative container', function(){
            assertEqual(Associative.dissoc('a', {a:1,b:2}), {b:2});
            assertEqual(Associative.dissoc([1,2], ArrayMap([[[1,2], 1],[ [1,3], 2]])), ArrayMap([[[1,3],2]]))
        });

        it('should not change the container if the key is not there', function(){
            assertEqual(Associative.dissoc('a', {b:2}), {b:2});
            assertEqual(Associative.dissoc([1,2], ArrayMap([[[1,3], 2]])), ArrayMap([[[1,3], 2]]))
        });
    });

    describe('#exists', function(){
        it('should return true if the value exists false otherwise', function(){
            assertEqual(Associative.exists('a', {a:1}), true);
            assertEqual(Associative.exists('b', {a:1}), false);
        });
    });

    describe('#lookup', function(){
        it('should return a value associated with a key', function(){
            assertEqual(Associative.lookup('a', {a:1}), 1);
            assertEqual(Associative.lookup([1,2], ArrayMap([[[1,2], 15]])), 15);
        });

        it('should return undefined if the value does not exist', function(){
            assertEqual(Associative.lookup('b', {a:1}), undefined);
            assertEqual(Associative.lookup([1,3], ArrayMap([[[1,2], 15]])), undefined);
        });
    });

    describe('#lookupAll', function(){
        it('should return a collection of values in an associative container based on a collection of keys', function(){
            var keys = ['a', 'b', 'c'];
            var obj = {a:17, b:93, c:12};

            assertEqual(Associative.lookupAll(keys, obj), [17, 93, 12]);

            keys = {
                'apple': 'a',
                'berry': 'b',
                'corn': 'c'
            }

            assertEqual(Associative.lookupAll(keys, obj), {'apple': 17, 'berry': 93, 'corn': 12})
        });
    });

    describe('#lookupOr', function(){
        it('should behave like lookup if the value exists', function(){
            assertEqual(Associative.lookupOr(12, 'a', {a:1}), 1);
            assertEqual(Associative.lookupOr(12, [1,2], ArrayMap([[[1,2], 15]])), 15);
        });

        it('should return the default value if the key does not exist', function(){
            assertEqual(Associative.lookupOr(12, 'a', {b:1}), 12);
            assertEqual(Associative.lookupOr(12, [1,2], ArrayMap([[[1,3], 15]])), 12);
        });
    });

    describe('#update', function(){
        it('should update a value if it exists', function(){
            var fn = function(x){return x+1};
            assertEqual(Associative.update('a', fn, {a:1}), {a:2});
            assertEqual(Associative.update(1, fn, ArrayMap([[1,3]])), ArrayMap([[1,4]]));
        });
    });

    describe('#updateOr', function(){
        it('should update a value if it exists', function(){
            var fn = function(x){return x+1};
            assertEqual(Associative.updateOr(0, 'a', fn, {a:1}), {a:2});
            assertEqual(Associative.updateOr(0, 1, fn, ArrayMap([[1,3]])), ArrayMap([[1,4]]));
        });

        it('should set a default if a value does not exists', function(){
            var fn = function(x){return x+1};
            assertEqual(Associative.updateOr(0, 'b', fn, {a:1}), {a:1,b:0});
            assertEqual(Associative.updateOr(0, 2, fn, ArrayMap([[1,3]])), ArrayMap([[1,3],[2,0]]));
        });
    });

    describe('#member', function(){
        it('shoudl return true if a value implements Associative', function(){
            assert.equal(Associative.member({}), true);
            assert.equal(Associative.member(ArrayMap.empty()), true);
            assert.equal(Associative.member(false), false);
            assert.equal(Associative.member(1), false);
        })
    })
});
