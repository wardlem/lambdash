var _moduleFor = require('./internal/_moduleFor');
var _curryN = require('./internal/_curryN');
var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _slice = require('./internal/_slice');
var _equal = require('./internal/_equal');

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
 * Variadic function to concatenate one or more values together
 *
 * @sig Semigroup m => ...m -> m
 * @since 0.4.0
 * @returns {Semigroup}
 */
Semigroup.concatAll = function () {
    if (arguments.length === 0) {
        throw new TypeError('Semigroup#concatAll can not be called with no arguments');
    }

    var start = arguments[0];
    var argsInd = 1;

    while(argsInd < arguments.length) {
        start = Semigroup.concat(start, arguments[argsInd]);
        argsInd += 1;
    }

    return start;
};


Semigroup.member = function(value) {
    return value != null && _isFunction(_moduleFor(value).concat);
};
