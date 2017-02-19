var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');
var _curry = require('./internal/_curry');

var Functor = module.exports;

/**
 * Maps a function over the values of a structure
 *
 * @sig Functor f => (a -> b) -> f a -> f b
 * @since 0.7.0
 * @param fn the function mapping over the structure
 * @param functor the value being mapped over
 * @return {Functor}
 * @example
 *
 *      _.map(x => x * 2, [1,2,3]);  // [2,4,6]
 */
Functor.map = _curry(function(fn, functor) {
    var M = _moduleFor(functor);
    return M.map(fn, functor);
});

Functor.member = function(value) {
    var M = _moduleFor(value);
    return _isFunction(M.map);
};
