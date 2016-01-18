var _moduleFor = require('./internal/_moduleFor');
var _curryN = require('./internal/_curryN');
var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _slice = require('./internal/_slice');
var _equal = require('./internal/_equal');

var Foldable = require('./Foldable');

var Semigroup = module.exports;

/**
 * Returns the concatenation of two values
 *
 * @sig Semigroup m => m -> m -> m
 * @since 0.4.0
 * @param {Semigroup} first the prefix of the concatenation
 * @param {Semigroup} second the suffix of the concatenation
 * @return {Semigroup} the result of the concatenation
 * @example
 *
 *      _.concat([1,2,3],[4,5,6]);  // [1,2,3,4,5,6]
 *      _.concat("ABC", "123");     // "ABC123"
 */
Semigroup.concat = _curry(function(a, b) {
    var M = _moduleFor(a);
    return M.concat(a, b);
});

/**
 * Concatenates all values in a foldable into one.
 *
 * The foldable can not be empty.
 *
 * @sig (Semigroup m, Foldable f)  => f m -> m
 * @since 0.4.0
 * @returns {Semigroup}
 */
Semigroup.concatAll = _curry(function (foldable) {
    return Foldable.foldl1(Semigroup.concat, foldable);
});


Semigroup.member = function(value) {
    var M = _moduleFor(value);
    return _isFunction(M.concat);
};
