var _curry = require('./internal/_curry');
var _curryN = require('./internal/_curryN');
var _always = require('./internal/_always');
var _condition = require('./internal/_condition');
var _compose = require('./internal/_compose');

var Ordering = require('./Ordering');

var _Boolean = require('./internal/_primitives').Boolean;

// Implementation for Eq

/**
 * Returns true if two booleans are equal, false otherwise.
 *
 * @sig Boolean -> Boolean -> Boolean
 * @since 0.5.0
 * @param {Boolean} left
 * @param {Boolean} right
 * @returns {Boolean}
 */
_Boolean.eq = _curry(function(left, right) {
    return left === right;
});


// Implementation for Ord

/**
 * Compares two booleans.
 *
 * True is greater than false.
 *
 * @sig Boolean -> Boolean -> Ordering
 * @since 0.5.0
 */
_Boolean.compare = _curry(function(left, right) {
    return Ordering.fromInt(left - right);
});


// Implementation for Enum

/**
 * Returns 0 if the value is false, 1 if value is true.
 *
 * @sig Boolean -> Number
 * @since 0.5.0
 * @param {Boolean} value
 * @returns {Number}
 */
_Boolean.toInt = function(value) {
    return +value;
};

/**
 * Returns false if the value is 0, true otherwise.
 *
 * @sig Number -> Boolean
 * @since 0.5.0
 *
 * @param {Number} value an integer
 * @returns {boolean}
 */
_Boolean.fromInt = _curry(function(value) {
    return value !== 0;
});


// Implementation for Bounded

/**
 * Always returns false, the minimum value for a boolean
 *
 * @since 0.5.0
 * @sig () -> Boolean
 */
_Boolean.minBound = _always(false);

/**
 * Always returns true, the maximum value for a boolean
 *
 * @since 0.5.0
 * @sig () -> Boolean
 */
_Boolean.maxBound = _always(true);


// Implementation for Show

/**
 * Returns a string representation of a boolean value.
 *
 * @since 0.6.0
 * @sig Boolean -> String
 */
_Boolean.show = _curry(function(boolean){
    return String(boolean);
});


// Logic

/**
 * Returns true only if left and right are true.
 *
 * @sig Boolean -> Boolean -> Boolean
 * @since 0.5.0
 */
_Boolean.and = _curry(function(left, right) {
    return left && right;
});

/**
 * Returns true if either of left or right is true.
 *
 * @sig Boolean -> Boolean -> Boolean
 * @since 0.5.0
 */
_Boolean.or = _curry(function(left, right) {
    return left || right;
});

/**
 * Returns true if and only if one of left and right is true and the other is false.
 *
 * @sig Boolean -> Boolean -> Boolean
 * @since 0.6.0
 */
_Boolean.xor = _curry(function(left, right){
    return (left && !right) || (right && !left);
});

/**
 * Inverts a boolean value
 *
 * @sig Boolean -> Boolean
 * @since 0.5.0
 */
_Boolean.not = _curry(function(boolean) {
    return !boolean;
});

/**
 * Creates a function from two functions that returns true if both functions return true
 *
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @since 0.6.0
 */
_Boolean.both = _curry(function(left, right) {
    return function both() {
        return left.apply(this, arguments) && right.apply(this, arguments);
    }
});

/**
 * Creates a function from two functions that returns true if either functions return true
 *
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @since 0.6.0
 */
_Boolean.either = _curry(function(left, right) {
    return function either() {
        return left.apply(this, arguments) || right.apply(this, arguments);
    }
});

/**
 * Creates a function from two functions that returns true if both functions return false
 *
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @since 0.6.0
 */
_Boolean.neither = _curry(function(left, right) {
    return _Boolean.complement(_Boolean.either(left, right));
});

/**
 * Creates a function from two functions that returns true if one and only one of the functions returns true
 *
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @since 0.6.0
 */
_Boolean.eitherExclusive = _curry(function(left, right) {
    return function either() {
        return _Boolean.xor(left.apply(this, arguments), right.apply(this, arguments));
    }
});

/**
 * Creates a function from another that inverts its result
 *
 * @sig (*... -> Boolean) -> (*... -> Boolean)
 * @since 0.6.0
 */
_Boolean.complement = _curryN(2, _compose)(_Boolean.not);

/**
 * Creates a branching function.
 *
 * It accepts a variable number of arguments, each of which should be an array
 * with the first index being a predicate function and the second being a function
 * that will run if the predicate returns true.
 *
 * @since 0.5.4
 * @sig [(*... -> Boolean), (*... -> a)]... -> (*... -> a)
 *
 * @example
 *
 *      var sizer = _.condition(
 *          [_.lt(_, 1), _.always("Too small.")],
 *          [_.lt(_, 5), _.always("An ok size.")],
 *          [_.lt(_, 10), _.always("A big one!")],
 *          [_.T, v => "A " + v + " pounder! What a whopper!"]
 *      );
 *
 *      sizer(0.5); // "Too small."
 *      sizer(7);   // "A big one!"
 *      sizer(54);  // "A 54 pounder! What a whopper!"
 */
_Boolean.condition = _condition;

/**
 * Always returns true
 *
 * @since 0.5.0
 * @sig () -> Boolean
 */
_Boolean.T = _always(true);

/**
 * Always returns false
 *
 * @since 0.5.0
 * @sig () -> Boolean
 */
_Boolean.F = _always(false);

module.exports = _Boolean;
