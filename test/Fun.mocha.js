var assert = require('assert');

var Fun = require('../src/Fun');

describe('Fun', function(){

    it('should assert its parameter is a function', function() {
        var fn = function(){};
        var notFn = 1;

        try {
            var _fn = Fun(fn);
            assert.equal(fn, _fn);
        } catch(e) {
            assert(false);
        }

        try {
            Fun(notFn);
            assert(false);
        } catch(e) {
            assert(e instanceof TypeError);
            assert(e.message.indexOf('Fun') !== -1);
        }
    });

    describe('#valid', function() {
        it('should return whether or not a value is a function', function() {
            assert(Fun.valid(function(){}));
            assert(!Fun.valid(1));
        });
    });

    describe('#compose', function() {
        it('should compose several functions into one with the rightmost applied first', function() {
            var fn1 = function(v) {
                return v + 'd';
            };

            var fn2 = function(v) {
                return v + 'c';
            };

            var fn3 = function(v1, v2) {
                return v1 + v2;
            };

            var fn = Fun.compose(fn1, fn2, fn3);

            assert.equal(typeof fn, 'function');
            assert.equal(fn.length, 2);
            assert.equal(fn('a', 'b'), 'abcd');
        });
    });

    describe('#pipe', function() {
        it('should compose several functions into one with the leftmost applied first', function() {
            var fn1 = function(v) {
                return v + 'd';
            };

            var fn2 = function(v) {
                return v + 'c';
            };

            var fn3 = function(v1, v2) {
                return v1 + v2;
            };

            var fn = Fun.pipe(fn3, fn2, fn1);

            assert.equal(typeof fn, 'function');
            assert.equal(fn.length, 2);
            assert.equal(fn('a', 'b'), 'abcd');
        });
    });

    describe('#always', function() {
        it ('should create a function that always returns the passed in value', function(){
            var always1 = Fun.always(1);

            assert.equal(typeof always1, 'function');
            assert.equal(always1.length, 0);
            assert.equal(always1(), 1);
        });
    });

    describe('#alwaysThrow', function() {
        it ('should always throw the provided exception when called', function() {

            var msg = 'You did something wrong';
            var thr = Fun.alwaysThrow(TypeError, msg);

            try {
                thr();
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
                assert.equal(e.message, msg);
            }
        });
    });

    describe('#make', function() {
        it ('should create a new named function', function(){
            var name = "Test";
            var test = function(a, b, c) {
                return (a + b) / c;
            };

            var Test = Fun.make(name, test);

            assert.equal(typeof Test, 'function');
            assert.equal(Test.name, name);
            assert.equal(Test.length, test.length);
            assert.equal(Test(1,5,2), 3);
        });
    });
});