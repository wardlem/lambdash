var assert = require('assert');

var Functor = require('../src/Functor');
var Arr = require('../src/Arr');
var Int = require('../src/Int');

describe('Functor', function(){
    describe('#map', function() {
        it('should map over a functor value', function() {
            var arr = [1,3,5,7];
            assert(Arr.eq(Functor.map(Int.add(1), arr), [2,4,6,8]));
            assert(Arr.eq(Functor.map(Int.add(1))(arr), [2,4,6,8]));
        });

        it('should throw an exception if given a null value', function(){
            try {
                Functor.map(function(){}, null);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });

        it('should throw an exception if given undefined', function(){
            try {
                Functor.map(function(){}, undefined);
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#member', function(){
        it('should return true for a value that implements function false otherwise', function(){
            assert(Functor.member([]));
            assert(!Functor.member(null));
            assert(!Functor.member(undefined));
            assert(!Functor.member(false));
            assert(!Functor.member(1));
        })
    });
});