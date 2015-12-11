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
    });
});