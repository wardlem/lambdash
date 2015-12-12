var _moduleFor = require('./internal/_moduleFor');
var _curryN = require('./internal/_curryN');
var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _slice = require('./internal/_slice');
var _equal = require('./internal/_equal');

var Semigroup = require('./Semigroup');

var Monoid = module.exports;

/**
 * Returns the empty value for the type of value.
 *
 * A monoid should obey the law for all values a: _.concat(_.empty(a), a) is equal to _.concat(a, _.empty(a)) is equal to a
 *
 * @sig Monoid m => m -> m
 * @since 0.4.0
 * @param {Monoid} value
 * @returns {Monoid} the empty value for the type
 * @example
 *
 *      _.empty([1,2,3]); // []
 */
Monoid.empty = _curry(function(value) {
    var M = _moduleFor(value);
    return M.empty();
});

/**
 * Returns true if the value is equal to the empty value for the type
 *
 * @sig Monoid m => m -> Boolean
 * @since 0.4.0
 * @param {Monoid} value the monoid being checked
 * @returns {Boolean}
 * @example
 *
 *      _.empty([]);      // true
 *      _.empty([1,2,3]); // false
 *      _.empty('');      // true
 *      _.empty('abc');   // false
 */
Monoid.isEmpty = _curry(function(value) {
    return _equal(value, Monoid.empty(value));
});

/**
 * Concats a monoid to itself a specified number of times
 *
 * @sig Monoid m => Number -> m -> m
 * @since 0.5.0
 * @param {Number} n the number of times to repeat the monoid
 * @param {Monoid} monoid the monoid being repeatedly concatenated
 * @returns {Monoid} monoid repeated n number of times
 * @example
 *
 *      _.cycleN(4, [1,2]);    // [1,2,1,2,1,2,1,2]
 *      _.cycleN(3, 'ABC');    // 'ABCABCABC'
 */
Monoid.cycleN = _curry(function(n, monoid) {
    var res = Monoid.empty(monoid);
    while (n > 0) {
        res = Monoid.concat(res, monoid);
        n -= 1;
    }
    return res;
});

Monoid.concat = Semigroup.concat;
Monoid.concatAll = Semigroup.concatAll;

Monoid.member = function(value) {
    return Semigroup.member(value) && _isFunction(_moduleFor(value).empty);
};
