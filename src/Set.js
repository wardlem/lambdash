var _moduleFor = require('./internal/_moduleFor');
var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');

var SetOps = require('./SetOps');


var Set = module.exports;

/**
 * Returns true if the key is in the set.
 *
 * @sig Set s => k -> s k -> Boolean
 * @since 0.6.0
 */
Set.exists = _curry(function(key, s){
    var M = _moduleFor(s);
    if (_isFunction(M.exists)) {
        return M.exists(key, s);
    }

    throw new TypeError('Set#exists called on a value that does not implement set');
});

/**
 * Returns a new set with the key added.
 *
 * @sig Set s => k -> s k -> s k
 * @since 0.6.0
 */
Set.insert = _curry(function(key, s){
    var M = _moduleFor(s);
    if (_isFunction(M.insert)) {
        return M.insert(key, s);
    }

    throw new TypeError('Set#insert called on a value that does not implement set');
});

/**
 * Removes a new set with an element removed from another set.
 *
 * @sig Set s => k -> s k -> s k
 * @since 0.6.0
 */
Set.remove = _curry(function(key, s){
    var M = _moduleFor(s);
    if (_isFunction(M.remove)) {
        return M.remove(key, s);
    }

    throw new TypeError('Set#remove called on a value that does not implement set');
});

Set.member = function(value){
    var M = _moduleFor(value);

    return SetOps.member(value)
        && _isFunction(M.exists)
        && _isFunction(M.insert)
        && _isFunction(M.remove);
}