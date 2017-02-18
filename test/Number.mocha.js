const assert = require('assert');

const _ = require('../src/lambdash');
const Num = _.Number;


const assertEqual = function(left, right){
    if (!_.eq(left,right)){
        assert.fail(left, right, undefined, 'eq');
    }
};

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

    describe('#serializeBE', () => {
        it('serializes a number into an Uint8Array in 8 bytes', () => {
            const float = 12.25;
            const expected = Uint8Array.from([
                64, 40, 128, 0, 0, 0, 0, 0,
            ]);
            const result = Num.serializeBE(float);

            assert(result instanceof Uint8Array);
            assertEqual(result, expected);
        });
    });

    describe('#serializeLE', () => {
        it('serializes a number into an Uint8Array in 8 bytes', () => {
            const float = 12.25;
            const expected = Uint8Array.from([
                0, 0, 0, 0, 0, 128, 40, 64
            ]);
            const result = Num.serializeLE(float);

            assert(result instanceof Uint8Array);
            assertEqual(result, expected);
        });
    });

    describe('@implements', () => {
        [
            "Eq",
            "Ord",
            "Enum",
            "Numeric",
            "Show",
            "Serializable",
            "Hashable"
        ].forEach((kindName) => {
            it(`implements ${kindName}`, () => {
                assert(_[kindName].member(1));
            });
        })
    });
});
