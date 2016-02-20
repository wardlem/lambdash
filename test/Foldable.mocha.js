var assert = require('assert');

var _ = require('../src/lambdash.js');

var Foldable = _.Foldable;
var Arr = _.Arr;
var Num = _.Num;
var productType = _.Type.product;
var sumType = _.Type.sum;
var _always = _.always;
var _curry = _.curry;

var List = function List() {
    var l = List.Nil;
    var argsInd = arguments.length - 1;
    while(argsInd >= 0) {
        l = List.Cons(arguments[argsInd], l);
        argsInd -= 1;
    }
    return l;
};

List.member = function(v) {
    return v instanceof List;
};

List = sumType(List, {Cons: {head: null, tail: List}, Nil: []});

List.foldl = _curry(function(fn, init, l){
    return List.case({
        "Nil": init,
        "Cons": function(hd, tl) {
            return List.foldl(fn, fn(init, hd), tl)
        }
    }, l);
});

List.foldr = _curry(function(fn, init, l){
    return List.case({
        "Nil": init,
        "Cons": function(hd, tl) {
            return fn(List.foldr(fn, init, tl), hd);
        }
    }, l);
});

describe('Foldable', function(){

    describe('#foldl', function(){
        it('should fold an implementing value from left to right', function(){
            var arr = [1,2,3];

            var fn = function(accum, value) {
                return accum + value;
            };

            assert.equal(Foldable.foldl(fn, 5, arr), 11);

            arr = [2,3,8];
            fn = function(accum, value) {
                return (accum / value) + 1;
            };

            assert.equal(Foldable.foldl(fn, 64, arr), 2.5);

        });
    });

    describe('#foldr', function(){
        it('should fold an implementing value from right to left', function(){
            var arr = [1,2,3];

            var fn = function(accum, value) {
                return accum + value;
            };

            assert.equal(Foldable.foldr(fn, 5, arr), 11);

            arr = [2,3,8];
            fn = function(accum, value) {
                return (accum / value) + 1;
            };

            assert.equal(Foldable.foldr(fn, 64, arr), 3);

        });
    });

    describe('#foldMap', function() {
        it('should map and concatenate a monoid', function() {
            var foldable = [1,2,3];
            var fn = function(n){return String(n + 1)};

            assert.equal(Foldable.foldMap(fn, foldable), '234');

            var Sum = productType('Sum', {value: Num});
            Sum.empty = _always(Sum(0));
            Sum.concat = _curry(function(left, right) {
                return Sum(left.value + right.value);
            });

            var sum = Foldable.foldMap(Sum, [1,2,3]);
            assert(sum instanceof Sum);
            assert.equal(sum.value, 6);
        });

        it('should throw an exception when the structure is empty', function() {
            try {
                var fn = function(n){return n};
                Foldable.foldMap(fn, []);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#foldMapDef', function() {
        it('should map and concatenate a monoid', function() {
            var foldable = [1,2,3];
            var fn = function(n){return String(n + 1)};
            var empty = '';

            assert.equal(Foldable.foldMapDef(fn, empty, foldable), '234');

            var Sum = productType('Sum', {value: Num});
            Sum.empty = _always(Sum(0));
            Sum.concat = _curry(function(left, right) {
                return Sum(left.value + right.value);
            });

            var sum = Foldable.foldMapDef(Sum, Sum.empty(), [1,2,3]);
            assert(sum instanceof Sum);
            assert.equal(sum.value, 6);
        });
    });

    describe('#join', function() {
        it('should join the contained monoids into one', function() {
            assert.equal(Foldable.join(['abc', 'def', 'ghi']), 'abcdefghi');

            var Sum = productType('Sum', {value: Num});
            Sum.empty = _always(Sum(0));
            Sum.concat = _curry(function(left, right) {
                return Sum(left.value + right.value);
            });

            var sum = Foldable.join([Sum(1),Sum(2),Sum(3)]);
            assert(sum instanceof Sum);
            assert.equal(sum.value, 6);
        });

        it('should throw an exception when the structure is empty', function() {
            try {
                Foldable.join([]);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#joinDef', function() {
        it('should join the contained monoids into one', function() {
            assert.equal(Foldable.joinDef('', ['abc', 'def', 'ghi']), 'abcdefghi');
            assert.equal(Foldable.joinDef('', []), '');

            var Sum = productType('Sum', {value: Num});
            Sum.empty = _always(Sum(0));
            Sum.concat = _curry(function(left, right) {
                return Sum(left.value + right.value);
            });

            var sum = Foldable.joinDef(Sum.empty(), [Sum(1),Sum(2),Sum(3)]);
            assert(sum instanceof Sum);
            assert.equal(sum.value, 6);
        });
    });

    describe('#len', function() {
        it('should return the number of elements in a foldable', function() {
            assert.equal(Foldable.len([1,2,3,4,5]), 5);
            assert.equal(Foldable.len('abc'), 3);
            assert.equal(Foldable.len([]), 0);
        });
    });

    describe('#isEmpty', function() {
        it('should return whether or not a foldable value is empty', function() {
            assert.equal(Foldable.isEmpty([1,2,3,4,5]), false);
            assert.equal(Foldable.isEmpty('abc'), false);
            assert.equal(Foldable.isEmpty([]), true);
            assert.equal(Foldable.isEmpty(''), true);
        });
    });

    describe('#isNotEmpty', function() {
        it('should return the inverse of whether or not a foldable value is empty', function() {
            assert.equal(Foldable.isNotEmpty([1,2,3,4,5]), true);
            assert.equal(Foldable.isNotEmpty('abc'), true);
            assert.equal(Foldable.isNotEmpty([]), false);
            assert.equal(Foldable.isNotEmpty(''), false);
        });
    });

    describe('#contains', function() {
        it('should return whether or not a foldable contains a value', function() {
            var turduckin = ['turkey', 'duck', 'chicken'];
            assert.equal(Foldable.contains('duck', turduckin), true);
            assert.equal(Foldable.contains('turkey', turduckin), true);
            assert.equal(Foldable.contains('chicken', turduckin), true);
            assert.equal(Foldable.contains('pigeon', turduckin), false);

            assert.equal(Foldable.contains([1,2,3], [[4,5,6], [7,8,9], [1,2,3]]), true);
            assert.equal(Foldable.contains([1,2,4], [[4,5,6], [7,8,9], [1,2,3]]), false);
        });
    });

    describe('#notContains', function() {
        it('should return the inverse of whether or not a foldable contains a value', function() {
            var turduckin = ['turkey', 'duck', 'chicken'];
            assert.equal(Foldable.notContains('duck', turduckin), false);
            assert.equal(Foldable.notContains('turkey', turduckin), false);
            assert.equal(Foldable.notContains('chicken', turduckin), false);
            assert.equal(Foldable.notContains('pigeon', turduckin), true);

            assert.equal(Foldable.notContains([1,2,3], [[4,5,6], [7,8,9], [1,2,3]]), false);
            assert.equal(Foldable.notContains([1,2,4], [[4,5,6], [7,8,9], [1,2,3]]), true);
        });
    });

    describe('#all', function() {
        it('should return true if and only if all values in the structure satisfy a predicate', function(){
            var test = function(v) {
                return v > 1;
            };

            assert.equal(Foldable.all(test, [2,3,4]), true);
            assert.equal(Foldable.all(test, [1,3,4]), false);
            assert.equal(Foldable.all(test, [2,3,4,0]), false);
            assert.equal(Foldable.all(test, []), true);
        });
    });

    describe('#any', function() {
        it('should return true if and only if any values in the structure satisfy a predicate', function(){
            var test = function(v) {
                return v < 2;
            };

            assert.equal(Foldable.any(test, [2,3,4]), false);
            assert.equal(Foldable.any(test, [2,3,4,0]), true);
            assert.equal(Foldable.any(test, [1,3,4]), true);
            assert.equal(Foldable.any(test, []), false);
        });
    });

    describe('#countWith', function(){
        it('should count all the items in a foldable that match a predicate', function(){
            var arr = [1,1,2,3,4,4,5];
            assert.equal(_.countWith(_.gt(_,2), arr), 4);
        });
    });

    describe('#count', function(){
        it('should count all the items in a foldable that are equal to a value', function(){
            var arr = [1,1,2,3,4,4,5];
            assert.equal(_.count(4, arr), 2);
        });
    });

    describe('#toArray', function() {
        it('should convert a foldable to an array', function() {
            var l = List(1,2,3,4);
            var a = Foldable.toArray(l);

            assert(l instanceof List);
            assert.equal(Array.isArray(a), true);
            assert.equal(a.length, 4);
            assert.equal(a[0], 1);
            assert.equal(a[1], 2);
            assert.equal(a[2], 3);
            assert.equal(a[3], 4);

        });
    });

    describe('#maximum', function() {
        it('should return the greatest value in a structure', function(){
            assert.equal(Foldable.maximum([1,5,3,7,2,-6]), 7);
            assert.equal(Foldable.maximum([2,-2]), 2);
        });

        it('should throw an exception when the structure is empty', function() {
            try {
                Foldable.maximum([]);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#minimum', function() {
        it('should return the least value in a structure', function(){
            assert.equal(Foldable.minimum([1,5,3,-7,2,-6]), -7);
            assert.equal(Foldable.minimum([-2,2]), -2);

        });

        it('should throw an exception when the structure is empty', function() {
            try {
                Foldable.minimum([]);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#sum', function() {
        it('should return the sum of the values in a structure', function(){
            assert.equal(Foldable.sum([1,2,3,4,5]), 15);
            assert.equal(Foldable.sum(List(1,2,3,4,5)), 15);
        });

        it('should throw an exception when the structure is empty', function() {
            try {
                Foldable.sum([]);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#product', function() {
        it('should return the product of the values in a structure', function(){
            assert.equal(Foldable.product([1,2,3,4,5]), 120);
            assert.equal(Foldable.product(List(1,2,3,4,5)), 120);
        });

        it('should throw an exception when the structure is empty', function() {
            try {
                Foldable.product([]);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#member', function(){
        it('should return true for a value that implements Foldable, false otherwise', function(){
            assert(Foldable.member([]));
            assert(Foldable.member(List()));
            assert(!Foldable.member(1));
            assert(!Foldable.member(true));
            assert(!Foldable.member(null));
            assert(!Foldable.member(undefined));
        });
    });


});
