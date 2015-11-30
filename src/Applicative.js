var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');

var Applicative = module.exports;

// f (a -> b) -> f a -> f b
Applicative.ap = _curry(function(apply, value){
    if (_isFunction(apply.ap)) {
        return apply.ap(value);
    }

    var M = _moduleFor(apply);
    if (_isFunction(M.ap)) {
        return M.ap(apply, value);
    }

    throw new TypeError('Applicative#ap called on a value that does not implement Applicative');
});