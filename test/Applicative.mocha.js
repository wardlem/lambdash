var assert = require('assert');

var _ = require('../src/lambdash');
var Applicative = _.Applicative;

describe('Applicative', function(){
    describe('#ap', function(){
        it('should call the value of one applicative with the value of another as an argument', function(){
            var ap = [_.add(1)];
            var v = [2,3];

            var result = Applicative.ap(ap, v);

            assert(_.Arr.member(result));
            assert.equal(result.length, 2);
            assert.equal(result[0], 3);
            assert.equal(result[1], 4);
        });

        it('should throw a TypeError if the type of the values does not implement Applicative', function(){
            var NotApp = _.Type.product("NotApp", {value: null});

            assert(!Applicative.member(NotApp));

            var ap = NotApp(_.add(1));
            var v = NotApp(2);

            try {
                Applicative.ap(ap, v);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
                assert(e.message.indexOf("does not implement Applicative") > -1);
            }
        });
    });

    describe('#member', function(){
        it('should return true if a value is a member of Applicative false otherwise', function(){
            var Ap = _.Type.product("Ap", {value: null});

            Ap.fmap = function(fn, ap) {
                return Ap(fn, ap);
            };

            Ap.of = Ap;

            assert(!Applicative.member(Ap(1)));

            Ap.ap = function(left, right){
                return Ap(left.value(right.value));
            };

            assert(Applicative.member(Ap(1)));
        });

        it('should return false if the value is undefined or null', function(){
            assert(!Applicative.member(null));
            assert(!Applicative.member(undefined));
        });
    });
});
