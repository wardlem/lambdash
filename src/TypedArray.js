const _curry = require('./internal/_curry');
const _arrEqual = require('./internal/_arrayEqual');

const Ord = require('./Ord');
const Ordering = require('./Ordering');
const Sequential = require('./Sequential');
const ByteOrder = require('./ByteOrder');
const _ArrayBuffer = require('./internal/_primitives').ArrayBuffer;
const _Integer = require('./internal/_primitives').Integer;

/**
 * _TypedArray is the module for javascript's built-in TypedArray types.
 *
 * @module
 * @implements Eq
 * @implements Ord
 * @implements Functor
 * @implements Foldable
 * @implements Semigroup
 * @implements Monoid
 * @implements Sequential
 * @implements Show
 * @implements Serializable
 * @implements Hashable
 */
const _TypedArray = require('./internal/_primitives').TypedArray;

_TypedArray.eq = _curry(_arrEqual);

_TypedArray.compare = _curry(function(left, right) {
    // todo: this code is identical to that in Array...refactor
    if (left === right) {
        // short-circuit
        return Ordering.EQ;
    }

    const len = Math.min(left.length, right.length);
    for (let ind = 0; ind < len; ind += 1) {
        const ordering = Ord.compare(left[ind], right[ind]);
        if (!Ordering.isEQ(ordering)) {
            return ordering;
        }
    }

    return Ordering.fromNum(left.length - right.length);
});

_TypedArray.fmap = _curry(function(fn, array) {
    const result = new array.constructor(array.length);
    for (let i = 0, l = result.length; i < l; i += 1) {
        result[i] = fn(array[i]);
    }
    return result;
});

_TypedArray.concat = _curry(function(left, right) {
    const result = new left.constructor(left.length + right.length);

    for (let i = 0, l = left.length; i < l; i += 1) {
        result[i] = left[i];
    }

    for (let i = 0, l = right.length; i < l; i += 1) {
        result[i + left.length] = right[i];
    }
    return result;
});

_TypedArray.foldl = _curry(function(fn, init, array) {
    return array.reduce(fn, init);
});

_TypedArray.foldr = _curry(function(fn, init, array) {
    return array.reduceRight(fn, init);
});

const swapBytes2 = function(array) {
    const u8s = new Uint8Array(array.buffer);
    for (let i = 0, l = u8s.length; i < l; i += 2) {
        let t0 = u8s[i];
        u8s[i] = u8s[i + 1];
        u8s[i + 1] = t0;
    }
};

const swapBytes4 = function(array) {
    const u8s = new Uint8Array(array.buffer);
    for (let i = 0, l = u8s.length; i < l; i += 4) {
        let t0 = u8s[i];
        let t1 = u8s[i + 1];
        u8s[i] = u8s[i + 3];
        u8s[i + 1] = u8s[i + 2];
        u8s[i + 2] = t1;
        u8s[i + 3] = t0;
    }
};

const swapBytes8 = function(array) {
    const u8s = new Uint8Array(array.buffer);
    for (let i = 0, l = u8s.length; i < l; i += 8) {
        let t0 = u8s[i];
        let t1 = u8s[i + 1];
        let t2 = u8s[i + 2];
        let t3 = u8s[i + 3];
        u8s[i] = u8s[i + 7];
        u8s[i + 1] = u8s[i + 6];
        u8s[i + 2] = u8s[i + 5];
        u8s[i + 3] = u8s[i + 4];
        u8s[i + 4] = t3;
        u8s[i + 5] = t2;
        u8s[i + 6] = t1;
        u8s[i + 7] = t0;
    }
};

const swapBytes = function(array) {
    const BYTES_PER_ELEMENT = array.constructor.BYTES_PER_ELEMENT;
    switch (BYTES_PER_ELEMENT) {
        case 2:
            swapBytes2(array);
            break;
        case 4:
            swapBytes4(array);
            break;
        case 8:
            swapBytes8(array);
            break;
    }
};

_TypedArray.serializeBE = _curry(function(array) {
    array = Sequential.drop(0, array);
    if (!ByteOrder.archIsBE()) {
        swapBytes(array);
    }
    const sizeSerialized = _Integer.serializeBE(array.length);
    return _TypedArray.Uint8Array.concat(sizeSerialized, new Uint8Array(array.buffer));
});

_TypedArray.serializeLE = _curry(function(array) {
    array = Sequential.drop(0, array);
    if (!ByteOrder.archIsLE()) {
        swapBytes(array);
    }
    const sizeSerialized = _Integer.serializeLE(array.length);
    return _TypedArray.Uint8Array.concat(sizeSerialized, new Uint8Array(array.buffer));
});

_TypedArray.serializeByteLength = _curry(function(source) {
    return 4 + (source.constructor.BYTES_PER_ELEMENT * source.length);
});

_TypedArray.hash = _curry(function(array) {
    array = Sequential.drop(0, array);
    return _ArrayBuffer.hash(array.buffer);
});

_TypedArray.hashWithSeed = _curry(function(seed, array) {
    array = Sequential.drop(0, array);
    return _ArrayBuffer.hashWithSeed(seed, array.buffer);
});

_TypedArray.nth = _curry(function(index, array) {
    if (index < 0 || index >= array.length) {
        throw new RangeError('Index out of bounds');
    }

    return array[index];
});

_TypedArray.show = _curry(function(array) {
    let vs = _TypedArray.foldl((arr, value) => arr.concat([`0x0${value.toString(16).toUpperCase()}`]), [], array);
    return `${array.constructor.name}(${vs.join(',')})`;
});

const TypedArrayTypes = [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
].map((C) => {
    const M = require('./internal/_primitives')[C.name];
    for (let key in _TypedArray) {
        if (!M[key]) {
            M[key] = _TypedArray[key];
        }
    }

    M.of = function(...values) {
        return C.from(values);
    };

    M.empty = function() {
        return new C(0);
    };

    M.deserializeBE = _curry(function(source) {
        const size = _Integer.deserializeBE(source);
        const buffer = Sequential.slice(4, (size * C.BYTES_PER_ELEMENT) + 4, source).buffer;
        const result = new C(buffer);
        if (ByteOrder.archIsLE()) {
            swapBytes(result);
        }
        return result;
    });

    M.deserializeLE = _curry(function(source) {
        const size = _Integer.deserializeLE(source);
        const buffer = Sequential.slice(4, (size * C.BYTES_PER_ELEMENT) + 4, source).buffer;
        const result = new C(buffer);
        if (ByteOrder.archIsBE()) {
            swapBytes(result);
        }
        return result;
    });

    M.deserializeByteLengthBE = _curry(function(source) {
        const size = _Integer.deserializeBE(source);

        return 4 + (size * C.BYTES_PER_ELEMENT);
    });

    M.deserializeByteLengthLE = _curry(function(source) {
        const size = _Integer.deserializeLE(source);
        return 4 + (size * C.BYTES_PER_ELEMENT);
    });

    return M;
});

TypedArrayTypes.forEach(function(M) {
    _TypedArray[M.name] = M;
});

module.exports = _TypedArray;
