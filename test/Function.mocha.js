var assert = require('assert');

var _ = require('../src/lambdash');
var Fun = _.Fun;
var Arr = _.Arr;

describe('Fun', function() {

    it('should assert its parameter is a function', function() {
        var fn = function() {};
        var notFn = 1;

        try {
            var _fn = Fun(fn);
            assert.equal(fn, _fn);
        } catch (e) {
            assert(false);
        }

        try {
            Fun(notFn);
            assert(false);
        } catch (e) {
            assert(e instanceof TypeError);
            assert(e.message.indexOf('Fun') !== -1);
        }
    });

    describe('#member', function() {
        it('should return whether or not a value is a function', function() {
            assert(Fun.member(function() {}));
            assert(!Fun.member(1));
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
        it('should create a function that always returns the passed in value', function() {
            var always1 = Fun.always(1);

            assert.equal(typeof always1, 'function');
            assert.equal(always1.length, 0);
            assert.equal(always1(), 1);
        });
    });

    describe('#alwaysThrow', function() {
        it('should always throw the provided exception when called', function() {

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

    describe('#thunk', function() {
        it('should create a function from another function with arguments pre-applied', function() {
            var fn = function(a, b) {
                return a + b;
            };

            var thunk = Fun.thunk(fn, 3, 4);

            assert.equal(typeof thunk, 'function');
            assert.equal(thunk.length, 0);
            assert.equal(thunk(), 7);
        });
    });

    describe('#identity', function() {
        it('should always return the value it is given', function() {
            assert.equal(Fun.identity(1), 1);
            assert(Arr.eq(Fun.identity([1,2,3]), [1,2,3]));
            assert.equal(Fun.identity(null), null);
        });
    });

    describe('#curry', function() {
        it('should create a function from another function', function() {
            var fn = function(a,b,c) {return a + b + c;};

            var c3 = Fun.curry(fn);
            assert.equal(typeof c3, 'function');
            assert.equal(c3.length, 3);

            var c2 = c3('a');
            assert.equal(typeof c2, 'function');
            assert.equal(c2.length, 2);

            var c1 = c2('b');
            assert.equal(typeof c1, 'function');
            assert.equal(c1.length, 1);

            var c = c1('c');
            assert.equal(typeof c, 'string');
            assert.equal(c, 'abc');

            c2 = c3(_,_,'a');
            assert.equal(typeof c2, 'function');
            assert.equal(c2.length, 2);

            c1 = c2(_,'b');
            assert.equal(typeof c1, 'function');
            assert.equal(c1.length, 1);

            c = c1('c');
            assert.equal(typeof c, 'string');
            assert.equal(c, 'cba');
        });
    });

    describe('#curryN', function() {
        it('should create a function from another function', function() {
            var fn = function(a,b,c) {return a + b + (c || 'z');};

            var c3 = Fun.curryN(3, fn);
            assert.equal(typeof c3, 'function');
            assert.equal(c3.length, 3);

            var c2 = c3('a');
            assert.equal(typeof c2, 'function');
            assert.equal(c2.length, 2);

            var c1 = c2('b');
            assert.equal(typeof c1, 'function');
            assert.equal(c1.length, 1);

            var c = c1('c');
            assert.equal(typeof c, 'string');
            assert.equal(c, 'abc');

            c2 = c3(_,_,'a');
            assert.equal(typeof c2, 'function');
            assert.equal(c2.length, 2);

            c1 = c2(_,'b');
            assert.equal(typeof c1, 'function');
            assert.equal(c1.length, 1);

            c = c1('c');
            assert.equal(typeof c, 'string');
            assert.equal(c, 'cba');

            c2 = Fun.curryN(2, fn);
            assert.equal(typeof c2, 'function');
            assert.equal(c2.length, 2);

            c1 = c2('b');
            assert.equal(typeof c1, 'function');
            assert.equal(c1.length, 1);

            c = c1('c');
            assert.equal(typeof c, 'string');
            assert.equal(c, 'bcz');
        });
    });

    describe('#make', function() {
        it('should create a new named function', function() {
            var name = 'Test';
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

    describe('#thisify', function() {
        it('should create a function with an implicit this as the last parameter', function() {
            var obj = {
                a: 'apple',
            };

            var fn = Fun.curry(function(suffix, obj) {
                return obj.a + suffix;
            });

            obj.fn = Fun.thisify(fn);

            assert.equal(obj.fn(' starts with a'), 'apple starts with a');
        });

        it('should be able to hand being given too many arguments', function() {
            var obj = {
                a: 'apple',
            };

            var fn = Fun.curry(function(suffix, obj) {
                return obj.a + suffix;
            });

            obj.fn = Fun.thisify(fn);

            assert.equal(obj.fn(' starts with a', 'whatever'), 'apple starts with a');
        });

    });

    describe('#liftN', function() {
        it('should lift a regular function into an applicative one', function() {
            var fn = function(a, b) {
                return a + b;
            };

            var one = [1];
            var two = [2];

            var lifted = Fun.liftN(2, fn);

            var result = lifted(one, two);

            assert.equal(Array.isArray(result), true);
            assert.equal(result.length, 1);
            assert.equal(result[0], 3);

            var first = [1,2];
            var second = [4,6];
            result = lifted(first, second);

            assert.equal(Array.isArray(result), true);
            assert.equal(result.length, 4);
            assert.equal(result[0], 5);
            assert.equal(result[1], 7);
            assert.equal(result[2], 6);
            assert.equal(result[3], 8);
        });
    });

    describe('#lift', function() {
        it('should lift a regular function into an applicative one', function() {
            var fn = function(a, b) {
                return a + b;
            };

            var one = [1];
            var two = [2];

            var lifted = Fun.lift(fn);

            var result = lifted(one, two);

            assert.equal(Array.isArray(result), true);
            assert.equal(result.length, 1);
            assert.equal(result[0], 3);

            var first = [1,2];
            var second = [4,6];
            result = lifted(first, second);

            assert.equal(Array.isArray(result), true);
            assert.equal(result.length, 4);
            assert.equal(result[0], 5);
            assert.equal(result[1], 7);
            assert.equal(result[2], 6);
            assert.equal(result[3], 8);
        });

        describe('#apply', function() {
            it('should apply an array to a function', function() {
                var fn1 = function(a,b) {
                    return a + b;
                };

                var fn2 = function(a,b) {
                    return a * b;
                };

                var ap = Fun.apply([3,6]);

                assert.equal(ap(fn1), 9);
                assert.equal(ap(fn2), 18);
            });

            it('should work with a foldable as well', function() {
                var List = function List() {};
                List = _.Type.sum(List, {Cons: {hd: null, tl: List}, Nil: []});

                List.foldl = _.curry(function(fn, accum, list) {
                    return List.case({
                        Nil: accum,
                        Cons: function(hd, tl) {
                            return List.foldl(fn, fn(accum, hd), tl);
                        },
                    }, list);
                });

                List.foldr = _.curry(function(fn, accum, list) {
                    return List.case({
                        Nil: accum,
                        Cons: function(hd, tl) {
                            return fn(List.foldr(fn, accum, tl), hd);
                        },
                    }, list);
                });

                var fn1 = Fun.curry(function(a,b) {
                    return a + b;
                });

                var fn2 = Fun.curry(function(a,b) {
                    return a * b;
                });

                var ap = Fun.apply(List.Cons(3, List.Cons(6, List.Nil)));

                assert.equal(ap(fn1), 9);
                assert.equal(ap(fn2), 18);

            });
        });

        describe('#flip', function() {
            it('should reorder the first two parameters of a function', function() {
                var fn = function(a,b,c) {
                    return a + b + c;
                };

                var flipped = Fun.flip(fn);

                assert.equal(fn('a','b','c'), 'abc');
                assert.equal(flipped('a','b','c'), 'bac');
            });

        });
    });
});
