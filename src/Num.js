var _is = require('./internal/_is');
var _curry = require('./internal/_curry');
var _curryN = require('./internal/_curryN');
var _identity = require('./internal/_identity');

var Ordering = require('./Ordering');

var Num = require('./internal/_primitives').Num;

// Implementation for Eq

/**
 * Returns true if two numbers are equal.
 *
 * @sig Number -> Number -> Boolean
 */
Num.eq = _is;

// Implementation for Ord

/**
 * Compares two numbers
 *
 * @sig Number -> Number -> Ordering
 */
Num.compare = _curry(function(left, right) {
    return Ordering.fromNum(left - right);
});



// Implementation for Enum
/**
 * Converts a number to an integer.
 *
 * @sig Number -> Number
 */
Num.toInt = function(value) {
    return value << 0;
};

/**
 * Returns the number.
 *
 * @sig Number -> Number
 */
Num.fromInt = _identity;


// implementation for Numeric

/**
 * Identity
 *
 * @sig Number -> Number
 */
Num.toNum = _identity;

/**
 * Identity
 *
 * @sig Number -> Number
 */
Num.fromNum = _identity;

// Implementation for numeric

/**
 * Adds two numbers together
 *
 * @sig Number -> Number -> Number
 */
Num.add = _curry(function(a, b) {
    return a + b;
});

/**
 * Subtracts a number from another.
 *
 * @sig Number -> Number -> Number
 */
Num.sub = _curry(function(a, b) {
    return a - b;
});

/**
 * Multiplies two numbers together.
 *
 * @sig Number -> Number -> Number
 */
Num.mul = _curry(function(a, b) {
    return a * b;
});

/**
 * Divides one number by another.
 *
 * @sig Number -> Number -> Number
 */
Num.div = _curry(function(a, b) {
    return a / b;
});

/**
 * Returns the modulus of two numbers
 *
 * @sig Number -> Number -> Number
 */
Num.mod = _curry(function(a, b) {
    return a % b;
});

/**
 * Returns the absolute value of a number
 *
 * @sig Number -> Number
 */
Num.abs = _curryN(1, Math.abs);

/**
 * Negates a number
 *
 * @sig Number -> Number
 */
Num.negate = _curry(function(a) {
    return -a;
});

/**
 * Returns the reciprocal of a number
 *
 * @sig Number -> Number
 */
Num.reciprocal = _curry(function(a) {
    return 1 / a;
});

/**
 * Returns the sign of a number
 *
 * @sig Number -> Number
 */
Num.sign = _curry(function(a) {
    return a === 0 ? 0 : a < 0 ? -1 : 1;
});

/**
 * Returns a string representation of a Number.
 *
 * @sig Number -> String
 */
Num.show = _curry(function(a){
    return String(a);
});

/**
 * Returns a number raised to another number
 *
 * @sig Number -> Number -> Number
 */
Num.pow = _curryN(2, Math.pow);

module.exports = Num;
