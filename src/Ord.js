var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _compose = require('./internal/_compose');
var _not = require('./internal/_not');
var _moduleFor = require('./internal/_moduleFor');

var Eq = require('./Eq');
var Ordering = require('./Ordering');

var Ord = module.exports;

Ord.equal = Eq.equal;

/**
 * Compares two values of the same type.
 *
 * This function is part of the Ord interface and must be implemented for
 * the values upon which the function is called.
 *
 * The implementation function must return _.LT if the left value is less than the right,
 * _.GT if the left value is greater than the right, or _.EQ if the values are structurally equal.
 *
 * @sig Ord a => a -> a -> Ordering
 * @since 0.4.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the second value being compared
 * @return {Ordering} the result of the comparison between the values
 * @example
 *
 *      _.compare(1,2);  // _.LT
 *      _.compare(2,1);  // _.GT
 *      _.compare(2,2);  // _.EQ
 *
 *      _.compare([1,2,3], [1,2,5]); // _.LT
 *      _.compare([1,2,3], [1,2,3]); // _.EQ
 *
 *      _.compare('CAB')('CAR');  // _.LT
 *
 */
Ord.compare = _curry(function(left, right) {
    if (left == null || right == null) {
        throw new TypeError('Ord#compare can not operate on undefined or null values');
    }

    var M = _moduleFor(left);
    if (_isFunction(M.compare)) {
        return M.compare(left, right);
    }

    return _defaultCompare(left, right);
});


/**
 * Returns true if the left value is greater than the right value
 *
 * @sig Ord a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the second value being compared
 * @return {Boolean} True if left is greater than the right
 * @example
 *
 *      _.gt(1,2);  // false
 *      _.gt(2,1);  // true
 *      _.gt(2,2);  // false
 */
Ord.gt = _compose(Ordering.isGT, Ord.compare);

/**
 * Returns true if the left value is less than the right value
 *
 * @sig Ord a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the second value being compared
 * @return {Boolean} True if left is less than the right
 * @example
 *
 *      _.lt(1,2);  // true
 *      _.lt(2,1);  // false
 *      _.lt(2,2);  // false
 */
Ord.lt = _compose(Ordering.isLT, Ord.compare);

/**
 * Returns true if the left value is greater than or equal to the right value
 *
 * It is the inverse of Ord.lt
 *
 * @sig Ord a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the second value being compared
 * @return {Boolean} True if left is not less than the right
 * @example
 *
 *      _.gte(1,2);  // false
 *      _.gte(2,1);  // true
 *      _.gte(2,2);  // true
 */
Ord.gte = _not(Ord.lt);

/**
 * Returns true if the left value is less than or equal to the right value
 *
 * It is the inverse of Ord.gt
 *
 * @sig Ord a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the second value being compared
 * @return {Boolean} True if left is not greater than the right
 * @example
 *
 *      _.lte(1,2);  // true
 *      _.lte(2,1);  // false
 *      _.lte(2,2);  // true
 */
Ord.lte = _not(Ord.gt);

/**
 * Returns the lesser of two comparable values
 *
 * If the values are equal, the left value is returned
 *
 * @sig Ord a => a -> a -> a
 * @since 0.4.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the right value being compared
 * @return {Ord} the lesser of the two values
 * @example
 *
 *      _.min(1,2);  // 1
 *      _.min("car", "cab"); // "cab"
 */
Ord.min = _curry(function(left, right) {
    return Ord.lte(left, right) ? left : right;
});

/**
 * Returns the greater of two comparable values
 *
 * If the values are equal, the left value is returned
 *
 * @sig Ord a => a -> a -> a
 * @since 0.4.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the right value being compared
 * @return {Ord} the greater of the two values
 * @example
 *
 *      _.max(1,2);  // 2
 *      _.max("car", "cab"); // "car"
 */
Ord.max = _curry(function(left, right) {
    return Ord.gte(left, right) ? left : right;
});
