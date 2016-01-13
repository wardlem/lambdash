var assert = require('assert');

var Monad = require('../src/Monad');

var Arr = require('../src/Arr');

describe('Monad', function(){
    describe('#flatten', function(){
        it('should flatten a monadic value', function(){
            var arr = [[1,2,3], [4,5,6], [9,8,7]];

            assert(Arr.eq(Monad.flatten(arr), [1,2,3,4,5,6,9,8,7]));
        });

        it('should throw a TypeError if the value does not implement Monad', function(){
            try {
                Monad.flatten(function(x){return x}, null);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#chain', function() {
        it('should flat map a monadic value', function(){
            var fn = function(value) {
                return [value, value + 1];
            };

            var arr = [1,3,5,7];

            assert.equal(Monad.chain.length, 2);

            assert(Arr.eq(Monad.chain(fn, arr), [1,2,3,4,5,6,7,8]));
            assert(Arr.eq(Monad.chain(fn)(arr), [1,2,3,4,5,6,7,8]));
        });

    });

    describe('#composeM', function() {
        it('should composeM several functions into one', function(){
            var fn1 = function(value) {
                return [value, value + 1];
            };

            var fn2 = function(value) {
                return [value, value];
            };


            var arr = [1,3];

            var composed = Monad.composeM(fn1, fn2);

            assert(Arr.eq(Monad.map(fn1, arr), [[1,2],[3,4]]));
            assert(Arr.eq(Monad.map(fn2, arr), [[1,1],[3,3]]));
            assert(Arr.eq(composed(arr), [1,2,1,2,3,4,3,4]));
        });

    });

    describe('#pipeM', function() {
        it('should composeM several functions into one', function(){
            var fn1 = function(value) {
                return [value, value + 1];
            };

            var fn2 = function(value) {
                return [value, value];
            };


            var arr = [1,3];

            var piped = Monad.pipeM(fn1, fn2);

            assert(Arr.eq(piped(arr), [1,1,2,2,3,3,4,4]));
        });

    });

    describe('#member', function(){
        it('should return true if a value implements Monad, false otherwise', function(){
            assert(Monad.member([]));
            assert(!Monad.member(null));
            assert(!Monad.member(undefined));
        });
    });

});