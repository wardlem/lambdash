const _is = require('./internal/_is');
const _curry = require('./internal/_curry');
const _curryN = require('./internal/_curryN');
const _identity = require('./internal/_identity');
const _always = require('./internal/_always');

const Ordering = require('./Ordering');
const ByteOrder = require('./ByteOrder');
const Sequential = require('./Sequential');
const Serializable = require('./Serializable');
const Hashable = require('./Hashable');

const _Integer = require('./internal/_primitives').Integer;

// Implementation for Eq
_Integer.eq = _is;

// Implementation for Ord
_Integer.compare = _curry(function(left, right) {
    return Ordering.fromInt(left - right);
});

// Implementation for Enum
_Integer.toInt = _identity;
_Integer.fromInt = _identity;

// Implementation for Bounded
_Integer.minBound = function() {
    return -2147483648;
};

_Integer.maxBound = function() {
    return 2147483647;
};

// Implementation for Numeric
_Integer.add = _curry(function(a, b) {
    return a + b;
});

_Integer.sub = _curry(function(a, b) {
    return a - b;
});

_Integer.mul = _curry(function(a, b) {
    return a * b;
});

_Integer.div = _curry(function(a, b) {
    return b === 0 ? NaN : (a << 0 / b << 0) << 0;
});

// Implementation for Serializable
_Integer.serializeBE = _curry(function(int) {
    const i32View = Int32Array.of(int);
    const u8View = new Uint8Array(i32View.buffer);

    return ByteOrder.archIsBE()
        ? u8View
        : Sequential.reverse(u8View);
});

_Integer.serializeLE = _curry(function(int) {
    const i32View = Int32Array.of(int);
    const u8View = new Uint8Array(i32View.buffer);

    return ByteOrder.archIsLE()
        ? u8View
        : Sequential.reverse(u8View);
});

_Integer.deserializeBE = _curry(function(source) {
    const i8View = ByteOrder.archIsBE()
        ? Sequential.slice(0,4,source)
        : Sequential.reverse(Sequential.slice(0,4,source));

    return Sequential.nth(0, new Int32Array(i8View.buffer));
});

_Integer.deserializeLE = _curry(function(source) {
    const i8View = ByteOrder.archIsLE()
        ? Sequential.slice(0,4,source)
        : Sequential.reverse(Sequential.slice(0,4,source));

    return Sequential.nth(0, new Int32Array(i8View.buffer));
});

const serializeByteLength = _curryN(1, _always(4));
_Integer.serializeByteLength = serializeByteLength;
_Integer.deserializeByteLengthBE = serializeByteLength;
_Integer.deserializeByteLengthLE = serializeByteLength;

_Integer.hash = _curry(function(integer) {
    return Hashable.hash(Serializable.serialize(integer));
});

_Integer.hashWithSeed = _curry(function(seed, integer) {
    return Hashable.hashWithSeed(seed, Serializable.serialize(integer));
});


module.exports = _Integer;
