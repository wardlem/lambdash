var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');

var Foldable = module.exports;

var _fold = _curry(function(_f, fn, init, foldable){
    if (_isFunction(foldable[_f])) {
        return foldable[_f](fn, init);
    }

    var M = _moduleFor(foldable);
    if (_isFunction(M[_f])) {
        return M[_f](fn, init, foldable);
    }

    if (_isFunction(M.toArray)) {
        return Foldable[_f](fn, init, M.toArray(foldable));
    }

    throw new TypeError('Foldable#' + _f + ' called on a value that does not implement Foldable');
});

Foldable.foldl = _fold('foldl');
Foldable.foldr = _fold('foldr');