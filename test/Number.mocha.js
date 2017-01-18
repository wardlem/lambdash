var assert = require('assert');

var Num = require('../src/Number');

describe('Number', function() {
    describe('#member', function() {
        it('should return whether or not a value is a member of number', function(){
            assert.equal(Num.member(0), true);
            assert.equal(Num.member(1), true);
            assert.equal(Num.member(5467.123456), true);
            assert.equal(Num.member(null), false);
            assert.equal(Num.member(undefined), false);
            assert.equal(Num.member('hello'), false);
            assert.equal(Num.member([1]), false);
            assert.equal(Num.member({a:1}), false);
        });
    });
});
