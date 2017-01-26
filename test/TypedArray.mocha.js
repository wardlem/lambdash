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

var assertEqual = function(left, right){
    if (!_.eq(left,right)){
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

            assert(u8_1.buffer.byteLength !== u32_1.buffer.byteLength)
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
            const fn = (accum, value) => accum + "0x0" + value.toString(16);

            const res = _Int16Array.foldl(fn, "start", i16_1);

            assertEqual(res, "start0x010x020x03");
        });
    });

    describe('#foldr', () => {
        it('folds a typed array from right to left', () => {
            const i16_1 = Int16Array.of(0x01, 0x02, 0x03);
            const fn = (accum, value) => accum + "0x0" + value.toString(16);

            const res = _Int16Array.foldr(fn, "start", i16_1);

            assertEqual(res, "start0x030x020x01");
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
            throw(new Error('should have thrown'));
        });

        it ('throws a RangeError if the index is greater than or equal to the length of the array', () => {
            const i32_1 = Int32Array.of(0x01, 0x05, 0x0A);

            try {
                _Int32Array.nth(3, i32_1);
            } catch (e) {
                assert(e instanceof RangeError);
                return;
            }

            throw(new Error('should have thrown'));
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

            assertEqual(str, "Int32Array(0x01,0x05,0x0A)");
        });
    });

    describe('@implements', () => {
        const u8 = new Uint8Array(0);

        [
            "Eq",
            "Ord",
            "Functor",
            "Foldable",
            "Semigroup",
            "Monoid",
            "Sequential",
            "Show"
        ].forEach((name) => {
            it(`implements ${name}`, () => {
                assert(_[name].member(u8));
            });
        })
    });
});
