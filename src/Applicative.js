var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');

var Functor = require('./Functor');

var Applicative = module.exports;

/**
 * Applies the function values contained in the first argument to the second
 *
 * @sig Applicative p => p (a -> b) -> p a -> p b
 * @since 0.4.0
 * @param {Applicative} apply the applicative function containing a function to be applied
 * @param {Applicative} value the applicative value the function contained in apply will be applied to
 * @return {Applicative}
 * @example
 *
 *      _.ap([x => x + 1], [1,2,3]);              // [2,3,4]
 *      _.ap([x => x + 1, x => x * 2], [1,2,3]);  // [2,3,4,2,4,6]
 */
Applicative.ap = _curry(function(apply, value){

    var M = _moduleFor(apply);
    if (_isFunction(M.ap)) {
        return M.ap(apply, value);
    }

    throw new TypeError('Applicative#ap called on a value that does not implement Applicative');
});

Applicative.member = function(value) {
    var M = _moduleFor(value);
    return Functor.member(value) && _isFunction(M.ap) && _isFunction(M.of);
};