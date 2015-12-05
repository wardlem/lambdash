var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');
var _curry = require('./internal/_curry');

var Functor = module.exports;

Functor.map = _curry(function(fn, functor) {
    if (functor == null) {
        throw new TypeError('Functor#map can not operate on null values');
    }

    var M = _moduleFor(functor);

    if (_isFunction(M.map)) {
        return M.map(fn, functor);
    }

    if(_isFunction(functor.map)) {
        return functor.map(fn);
    }

    console.log(functor);
    throw new TypeError('Functor#map called on a value that does not implement Functor');
});