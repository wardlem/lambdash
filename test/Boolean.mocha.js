const assert = require('assert');

const _ = require('../src/lambdash');
const Bool = _.Boolean;

const assertEqual = function(left, right){
    if (!_.eq(left,right)){
        assert.fail(left, right, undefined, 'eq');
    }
};

describe('Boolean', function(){
    describe('#member', function(){
        it('should return true if the given value is a boolean', function(){
            assert(Bool.member(true));
            assert(Bool.member(false));
        });

        it('should return false if the given value is not a boolean', function(){
            assert(!Bool.member({}));
            assert(!Bool.member([]));
            assert(!Bool.member(null));
            assert(!Bool.member([true]));
            assert(!Bool.member(undefined));
            assert(!Bool.member(1));
            assert(!Bool.member("true"));
            assert(!Bool.member(""));
        });
    });

    describe('#eq', function(){
        it('should return true if two booleans are equal, false otherwise', function(){
            assert(Bool.eq(true, true));
            assert(Bool.eq(false, false));
            assert(!Bool.eq(false, true));
            assert(!Bool.eq(true, false));
        });
    });

    describe('#toInt', function(){
        it('should return 1 for true 0 for false', function(){
            assert.equal(Bool.toInt(true),1);
            assert.equal(Bool.toInt(false),0);
        });
    });

    describe('#fromInt', function(){
        it('should return false for 0 true for any other number', function(){
            assert.equal(Bool.fromInt(0), false);
            assert.equal(Bool.fromInt(1), true);
            assert.equal(Bool.fromInt(-1), true);
            assert.equal(Bool.fromInt(-189), true);
        });
    });

    describe('#minBound', function(){
        it('should always return false', function(){
            assert.equal(Bool.minBound(), false);
        })
    });

    describe('#maxBound', function(){
        it('should always return true', function(){
            assert.equal(Bool.maxBound(), true);
        })
    });

    describe('#and', function(){
        it('should return true if both values are true, false otherwise', function(){
            assert.equal(Bool.and(true)(true), true);
            assert.equal(Bool.and(false)(true), false);
            assert.equal(Bool.and(false)(false), false);
            assert.equal(Bool.and(true)(false), false);
        });
    });

    describe('#or', function(){
        it('should return true if either value is true, false otherwise', function(){
            assert.equal(Bool.or(true)(true), true);
            assert.equal(Bool.or(false)(true), true);
            assert.equal(Bool.or(false)(false), false);
            assert.equal(Bool.or(true)(false), true);
        });
    });

    describe('#xor', function(){
        it('should return true if one and only one of the values is true, false otherwise', function(){
            assert.equal(Bool.xor(true)(true), false);
            assert.equal(Bool.xor(false)(true), true);
            assert.equal(Bool.xor(false)(false), false);
            assert.equal(Bool.xor(true)(false), true);
        });
    });

    describe('#not', function(){
        it('should return the inverse of a boolean value', function(){
            assert.equal(Bool.not(false), true);
            assert.equal(Bool.not(true), false);
        });
    });

    describe('#both', function(){
        it('should return true if both predicate functions return true', function(){
            assert.equal(Bool.both(Bool.T, Bool.T)(), true);
            assert.equal(Bool.both(Bool.F, Bool.T)(), false);
            assert.equal(Bool.both(Bool.T, Bool.F)(), false);
            assert.equal(Bool.both(Bool.F, Bool.F)(), false);
        });

        it('should accept arguments that are applied to both functions', function(){
            var b = Bool.both(_.eq, function(a, b){ return a > 2 && b < 5});

            assert.equal(b(1,2), false);
            assert.equal(b(3,3), true);
        });
    });

    describe('#either', function(){
        it('should return true if at least one predicate functions return true', function(){
            assert.equal(Bool.either(Bool.T, Bool.T)(), true);
            assert.equal(Bool.either(Bool.F, Bool.T)(), true);
            assert.equal(Bool.either(Bool.T, Bool.F)(), true);
            assert.equal(Bool.either(Bool.F, Bool.F)(), false);
        });

        it('should accept arguments that are applied to both functions', function(){
            var b = Bool.either(_.eq, function(a, b){ return a > 2 && b < 5});

            assert.equal(b(3,2), true);
            assert.equal(b(6,6), true);
            assert.equal(b(6,7), false);
        });
    });

    describe('#neither', function(){
        it('should return true if both predicates return false', function(){
            assert.equal(Bool.neither(Bool.T, Bool.T)(), false);
            assert.equal(Bool.neither(Bool.F, Bool.T)(), false);
            assert.equal(Bool.neither(Bool.T, Bool.F)(), false);
            assert.equal(Bool.neither(Bool.F, Bool.F)(), true);
        });

        it('should accept arguments that are applied to both functions', function(){
            var b = Bool.neither(_.eq, function(a, b){ return a > 2 && b < 5});

            assert.equal(b(3,2), false);
            assert.equal(b(6,6), false);
            assert.equal(b(6,7), true);
        });
    });

    describe('#eitherExclusive', function(){
        it('should return true if at exactly one predicate functions return true', function(){
            assert.equal(Bool.eitherExclusive(Bool.T, Bool.T)(), false);
            assert.equal(Bool.eitherExclusive(Bool.F, Bool.T)(), true);
            assert.equal(Bool.eitherExclusive(Bool.T, Bool.F)(), true);
            assert.equal(Bool.eitherExclusive(Bool.F, Bool.F)(), false);
        });

        it('should accept arguments that are applied to both functions', function(){
            var b = Bool.eitherExclusive(_.eq, function(a, b){ return a > 2 && b < 5});

            assert.equal(b(3,2), true);
            assert.equal(b(6,6), true);
            assert.equal(b(6,7), false);
            assert.equal(b(3,3), false);
        });
    });

    describe('#complement', function(){
        it('should return a function that inverts the result of another function', function(){
            assert.equal(Bool.complement(Bool.T)(), false);
            assert.equal(Bool.complement(Bool.F)(), true);
        });

        it('should accept arguments that are applied the functions', function(){

            var b = Bool.complement(_.eq);
            assert.equal(b(3,2), true);
            assert.equal(b(6,6), false);
            assert.equal(b(6,7), true);
            assert.equal(b(3,3), false);
        });
    });

    describe('#condition', function(){
        it('should create a branching function', function(){
            var sizer = _.condition(
                [_.lt(_, 1), _.always("Too small.")],
                [_.lt(_, 5), _.always("An ok size.")],
                [_.lt(_, 10), _.always("A big one!")],
                [_.T, function(v) {return "A " + v + " pounder! What a whopper!"}]
            );

            assert.equal(sizer(0.5), "Too small.");
            assert.equal(sizer(7), "A big one!");
            assert.equal(sizer(54), "A 54 pounder! What a whopper!")
        });
    });

    describe('#T', function(){
        it('should always return true', function(){
            assert.equal(Bool.T(), true);
        });
    });

    describe('#F', function(){
        it('should always return false', function(){
            assert.equal(Bool.F(), false);
        });
    });

    describe('#show', function() {
        it('should return a string representation of the boolean value', function(){
            assert.equal(Bool.show(true), 'true');
            assert.equal(Bool.show(false), 'false');
        });
    });

    describe('#serializeBE, #serializeLE', () => {
        it('serializes a boolean into a Uint8Array', () => {
            assertEqual(Bool.serializeBE(false), Uint8Array.of(0x00));
            assertEqual(Bool.serializeBE(true), Uint8Array.of(0x01));
            assertEqual(Bool.serializeLE(false), Uint8Array.of(0x00));
            assertEqual(Bool.serializeLE(true), Uint8Array.of(0x01));
        });
    });

    describe('#deserializeBE, #deserializeLE', () => {
        it('deserializes a Uint8Array into a Boolean', () => {
            const falseSerialized = Uint8Array.of(0x00);
            const trueSerialized = Uint8Array.of(0x01);

            assertEqual(Bool.deserializeBE(falseSerialized), false);
            assertEqual(Bool.deserializeBE(trueSerialized), true);
            assertEqual(Bool.deserializeLE(falseSerialized), false);
            assertEqual(Bool.deserializeLE(trueSerialized), true);
        });
    });

    describe('#serializeByteLength, #deserializeByteLengthBE, #deserializeByteLengthLE', () => {
        it('always returns 1', () => {
            const u8s = Uint8Array.of(1);
            assert.equal(Bool.serializeByteLength(false), 1);
            assert.equal(Bool.deserializeByteLengthBE(u8s), 1);
            assert.equal(Bool.deserializeByteLengthLE(u8s), 1);
        });
    });

    describe('#hash', () => {
        it('converts a boolean to a hashed integer', () => {
            const trueHash = Bool.hash(true);
            const falseHash = Bool.hash(false);

            assert(_.Integer.member(trueHash));
            assert(_.Integer.member(falseHash));

            assert.equal(trueHash, Bool.hash(true));
            assert.equal(falseHash, Bool.hash(false));
            assert(trueHash !== falseHash)
        });
    });

    describe('@implements', function(){
        it('should implement Eq', function(){
            assert(_.Eq.member(false));
            assert(_.Eq.member(true));
        });

        it('should implement Ord', function(){
            assert(_.Ord.member(false));
            assert(_.Ord.member(true));
        });

        it('should implement Enum', function(){
            assert(_.Enum.member(false));
            assert(_.Enum.member(true));
        });

        it('should implement Bounded', function(){
            assert(_.Bounded.member(false));
            assert(_.Bounded.member(true));
        });

        it('should implement Show', function() {
            assert(_.Show.member(false));
            assert(_.Show.member(true));
        });

        it('should implement Serializable', function() {
            assert(_.Serializable.member(false));
            assert(_.Serializable.member(true));
        });

        it('should implement Hashable', function() {
            assert(_.Hashable.member(false));
            assert(_.Hashable.member(true));
        });
    });
});
