var assert = require('assert');

var _ = require('../src/lambdash');

var assertEqual = function(left, right){
    if (!_.eq(left,right)){
        assert.fail(left, right, undefined, 'eq');
    }
};


var Set = _.Set;

describe('Set', function(){
    describe('#exists', function(){
        it('should return true if there is a value in a set equal to a given value, false otherwise', function(){
            assert.equal(Set.exists(1)([1,2,3,4,5]), true);
            assert.equal(Set.exists(6)([1,2,3,4,5]), false);
            assert.equal(Set.exists([3])([[1],[2],[3],[4]]),true);
            assert.equal(Set.exists([5])([[1],[2],[3],[4]]),false);
        });

        it('should throw an exception if the value does not implement Set', function(){
            try {
                Set.exists('a', 1);
                assert(false)
            } catch (e) {
                assert(e instanceof(TypeError));
            }
        });
    });


    describe('#insert', function(){
        it('should add a value to a set if it does not already exist', function(){
            assertEqual(Set.insert(3, [1,2,3,4]), [1,2,3,4]);
            assertEqual(Set.insert(5, [1,2,3,4]), [1,2,3,4,5]);
        });

        it('should throw an exception if the value does not implement Set', function(){
            try {
                Set.insert('a', 1);
                assert(false)
            } catch (e) {
                assert(e instanceof(TypeError));
            }
        });
    });

    describe('#remove', function(){
        it('should remove a value from a set', function(){
            assertEqual(Set.remove(1, [2,3,4,5,6,7,8,9]), [2,3,4,5,6,7,8,9]);
            assertEqual(Set.remove(1, [1,2,3,4,5,6,7,8,9]), [2,3,4,5,6,7,8,9]);
        });

        it('should throw an exception if the value does not implement Set', function(){
            try {
                Set.remove('a', 1);
                assert(false)
            } catch (e) {
                assert(e instanceof(TypeError));
            }
        });
    });

    describe('#member', function(){
        it('should return true if a value implements Set, false otherwise', function(){
            assert.equal(Set.member([]), true);
            assert.equal(Set.member({}),false);
            assert.equal(Set.member(null), false);
            assert.equal(Set.member(true), false);
        });
    });
});