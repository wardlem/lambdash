const assert = require('assert');

const _ = require('../src/lambdash');
const _TypedArray = _.TypedArray;
const _Int8Array = _.Int8Array;
const _Uint8Array = _.Uint8Array;
const _Uint8ClampedArray = _.Uint8ClampedArray;
const _Int16Array = _.Int16Array;
const _Uint16Array = _.Uint16Array;
const _Int32Array = _.Int32Array;
const _Uint32Array = _.Uint32Array;
const _Float32Array = _.Float32Array;
const _Float64Array = _.Float64Array;

var assertEqual = function(left, right) {
    if (!_.eq(left,right)) {
        assert.fail(left, right, undefined, 'eq');
    }
};

describe('TypedArray', () => {
    it('defines a module for each view type', () => {
        assert.equal(typeof _TypedArray, 'function');
        assert.equal(typeof _Int8Array, 'function');
        assert.equal(typeof _Uint8Array, 'function');
        assert.equal(typeof _Uint8ClampedArray, 'function');
        assert.equal(typeof _Int16Array, 'function');
        assert.equal(typeof _Uint16Array, 'function');
        assert.equal(typeof _Int32Array, 'function');
        assert.equal(typeof _Uint32Array, 'function');
        assert.equal(typeof _Float32Array, 'function');
        assert.equal(typeof _Float64Array, 'function');
    });

    describe('#eq', () => {
        it('returns true if two typed arrays are structurally equal, false otherwise', () => {
            const u8_1 = Uint8Array.of(0x01, 0x02, 0x03);
            const u8_2 = Uint8Array.of(0x01, 0x02, 0x03);
            const u8_3 = Uint8Array.of(0x01, 0x02, 0x04);
            const u8_4 = Uint8Array.of(0x01, 0x02, 0x03, 0x05);
            const u32_1 = new Uint32Array(u8_4.buffer);
            const u32_2 = Uint32Array.of(0x01, 0x02, 0x03);
            const u32_3 = Uint32Array.of(0x01, 0x02, 0x03);
            const u32_4 = Uint32Array.of(0x01, 0x02, 0x04);

            assert.equal(_Uint8Array.eq(u8_1, u8_1), true);
            assert.equal(_Uint8Array.eq(u8_1, u8_2), true);
            assert.equal(_Uint8Array.eq(u8_1, u8_3), false);
            assert.equal(_Uint8Array.eq(u8_1, u8_4), false);
            assert.equal(_Uint8Array.eq(u8_4, u8_1), false);
            assert.equal(_Uint8Array.eq(u8_4, u32_1), false);
            assert.equal(_Uint32Array.eq(u32_2, u32_3), true);
            assert.equal(_Uint32Array.eq(u32_2, u32_4), false);
        });
    });

    describe('#compare', () => {
        it('compares two arrays and returns an ordering', () => {
            const u8_1 = Uint8Array.of(0x01, 0x02, 0x03);
            const u8_2 = Uint8Array.of(0x01, 0x02, 0x03);
            const u8_3 = Uint8Array.of(0x01, 0x02, 0x04);
            const u8_4 = Uint8Array.of(0x01, 0x02, 0x03, 0x05);
            const u32_1 = Uint32Array.of(0x01, 0x02, 0x03);
            const u32_2 = Uint32Array.of(0x01, 0x02, 0x03);
            const u32_3 = Uint32Array.of(0x01, 0x02, 0x04);

            assert.equal(_Uint8Array.compare(u8_1, u8_1), _.EQ);
            assert.equal(_Uint8Array.compare(u8_1, u8_2), _.EQ);
            assert.equal(_Uint8Array.compare(u8_1, u8_3), _.LT);
            assert.equal(_Uint8Array.compare(u8_3, u8_1), _.GT);
            assert.equal(_Uint8Array.compare(u8_1, u8_4), _.LT);
            assert.equal(_Uint8Array.compare(u8_4, u8_1), _.GT);
            assert.equal(_Uint32Array.compare(u32_1, u32_2), _.EQ);
            assert.equal(_Uint32Array.compare(u32_1, u32_3), _.LT);
            assert.equal(_Uint32Array.compare(u32_3, u32_1), _.GT);
        });
    });

    describe('#fmap', () => {
        it('creates a new typed array with the values of the original altered by a function', () => {
            const u8_1 = Uint8Array.of(1, 2, 3);
            const u32_1 = Uint32Array.of(1, 2, 3);
            const fn = _.mul(2);

            const res1 = _Uint8Array.fmap(fn, u8_1);
            const res2 = _Uint32Array.fmap(fn, u32_1);

            assertEqual(res1, Uint8Array.of(2,4,6));
            assertEqual(u8_1, Uint8Array.of(1,2,3));

            assertEqual(res2, Uint32Array.of(2,4,6));
            assertEqual(u32_1, Uint32Array.of(1,2,3));

            assert(res1 instanceof Uint8Array);
            assert(res2 instanceof Uint32Array);

            assert(u8_1.buffer.byteLength !== u32_1.buffer.byteLength);
        });
    });

    describe('#concat', () => {
        it('joins two typed arrays together', () => {
            const u16_1 = Uint16Array.of(0x01, 0x02, 0x03);
            const u16_2 = Uint16Array.of(0x04, 0x05, 0x06);
            const u16_3 = u16_1.subarray(1,2);

            const res1 = _Uint16Array.concat(u16_1, u16_2);
            const res2 = _Uint16Array.concat(u16_1, u16_3);

            assertEqual(res1, Uint16Array.of(0x01, 0x02, 0x03, 0x04, 0x05, 0x06));
            assertEqual(u16_1, Uint16Array.of(0x01, 0x02, 0x03));
            assertEqual(u16_2, Uint16Array.of(0x04, 0x05, 0x06));
            assertEqual(res2, Uint16Array.of(0x01,0x02,0x03,0x02));

            assert(res1 instanceof Uint16Array);
        });
    });

    describe('#foldl', () => {
        it('folds a typed array from left to right', () => {
            const i16_1 = Int16Array.of(0x01, 0x02, 0x03);
            const fn = (accum, value) => accum + '0x0' + value.toString(16);

            const res = _Int16Array.foldl(fn, 'start', i16_1);

            assertEqual(res, 'start0x010x020x03');
        });
    });

    describe('#foldr', () => {
        it('folds a typed array from right to left', () => {
            const i16_1 = Int16Array.of(0x01, 0x02, 0x03);
            const fn = (accum, value) => accum + '0x0' + value.toString(16);

            const res = _Int16Array.foldr(fn, 'start', i16_1);

            assertEqual(res, 'start0x030x020x01');
        });
    });

    describe('#nth', () => {
        it('fetches the value at an index in a typed array', () => {
            const i32_1 = Int32Array.of(0x01, 0x05, 0x0A);

            assert.equal(_Int32Array.nth(0, i32_1), 0x01);
            assert.equal(_Int32Array.nth(1, i32_1), 0x05);
            assert.equal(_Int32Array.nth(2, i32_1), 0x0A);
        });

        it('throws a RangeError if the index is less than 0', () => {
            const i32_1 = Int32Array.of(0x01, 0x05, 0x0A);

            try {
                _Int32Array.nth(-1, i32_1);
            } catch (e) {
                assert(e instanceof RangeError);
                return;
            }
            throw (new Error('should have thrown'));
        });

        it('throws a RangeError if the index is greater than or equal to the length of the array', () => {
            const i32_1 = Int32Array.of(0x01, 0x05, 0x0A);

            try {
                _Int32Array.nth(3, i32_1);
            } catch (e) {
                assert(e instanceof RangeError);
                return;
            }

            throw (new Error('should have thrown'));
        });
    });

    describe('#of', () => {
        it('returns a typed array with a single value for each of the view types', () => {
            const i8 = _Int8Array.of(0x01);
            const u8 = _Uint8Array.of(0x01);
            const u8c = _Uint8ClampedArray.of(0x01);
            const i16 = _Int16Array.of(0x01);
            const u16 = _Uint16Array.of(0x01);
            const i32 = _Int32Array.of(0x01);
            const u32 = _Uint32Array.of(0x01);
            const f32 = _Float32Array.of(1.5);
            const f64 = _Float64Array.of(1.5);

            assert(i8 instanceof Int8Array);
            assert.equal(i8.length, 1);
            assert.equal(i8[0], 0x01);

            assert(u8 instanceof Uint8Array);
            assert.equal(u8.length, 1);
            assert.equal(u8[0], 0x01);

            assert(u8c instanceof Uint8ClampedArray);
            assert.equal(u8c.length, 1);
            assert.equal(u8c[0], 0x01);

            assert(i16 instanceof Int16Array);
            assert.equal(i16.length, 1);
            assert.equal(i16[0], 0x01);

            assert(u16 instanceof Uint16Array);
            assert.equal(u16.length, 1);
            assert.equal(u16[0], 0x01);

            assert(i32 instanceof Int32Array);
            assert.equal(i32.length, 1);
            assert.equal(i32[0], 0x01);

            assert(u32 instanceof Uint32Array);
            assert.equal(u32.length, 1);
            assert.equal(u32[0], 0x01);

            assert(f32 instanceof Float32Array);
            assert.equal(f32.length, 1);
            assert.equal(f32[0], 1.5);

            assert(f64 instanceof Float64Array);
            assert.equal(f64.length, 1);
            assert.equal(f64[0], 1.5);
        });

        it('is variadic', () => {
            const u8_1 = _Uint8Array.of(0x01, 0x03);
            const u8_2 = _Uint8Array.of();

            assert(u8_1 instanceof Uint8Array);
            assert(u8_2 instanceof Uint8Array);

            assertEqual(u8_1.length, 2);
            assertEqual(u8_2.length, 0);

            assertEqual(u8_1, Uint8Array.of(0x01, 0x03));
            assertEqual(u8_2, Uint8Array.of());
        });
    });

    describe('#show', () => {
        it('creates a string representation of the typed array', () => {
            const i32_1 = Int32Array.of(0x01, 0x05, 0x0A);
            const str = _Int32Array.show(i32_1);

            assertEqual(str, 'Int32Array(0x01,0x05,0x0A)');
        });
    });

    describe('#serializeBE', () => {
        it('encodes a typed array into a Uint8Array in big endian order', () => {
            const i8 = Int8Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const u16 = Uint16Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const i32 = Int32Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const f32 = Float32Array.of(1.5, 2.5);
            const f64 = Float64Array.of(1.5, 2.5);

            const i8Res = _Int8Array.serializeBE(i8);
            const u16Res = _Uint16Array.serializeBE(u16);
            const i32Res = _Int32Array.serializeBE(i32);
            const f32Res = _Float32Array.serializeBE(f32);
            const f64Res = _Float64Array.serializeBE(f64);

            const i8Expected = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x04,
                0xFF, 0x00, 0x0F, 0xF0
            );
            const u16Expected = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x04,
                0x00, 0xFF,
                0x00, 0x00,
                0x00, 0x0F,
                0x00, 0xF0
            );
            const i32Expected = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x04,
                0x00, 0x00, 0x00, 0xFF,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x0F,
                0x00, 0x00, 0x00, 0xF0
            );
            const f32Expected = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x02,
                63, 192, 0, 0,
                64, 32, 0, 0
            );
            const f64Expected = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x02,
                63, 248, 0, 0, 0, 0, 0, 0,
                64, 4, 0, 0, 0, 0, 0, 0
            );

            assert(i8Res instanceof Uint8Array);
            assert(u16Res instanceof Uint8Array);
            assert(i32Res instanceof Uint8Array);
            assert(f32Res instanceof Uint8Array);
            assert(f64Res instanceof Uint8Array);

            assertEqual(i8Res, i8Expected);
            assertEqual(u16Res, u16Expected);
            assertEqual(i32Res, i32Expected);
            assertEqual(f32Res, f32Expected);
            assertEqual(f64Res, f64Expected);

        });
    });

    describe('#serializeLE', () => {
        it('encodes a typed array into a Uint8Array in little endian order', () => {
            const i8 = Int8Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const u16 = Uint16Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const i32 = Int32Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const f32 = Float32Array.of(1.5, 2.5);
            const f64 = Float64Array.of(1.5, 2.5);

            const i8Res = _Int8Array.serializeLE(i8);
            const u16Res = _Uint16Array.serializeLE(u16);
            const i32Res = _Int32Array.serializeLE(i32);
            const f32Res = _Float32Array.serializeLE(f32);
            const f64Res = _Float64Array.serializeLE(f64);

            const i8Expected = _Uint8Array.of(
                0x04, 0x00, 0x00, 0x00,
                0xFF, 0x00, 0x0F, 0xF0
            );
            const u16Expected = _Uint8Array.of(
                0x04, 0x00, 0x00, 0x00,
                0xFF, 0x00,
                0x00, 0x00,
                0x0F, 0x00,
                0xF0, 0x00
            );
            const i32Expected = _Uint8Array.of(
                0x04, 0x00, 0x00, 0x00,
                0xFF, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x0F, 0x00, 0x00, 0x00,
                0xF0, 0x00, 0x00, 0x00
            );
            const f32Expected = _Uint8Array.of(
                0x02, 0x00, 0x00, 0x00,
                0, 0, 192, 63,
                0, 0, 32, 64
            );
            const f64Expected = _Uint8Array.of(
                0x02, 0x00, 0x00, 0x00,
                0, 0, 0, 0, 0, 0, 248, 63,
                0, 0, 0, 0, 0, 0, 4, 64
            );

            assert(i8Res instanceof Uint8Array);
            assert(u16Res instanceof Uint8Array);
            assert(i32Res instanceof Uint8Array);
            assert(f32Res instanceof Uint8Array);
            assert(f64Res instanceof Uint8Array);

            assertEqual(i8Res, i8Expected);
            assertEqual(u16Res, u16Expected);
            assertEqual(i32Res, i32Expected);
            assertEqual(f32Res, f32Expected);
            assertEqual(f64Res, f64Expected);

        });
    });

    describe('#serializeByteLength', () => {
        it('calculates the number of bytes a value will take to serialize', () => {
            const i8 = Int8Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const u16 = Uint16Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const i32 = Int32Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const f32 = Float32Array.of(1.5, 2.5);
            const f64 = Float64Array.of(1.5, 2.5);

            assert.equal(_Int8Array.serializeByteLength(i8), 8);
            assert.equal(_Uint16Array.serializeByteLength(u16), 12);
            assert.equal(_Int32Array.serializeByteLength(i32), 20);
            assert.equal(_Float32Array.serializeByteLength(f32), 12);
            assert.equal(_Float64Array.serializeByteLength(f64), 20);
        });
    });

    describe('#deserializeBE', () => {
        it('creates a typed array from a big-endian encoded Uint8Array', () => {
            const i8Serialized = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x04,
                0xFF, 0x00, 0x0F, 0xF0
            );
            const u16Serialized = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x04,
                0x00, 0xFF,
                0x00, 0x00,
                0x00, 0x0F,
                0x00, 0xF0
            );
            const i32Serialized = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x04,
                0x00, 0x00, 0x00, 0xFF,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x0F,
                0x00, 0x00, 0x00, 0xF0
            );
            const f32Serialized = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x02,
                63, 192, 0, 0,
                64, 32, 0, 0
            );
            const f64Serialized = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x02,
                63, 248, 0, 0, 0, 0, 0, 0,
                64, 4, 0, 0, 0, 0, 0, 0
            );

            const i8Expected = Int8Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const u16Expected = Uint16Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const i32Expected = Int32Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const f32Expected = Float32Array.of(1.5, 2.5);
            const f64Expected = Float64Array.of(1.5, 2.5);

            const i8Result = _Int8Array.deserializeBE(i8Serialized);
            const u16Result = _Uint16Array.deserializeBE(u16Serialized);
            const i32Result = _Int32Array.deserializeBE(i32Serialized);
            const f32Result = _Float32Array.deserializeBE(f32Serialized);
            const f64Result = _Float64Array.deserializeBE(f64Serialized);

            assertEqual(i8Result, i8Expected);
            assertEqual(u16Result, u16Expected);
            assertEqual(i32Result, i32Expected);
            assertEqual(f32Result, f32Expected);
            assertEqual(f64Result, f64Expected);
        });
    });

    describe('#deserializeLE', () => {
        it('creates a typed array from a big-endian encoded Uint8Array', () => {
            const i8Serialized = _Uint8Array.of(
                0x04, 0x00, 0x00, 0x00,
                0xFF, 0x00, 0x0F, 0xF0
            );
            const u16Serialized = _Uint8Array.of(
                0x04, 0x00, 0x00, 0x00,
                0xFF, 0x00,
                0x00, 0x00,
                0x0F, 0x00,
                0xF0, 0x00
            );
            const i32Serialized = _Uint8Array.of(
                0x04, 0x00, 0x00, 0x00,
                0xFF, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x0F, 0x00, 0x00, 0x00,
                0xF0, 0x00, 0x00, 0x00
            );
            const f32Serialized = _Uint8Array.of(
                0x02, 0x00, 0x00, 0x00,
                0, 0, 192, 63,
                0, 0, 32, 64
            );
            const f64Serialized = _Uint8Array.of(
                0x02, 0x00, 0x00, 0x00,
                0, 0, 0, 0, 0, 0, 248, 63,
                0, 0, 0, 0, 0, 0, 4, 64
            );

            const i8Expected = Int8Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const u16Expected = Uint16Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const i32Expected = Int32Array.of(0xFF, 0x00, 0x0F, 0xF0);
            const f32Expected = Float32Array.of(1.5, 2.5);
            const f64Expected = Float64Array.of(1.5, 2.5);

            const i8Result = _Int8Array.deserializeLE(i8Serialized);
            const u16Result = _Uint16Array.deserializeLE(u16Serialized);
            const i32Result = _Int32Array.deserializeLE(i32Serialized);
            const f32Result = _Float32Array.deserializeLE(f32Serialized);
            const f64Result = _Float64Array.deserializeLE(f64Serialized);

            assertEqual(i8Result, i8Expected);
            assertEqual(u16Result, u16Expected);
            assertEqual(i32Result, i32Expected);
            assertEqual(f32Result, f32Expected);
            assertEqual(f64Result, f64Expected);
        });

    });

    describe('#deserializeByteLengthBE', () => {
        it('determines how many bytes it will consume from a buffer during serialization', () => {
            const i8Serialized = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x04,
                0xFF, 0x00, 0x0F, 0xF0
            );
            const u16Serialized = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x04,
                0x00, 0xFF,
                0x00, 0x00,
                0x00, 0x0F,
                0x00, 0xF0
            );
            const i32Serialized = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x04,
                0x00, 0x00, 0x00, 0xFF,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x0F,
                0x00, 0x00, 0x00, 0xF0
            );
            const f32Serialized = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x02,
                63, 192, 0, 0,
                64, 32, 0, 0
            );
            const f64Serialized = _Uint8Array.of(
                0x00, 0x00, 0x00, 0x02,
                63, 248, 0, 0, 0, 0, 0, 0,
                64, 4, 0, 0, 0, 0, 0, 0
            );

            assert.equal(_Int8Array.deserializeByteLengthBE(i8Serialized), 8);
            assert.equal(_Uint16Array.deserializeByteLengthBE(u16Serialized), 12);
            assert.equal(_Int32Array.deserializeByteLengthBE(i32Serialized), 20);
            assert.equal(_Float32Array.deserializeByteLengthBE(f32Serialized), 12);
            assert.equal(_Float64Array.deserializeByteLengthBE(f64Serialized), 20);
        });
    });

    describe('#deserializeByteLengthLE', () => {
        it('determines how many bytes it will consume from a buffer during serialization', () => {
            const i8Serialized = _Uint8Array.of(
                0x04, 0x00, 0x00, 0x00,
                0xFF, 0x00, 0x0F, 0xF0
            );
            const u16Serialized = _Uint8Array.of(
                0x04, 0x00, 0x00, 0x00,
                0xFF, 0x00,
                0x00, 0x00,
                0x0F, 0x00,
                0xF0, 0x00
            );
            const i32Serialized = _Uint8Array.of(
                0x04, 0x00, 0x00, 0x00,
                0xFF, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x0F, 0x00, 0x00, 0x00,
                0xF0, 0x00, 0x00, 0x00
            );
            const f32Serialized = _Uint8Array.of(
                0x02, 0x00, 0x00, 0x00,
                0, 0, 192, 63,
                0, 0, 32, 64
            );
            const f64Serialized = _Uint8Array.of(
                0x02, 0x00, 0x00, 0x00,
                0, 0, 0, 0, 0, 0, 248, 63,
                0, 0, 0, 0, 0, 0, 4, 64
            );

            assert.equal(_Int8Array.deserializeByteLengthLE(i8Serialized), 8);
            assert.equal(_Uint16Array.deserializeByteLengthLE(u16Serialized), 12);
            assert.equal(_Int32Array.deserializeByteLengthLE(i32Serialized), 20);
            assert.equal(_Float32Array.deserializeByteLengthLE(f32Serialized), 12);
            assert.equal(_Float64Array.deserializeByteLengthLE(f64Serialized), 20);
        });
    });

    describe('#hash', () => {

    });

    describe('@implements', () => {
        const u8 = new Uint8Array(0);

        [
            'Eq',
            'Ord',
            'Functor',
            'Foldable',
            'Semigroup',
            'Monoid',
            'Sequential',
            'Show',
            'Serializable',
            'Hashable',
        ].forEach((name) => {
            it(`implements ${name}`, () => {
                assert(_[name].member(u8));
            });
        });
    });
});
