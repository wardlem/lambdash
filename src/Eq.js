var _curry = require('./internal/_curry');
var _moduleFor = require('./internal/_moduleFor');
var _equal = require('./internal/_equal');
var _not = require('./internal/_not');

var Eq = module.exports;

/**
 * Returns whether or not two values are considered structurally equal.
 *
 * The default is javascript's === operator.
 * This function is part of the Eq interface
 *
 * @sig Eq a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Eq} left the first value being compared
 * @param {Eq} right the second value being compared
 * @return {Boolean} whether or not the two values are equal according to the type's definition of equal
 */
Eq.eq = _equal;

/**
 * Returns whether or not two values are considered structurally not equal.
 *
 * The default is javascript's !== operator.
 *
 * It is the inverse of Eq.eq
 *
 * @sig Eq a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Eq} left the first value being compared
 * @param {Eq} right the second value being compared
 * @return {Boolean} whether or not the two values are not equal according to the type's definition of equal
 */
Eq.neq = _not(Eq.eq);

