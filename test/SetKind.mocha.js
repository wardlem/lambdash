var assert = require('assert');

var _ = require('../src/lambdash');

var assertEqual = function(left, right){
    if (!_.eq(left,right)){
        assert.fail(left, right, undefined, 'eq');
    }
};


const SetKind = _.SetKind;

describe('SetKind', function(){
    describe('#exists', function(){
        it('should return true if there is a value in a set equal to a given value, false otherwise', function(){
            assert.equal(SetKind.exists(1)([1,2,3,4,5]), true);
            assert.equal(SetKind.exists(6)([1,2,3,4,5]), false);
            assert.equal(SetKind.exists([3])([[1],[2],[3],[4]]),true);
            assert.equal(SetKind.exists([5])([[1],[2],[3],[4]]),false);
        });

        it('should throw an exception if the value does not implement SetKind', function(){
            try {
                SetKind.exists('a', 1);
                assert(false)
            } catch (e) {
                assert(e instanceof(TypeError));
            }
        });
    });


    describe('#insert', function(){
        it('should add a value to a set if it does not already exist', function(){
            assertEqual(SetKind.insert(3, [1,2,3,4]), [1,2,3,4]);
            assertEqual(SetKind.insert(5, [1,2,3,4]), [1,2,3,4,5]);
        });

        it('should throw an exception if the value does not implement SetKind', function(){
            try {
                SetKind.insert('a', 1);
                assert(false)
            } catch (e) {
                assert(e instanceof(TypeError));
            }
        });
    });

    describe('#remove', function(){
        it('should remove a value from a set', function(){
            assertEqual(SetKind.remove(1, [2,3,4,5,6,7,8,9]), [2,3,4,5,6,7,8,9]);
            assertEqual(SetKind.remove(1, [1,2,3,4,5,6,7,8,9]), [2,3,4,5,6,7,8,9]);
        });

        it('should throw an exception if the value does not implement SetKind', function(){
            try {
                SetKind.remove('a', 1);
                assert(false)
            } catch (e) {
                assert(e instanceof(TypeError));
            }
        });
    });

    describe('#member', function(){
        it('should return true if a value implements SetKind, false otherwise', function(){
            assert.equal(SetKind.member([]), true);
            assert.equal(SetKind.member({}),false);
            assert.equal(SetKind.member(null), false);
            assert.equal(SetKind.member(true), false);
        });
    });
});
