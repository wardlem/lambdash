var assert = require('assert');

var Num = require('../src/Num');

describe('Num', function() {
    describe('#valid', function() {
        it('should return whether or not a number is valid', function(){
            assert.equal(Num.valid(0), true);
            assert.equal(Num.valid(1), true);
            assert.equal(Num.valid(5467.123456), true);
            assert.equal(Num.valid(null), false);
            assert.equal(Num.valid(undefined), false);
            assert.equal(Num.valid('hello'), false);
            assert.equal(Num.valid([1]), false);
            assert.equal(Num.valid({a:1}), false);
        });
    });
});