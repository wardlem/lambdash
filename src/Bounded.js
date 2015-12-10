var _moduleFor = require('./internal/_moduleFor');
var _equal = require('./internal/_equal');
var _isFunction = require('./internal/_isFunction');
var _curry = require('./internal/_curry');

var Bounded = module.exports;

/**
 * Returns true if a bounded value is the minimum for its type
 *
 * @sig Bounded b => b -> Boolean
 * @since 0.4.0
 * @param value a bounded value
 * @returns {Boolean}
 * @example
 *
 *      _.isMin(false);  // true
 *      _.isMin(true);   // false
 */
Bounded.isMin = _curry(function(value) {
    return _equal(value, Bounded.minBound(value));
});

/**
 * Returns true if a bounded value is the maximum for its type
 *
 * @sig Bounded b => b -> Boolean
 * @since 0.4.0
 * @param value a bounded value
 * @returns {Boolean}
 * @example
 *
 *      _.isMax(false);  // false
 *      _.isMax(true);   // true
 */
Bounded.isMax = _curry(function(value) {
    return _equal(value, Bounded.maxBound(value));
});

/**
 * Returns the minimum bound for the type of the value.
 *
 * @sig Bounded b => b -> b
 * @since 0.5.0
 * @param value a bounded value
 * @returns {Bounded}
 * @example
 *
 *      _.maxBound(false);  // true
 *      _.maxBound(true);   // true
 */
Bounded.minBound = _curry(function(value) {
    var M = _moduleFor(value);

    return M.minBound();
});

/**
 * Returns the maximum bound for the type of the value.
 *
 * @sig Bounded b => b -> b
 * @since 0.5.0
 * @param value a bounded value
 * @returns {Bounded}
 * @example
 *
 *      _.maxBound(false);  // true
 *      _.maxBound(true);   // true
 */
Bounded.maxBound = _curry(function(value) {
    var M = _moduleFor(value);

    return M.maxBound();
});


Bounded.member = function(value) {
    if (value == null) {
        return false;
    }

    var M = _moduleFor(value);
    return (_isFunction(M.minBound) && _isFunction(M.maxBound));
};