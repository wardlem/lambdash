var assert = require('assert');

var _ = require('../src/lambdash');
var Bounded = _.Bounded;

describe('Bounded', function(){
    describe('#isMin', function(){
        it('should return true if a value is the minimum value of its type', function(){
            assert.equal(Bounded.isMin(false), true);
            assert.equal(Bounded.isMin(true), false);
        });
    });

    describe('#isMax', function(){
        it('should return true if a value is the maximum value of its type', function(){
            assert.equal(Bounded.isMax(false), false);
            assert.equal(Bounded.isMax(true), true);
        });
    });

    describe('#minBound', function(){
        it('should return the minimum bound of a value', function() {
            assert.equal(Bounded.minBound(true), false);
            assert.equal(Bounded.minBound(false), false);
        });
    });

    describe('#maxBound', function(){
        it('should return the maximum bound of a value', function() {
            assert.equal(Bounded.maxBound(true), true);
            assert.equal(Bounded.maxBound(false), true);
        });
    });

    describe('#member', function(){
        it('should return true if a value implements bounded, false otherwise', function(){
            assert(Bounded.member(true));
            assert(!Bounded.member([]));
            assert(!Bounded.member(undefined));
            assert(!Bounded.member(null));
            assert(!Bounded.member({}));
        });
    });
});