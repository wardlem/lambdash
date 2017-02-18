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

/**
 * @module
 *
 * @implements Eq
 * @implements Ord
 * @implements Enum
 * @implements Numeric
 * @implements Show
 * @implements Serializable
 * @implements Hashable
 */
const _Number = require('./internal/_primitives').Number;

// Implementation for Eq

/**
 * Returns true if two numbers are equal.
 *
 * @sig Number -> Number -> Boolean
 */
_Number.eq = _is;

// Implementation for Ord

/**
 * Compares two numbers
 *
 * @sig Number -> Number -> Ordering
 */
_Number.compare = _curry(function(left, right) {
    return Ordering.fromNum(left - right);
});



// Implementation for Enum
/**
 * Converts a number to an integer.
 *
 * @sig Number -> Number
 */
_Number.toInt = function(value) {
    return value << 0;
};

/**
 * Returns the number.
 *
 * @sig Number -> Number
 */
_Number.fromInt = _identity;


// implementation for Numeric

/**
 * Identity
 *
 * @sig Number -> Number
 */
_Number.toNum = _identity;

/**
 * Identity
 *
 * @sig Number -> Number
 */
_Number.fromNum = _identity;

// Implementation for numeric

/**
 * Adds two numbers together
 *
 * @sig Number -> Number -> Number
 */
_Number.add = _curry(function(a, b) {
    return a + b;
});

/**
 * Subtracts a number from another.
 *
 * @sig Number -> Number -> Number
 */
_Number.sub = _curry(function(a, b) {
    return a - b;
});

/**
 * Multiplies two numbers together.
 *
 * @sig Number -> Number -> Number
 */
_Number.mul = _curry(function(a, b) {
    return a * b;
});

/**
 * Divides one number by another.
 *
 * @sig Number -> Number -> Number
 */
_Number.div = _curry(function(a, b) {
    return a / b;
});

/**
 * Returns the modulus of two numbers
 *
 * @sig Number -> Number -> Number
 */
_Number.mod = _curry(function(a, b) {
    return a % b;
});

/**
 * Returns the absolute value of a number
 *
 * @sig Number -> Number
 */
_Number.abs = _curryN(1, Math.abs);

/**
 * Negates a number
 *
 * @sig Number -> Number
 */
_Number.negate = _curry(function(a) {
    return -a;
});

/**
 * Returns the reciprocal of a number
 *
 * @sig Number -> Number
 */
_Number.reciprocal = _curry(function(a) {
    return 1 / a;
});

/**
 * Returns the sign of a number
 *
 * @sig Number -> Number
 */
_Number.sign = _curry(function(a) {
    return a === 0 ? 0 : a < 0 ? -1 : 1;
});

/**
 * Returns a string representation of a Number.
 *
 * @sig Number -> String
 */
_Number.show = _curry(function(a) {
    return String(a);
});

/**
 * Returns a number raised to another number
 *
 * @sig Number -> Number -> Number
 */
_Number.pow = _curryN(2, Math.pow);


// Implementation for Serializable

_Number.serializeBE = _curry(function(number) {
    const f64View = Float64Array.of(number);
    const u8View = new Uint8Array(f64View.buffer);

    return ByteOrder.archIsBE()
        ? u8View
        : Sequential.reverse(u8View);
});

_Number.serializeLE = _curry(function(number) {
    const f64View = Float64Array.of(number);
    const u8View = new Uint8Array(f64View.buffer);

    return ByteOrder.archIsLE()
        ? u8View
        : Sequential.reverse(u8View);
});

_Number.deserializeBE = _curry(function(source) {
    const i8View = ByteOrder.archIsBE()
        ? Sequential.slice(0,8,source)
        : Sequential.reverse(Sequential.slice(0,8,source));

    return (new Float64Array(i8View.buffer))[0];
});

_Number.deserializeLE = _curry(function(source) {
    const i8View = ByteOrder.archIsLE()
        ? Sequential.slice(0,8,source)
        : Sequential.reverse(Sequential.slice(0,8,source));

    return (new Float64Array(i8View.buffer))[0];
});

const serializeByteLength = _curryN(1, _always(8));
_Number.serializeByteLength = serializeByteLength;
_Number.deserializeByteLengthBE = serializeByteLength;
_Number.deserializeByteLengthLE = serializeByteLength;

_Number.hash = _curry(function(number) {
    return Hashable.hash(Serializable.serialize(number));
});

_Number.hashWithSeed = _curry(function(seed, number) {
    return Hashable.hashWithSeed(seed, Serializable.serialize(number));
});

module.exports = _Number;
