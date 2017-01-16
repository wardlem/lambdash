var _is = require('./internal/_is');
var _curry = require('./internal/_curry');
var _curryN = require('./internal/_curryN');
var _identity = require('./internal/_identity');

var Ordering = require('./Ordering');

var _Number = require('./internal/_primitives').Number;

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
_Number.show = _curry(function(a){
    return String(a);
});

/**
 * Returns a number raised to another number
 *
 * @sig Number -> Number -> Number
 */
_Number.pow = _curryN(2, Math.pow);

module.exports = _Number;
