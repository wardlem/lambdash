const assert = require('assert');

const _ = require('../src/lambdash');
const _ArrayBuffer = _.ArrayBuffer;

const assertEqual = function(left, right){
    if (!_.eq(left,right)){
        assert.fail(left, right, undefined, 'eq');
    }
};

describe('ArrayBuffer', () => {
    describe('#eq', () => {
        it('returns true if two ArrayBuffers are structurally equal, false otherwise', () => {
            const arr = _ArrayBuffer.of(0x01, 0x02, 0x03);
            assert(arr instanceof ArrayBuffer);
            assertEqual(arr.byteLength, 3);
            assertEqual(_ArrayBuffer.eq(arr, arr), true);
            assertEqual(_ArrayBuffer.eq(arr, _ArrayBuffer.of(0x01, 0x02, 0x03)), true);
            assertEqual(_ArrayBuffer.eq(arr, _ArrayBuffer.of(0x01, 0x02, 0x04)), false);
        });
    });

    describe('#compare', () => {
        it('returns an ordering from two array buffers', () => {
            const arr_1 = _ArrayBuffer.of(0x01, 0x02, 0x03);
            const arr_2 = _ArrayBuffer.of(0x01, 0x02, 0x03);
            const arr_3 = _ArrayBuffer.of(0x01, 0x02, 0x04);
            const arr_4 = _ArrayBuffer.of(0x01, 0x02, 0x03, 0x04);
            assert.equal(_ArrayBuffer.compare(arr_1, arr_1), _.EQ);
            assert.equal(_ArrayBuffer.compare(arr_1, arr_2), _.EQ);
            assert.equal(_ArrayBuffer.compare(arr_1, arr_3), _.LT);
            assert.equal(_ArrayBuffer.compare(arr_3, arr_1), _.GT);
            assert.equal(_ArrayBuffer.compare(arr_1, arr_4), _.LT);
            assert.equal(_ArrayBuffer.compare(arr_4, arr_1), _.GT);
        });
    });

    describe('#fmap', () => {
        it('returns a new buffer with a function applied to each byte of the original', () => {
            const arr_1 = _ArrayBuffer.of(0x01, 0x02, 0x03);
            const fn = _.mul(3);
            const res = _ArrayBuffer.fmap(fn, arr_1);

            assert(res instanceof ArrayBuffer);
            assertEqual(res, _ArrayBuffer.of(0x03, 0x06, 0x09));
            assert(arr_1 !== res);
            assertEqual(arr_1, _ArrayBuffer.of(0x01, 0x02, 0x03));
        });
    });

    describe('#concat', () => {
        it('joins rwo buffers into one', () => {
            const arr_1 = _ArrayBuffer.of(0x01, 0x02, 0x03);
            const arr_2 = _ArrayBuffer.of(0x04, 0x03, 0x06);
            const res = _ArrayBuffer.concat(arr_1, arr_2);

            assert(res instanceof ArrayBuffer);
            assertEqual(res, _ArrayBuffer.of(0x01, 0x02, 0x03, 0x04, 0x03, 0x06));
        });
    });

    describe('#empty', () => {
        it('returns an empty array buffer', () => {
            const arr = _ArrayBuffer.empty();
            assert(arr instanceof ArrayBuffer);
            assert.equal(arr.byteLength, 0);
        });
    });

    describe('#foldl', () => {
        it('reduces a buffer to a single value from left to right', () => {
            const arr = _ArrayBuffer.of(1,2,3);
            const fn = (a, b) => a + b;

            const res = _ArrayBuffer.foldl(fn, 'start', arr);
            assertEqual(res, "start123");
        });
    });

    describe('#foldr', () => {
        it('reduces a buffer to a single value from right to left', () => {
            const arr = _ArrayBuffer.of(1,2,3);
            const fn = (a, b) => a + b;

            const res = _ArrayBuffer.foldr(fn, 'start', arr);
            assertEqual(res, "start321");
        });
    });

    describe('#nth', () => {
        it('fetches a byte at a given index', () => {
            const arr = _ArrayBuffer.of(4,7,12);

            assert.equal(_ArrayBuffer.nth(0, arr), 4);
            assert.equal(_ArrayBuffer.nth(1, arr), 7);
            assert.equal(_ArrayBuffer.nth(2, arr), 12);
        });

        it('throws a RangeError if the index is less than 0', () => {
            const arr = _ArrayBuffer.of(4,7,12);

            try {
                _ArrayBuffer.nth(-1, arr);
            } catch (e) {
                assert (e instanceof RangeError);
                return;
            }

            throw(new Error('Should have thrown'));
        });

        it('throws a RangeError if the index is greater than or equal to the size of the buffer', () => {
            const arr = _ArrayBuffer.of(4,7,12);

            try {
                _ArrayBuffer.nth(3, arr);
            } catch (e) {
                assert (e instanceof RangeError);
                return;
            }

            throw(new Error('Should have thrown'));
        });
    });

    describe('#of', () => {
        it('returns an Array buffer with the values passed in', () => {
            const arr1 = _ArrayBuffer.of();
            const arr2 = _ArrayBuffer.of(1,4,6);
            const arr3 = _ArrayBuffer.of(4);

            assert.equal(arr1.byteLength, 0);
            assert.equal(arr2.byteLength, 3);
            assert.equal(arr3.byteLength, 1);
        });
    });

    describe('#show', () => {
        it('creates a string representation of the the buffer', () => {
            const arr = _ArrayBuffer.of(1,4,5);

            const res = _ArrayBuffer.show(arr);
            assert.equal(res, "ArrayBuffer(0x01,0x04,0x05)");
        });
    });

    describe('#hash', () => {
        it('hashes a buffer and returns an integer', () => {
            const values = _.fmap((c) => c.charCodeAt(0), "node.js".split(''));
            const buffer = Uint8Array.from(values).buffer;

            const hash = _ArrayBuffer.hash(buffer);

            assert.equal(hash, 3096844302);
        });
    });

    describe('#serializeBE', () => {
        it('seralizes a buffer with the size in big endian byte order', () => {
            const buffer = _ArrayBuffer.of(0x02, 0x05, 0x09);
            const serialized = _ArrayBuffer.serializeBE(buffer);
            const expected = Uint8Array.of(
                0x00, 0x00, 0x00, 0x03,
                0x02, 0x05, 0x09
            );
            assertEqual(serialized, expected);
        });
    });

    describe('#serializeLE', () => {
        it('seralizes a buffer with the size in little endian byte order', () => {
            const buffer = _ArrayBuffer.of(0x02, 0x05, 0x09);
            const serialized = _ArrayBuffer.serializeLE(buffer);
            const expected = Uint8Array.of(
                0x03, 0x00, 0x00, 0x00,
                0x02, 0x05, 0x09
            );
            assertEqual(serialized, expected);
        });
    });

    describe('#deserializeBE', () => {
        it('deserializes a buffer with the byte length in big endian order', () => {
            const serialized = Uint8Array.of(
                0x00, 0x00, 0x00, 0x03,
                0x02, 0x05, 0x09
            );
            const expected = _ArrayBuffer.of(0x02, 0x05, 0x09);
            const result = _ArrayBuffer.deserializeBE(serialized);

            assertEqual(result, expected);
        });

        it('ignores additional bytes', () => {
            const serialized = Uint8Array.of(
                0x00, 0x00, 0x00, 0x03,
                0x02, 0x05, 0x09,
                0x04, 0x06, 0x0F
            );
            const expected = _ArrayBuffer.of(0x02, 0x05, 0x09);
            const result = _ArrayBuffer.deserializeBE(serialized);

            assertEqual(result, expected);
        });
    });

    describe('#deserializeBE', () => {
        it('deserializes a buffer with the byte length in big endian order', () => {
            const serialized = Uint8Array.of(
                0x03, 0x00, 0x00, 0x00,
                0x02, 0x05, 0x09
            );
            const expected = _ArrayBuffer.of(0x02, 0x05, 0x09);
            const result = _ArrayBuffer.deserializeLE(serialized);

            assertEqual(result, expected);
        });

        it('ignores additional bytes', () => {
            const serialized = Uint8Array.of(
                0x03, 0x00, 0x00, 0x00,
                0x02, 0x05, 0x09,
                0x04, 0x06, 0x0F
            );
            const expected = _ArrayBuffer.of(0x02, 0x05, 0x09);
            const result = _ArrayBuffer.deserializeLE(serialized);

            assertEqual(result, expected);
        });
    });

    describe('#serializeByteLength', () => {
        it('returns how many bytes it will take to serialize the buffer', () => {
            const buffer = _ArrayBuffer.of(0x02, 0x05, 0x09);

            assert.equal(_ArrayBuffer.serializeByteLength(buffer), 7);
        });
    });

    describe('#deserializeByteLengthBE', () => {
        it('returns the number of bytes that will be used when deserialized from big endian', () => {
            const serialized = Uint8Array.of(
                0x00, 0x00, 0x00, 0x03,
                0x02, 0x05, 0x09,
                0x04, 0x06, 0x0F
            );

            assert.equal(_ArrayBuffer.deserializeByteLengthBE(serialized), 7);
        });
    });

    describe('#deserializeByteLengthLE', () => {
        it('returns the number of bytes that will be used when deserialized from big endian', () => {
            const serialized = Uint8Array.of(
                0x03, 0x00, 0x00, 0x00,
                0x02, 0x05, 0x09,
                0x04, 0x06, 0x0F
            );

            assert.equal(_ArrayBuffer.deserializeByteLengthLE(serialized), 7);
        });
    });

    describe('@implements', () => {
        const arr = _ArrayBuffer.of();

        [
            "Eq",
            "Ord",
            "Functor",
            "Foldable",
            "Semigroup",
            "Monoid",
            "Sequential",
            "Show",
            "Serializable"
        ].forEach((name) => {
            it(`implements ${name}`, () => {
                assert(_[name].member(arr));
            });
        })
    });
});
