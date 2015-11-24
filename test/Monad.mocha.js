var assert = require('assert');

var Monad = require('../src/Monad');

var Arr = require('../src/Arr');

describe('Monad', function(){
    describe('#flatten', function(){
        it('should flatten a monadic value', function(){
            var arr = [[1,2,3], [4,5,6], [9,8,7]];

            assert(Arr.equal(Monad.flatten(arr), [1,2,3,4,5,6,9,8,7]));
        });
    });

    describe('#chain', function() {
        it('should flat map a monadic value', function(){
            var fn = function(value) {
                return [value, value + 1];
            };

            var arr = [1,3,5,7];

            assert.equal(Monad.chain.length, 2);

            assert(Arr.equal(Monad.chain(fn, arr), [1,2,3,4,5,6,7,8]));
            assert(Arr.equal(Monad.chain(fn)(arr), [1,2,3,4,5,6,7,8]));
        });

    });

    describe('#compose', function() {
        it('should compose several functions into one', function(){
            var fn1 = function(value) {
                return [value, value + 1];
            };

            var fn2 = function(value) {
                return [value, value];
            };


            var arr = [1,3];

            var composed = Monad.compose(fn1, fn2);

            assert(Arr.equal(Monad.map(fn1, arr), [[1,2],[3,4]]));
            assert(Arr.equal(Monad.map(fn2, arr), [[1,1],[3,3]]));
            assert(Arr.equal(composed(arr), [1,2,1,2,3,4,3,4]));
        });

    });

    describe('#pipe', function() {
        it('should compose several functions into one', function(){
            var fn1 = function(value) {
                return [value, value + 1];
            };

            var fn2 = function(value) {
                return [value, value];
            };


            var arr = [1,3];

            var piped = Monad.pipe(fn1, fn2);

            assert(Arr.equal(piped(arr), [1,1,2,2,3,3,4,4]));
        });

    });

});