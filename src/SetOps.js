var _curryN = require('./internal/_curryN');
var _useModuleMethod = require('./internal/_useModuleMethod');
var _moduleFor = require('./internal/_moduleFor');
var _isFunction = require('./internal/_isFunction');


var SetOps = module.exports;

/**
 * Returns a new set with all the keys from set.
 *
 * @sig SetOps s => s -> s -> s
 * @since 0.6.0
 */
SetOps.union = _curryN(2, _useModuleMethod('union'));

/**
 * Returns a new set with all the keys in the left that are not present in the right.
 *
 * @sig SetOps s => s -> s -> s
 * @since 0.6.0
 */
SetOps.difference = _curryN(2, _useModuleMethod('difference'));

/**
 * Returns a new set with all the keys in both the left and right set.
 *
 * @sig SetOps s => s -> s -> s
 * @since 0.6.0
 */
SetOps.intersection = _curryN(2, _useModuleMethod('intersection'));

/**
 * Returns a new set with all the keys in left or right, but not in both.
 *
 * @sig SetOps s => s -> s -> s
 * @since 0.6.0
 */
SetOps.symmetricDifference = _curryN(2, _useModuleMethod('symmetricDifference'));


SetOps.member = function(value) {
    var M = _moduleFor(value);
    return _isFunction(M.union)
        && _isFunction(M.difference)
        && _isFunction(M.intersection)
        && _isFunction(M.symmetricDifference);
}