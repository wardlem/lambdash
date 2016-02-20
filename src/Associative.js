var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');
var _useModuleMethod = require('./internal/_useModuleMethod');
var _curryN = require('./internal/_curryN');
var __ = require('./internal/_blank');

var Functor = require('./Functor');

var Associative = module.exports;

/**
 * Associates a key value pair in a collection.
 *
 * It the key already exists, it should be overwritten.
 *
 * @sig Associative a => k -> v -> a k v -> a k v
 * @since 0.6.0
 */
Associative.assoc = _curryN(3, _useModuleMethod('assoc'));

/**
 * Removes a key from an associative collection if it exists.
 *
 * @sig Associative a => k -> a k v -> a k v
 * @since 0.6.0
 */
Associative.dissoc = _curryN(2, _useModuleMethod('dissoc'));

/**
 * Returns true if a key exists in an associative collection, false otherwise.
 *
 * @sig Associative a => k -> a k v -> Boolean
 * @since 0.6.0
 */
Associative.exists = _curryN(2, _useModuleMethod('exists'));

/**
 * Returns the value associated with a key or undefined if it does not exist.
 *
 * @sig Associative a => k -> a k v -> v
 * @since 0.6.0
 */
Associative.lookup = _curryN(2, _useModuleMethod('lookup'));

/**
 * Takes a functor of keys and an associative collection and returns a collection of values
 * associated with those keys in the collection.
 *
 * @sig (Functor f, Associative a) => f k -> a k v -> f v
 * @since 0.6.0
 */
Associative.lookupAll = _curryN(2, function(keys, assoc){
    return Functor.map(Associative.lookup(__, assoc), keys);
});

/**
 * Returns the value associated with a key or a default value if it does not exist.
 *
 * @sig Associative a => v -> k -> a k v -> v
 * @since 0.6.0
 */
Associative.lookupOr = _curryN(3, function(def, key, assoc){
    return Associative.exists(key, assoc) ? Associative.lookup(key, assoc) : def;
});

/**
 * Returns all the keys in an associative collection as an array.
 *
 * This method is optional for being considered an implementation of Associative.
 *
 * @sig Associative a => a k v -> [k]
 * @since 0.6.0
 */
Associative.keys = _curryN(1, _useModuleMethod('keys'));

/**
 * Returns all the values in an associative collection as an array.
 *
 * This method is optional for being considered an implementation of Associative.
 *
 * @sig Associative a => a k v -> [v]
 * @since 0.6.0
 */
Associative.values = _curryN(1, _useModuleMethod('values'));

/**
 * Maps the values and keys of an associative container.
 *
 * This method is optional for being considered an implementation of Associative.
 *
 * @sig Associative a => (v -> k -> v) -> a k v -> a k v
 * @since 0.6.0
 */
Associative.mapAssoc = _curryN(2, _useModuleMethod('mapAssoc'));

/**
 * Folds the values and keys of an associative container from left to right.
 *
 * This method is optional for being considered an implementation of Associative.
 *
 * @sig Associative a => (b -> v -> k -> b) -> b -> a k v -> b
 * @since 0.6.0
 */
Associative.foldlAssoc = _curryN(3, _useModuleMethod('foldlAssoc'));

/**
 * Folds the values and keys of an associative container from right to left.
 *
 * This method is optional for being considered an implementation of Associative.
 *
 * @sig Associative a => (b -> v -> k -> b) -> b -> a k v -> b
 * @since 0.6.0
 */
Associative.foldrAssoc = _curryN(3, _useModuleMethod('foldrAssoc'));

/**
 * Filters an associative container based on a predicate function that accepts both a value and key.
 *
 * This method is optional for being considered an implementation of Associative.
 *
 * @sig Associative a => (v -> k -> Boolean) -> a k v -> a k v
 * @since 0.6.0
 */
Associative.filterAssoc = _curryN(2, _useModuleMethod('filterAssoc'));

/**
 * Returns an array of array of key value pairs where the first index of each pair is a key
 * in the object and the second index is the value associated with that key.
 *
 * The associative structure must have a foldlAssoc function.
 *
 * @sig Associative a => a k v -> [[k,a]]
 * @since 0.6.0
 */
Associative.pairs = _curryN(1, function(assoc){
    return Associative.foldlAssoc(function(accum, v, k){
        accum.push([k,v]);
        return accum;
    }, [], assoc);
});

Associative.member = function(value) {
    var M = _moduleFor(value);
    return _isFunction(M.assoc, M.dissoc, M.exists, M.lookup);
};
