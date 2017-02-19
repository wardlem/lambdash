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
Associative.lookupAll = _curryN(2, function(keys, assoc) {
    return Functor.map(Associative.lookup(__, assoc), keys);
});

/**
 * Returns the value associated with a key or a default value if it does not exist.
 *
 * @sig Associative a => v -> k -> a k v -> v
 * @since 0.6.0
 */
Associative.lookupOr = _curryN(3, function(def, key, assoc) {
    return Associative.exists(key, assoc) ? Associative.lookup(key, assoc) : def;
});

/**
 * Returns an associative with the value at the given key updated by a function.
 *
 * @sig Associative a => k -> (v -> v) -> a k v -> a k v
 * @since 0.6.2
 */
Associative.update = _curryN(3, function(key, fn, assoc) {
    return Associative.assoc(key, fn(Associative.lookup(key, assoc)), assoc);
});

/**
 * Returns an associative with the value at the given key updated by a function.
 *
 * If the key does not exist a default is associated.
 *
 * @sig Associative a => v -> k -> (v -> v) -> a k v -> a k v
 * @since 0.6.2
 */
Associative.updateOr = _curryN(4, function(def, key, fn, assoc) {
    return Associative.exists(key, assoc)
        ? Associative.update(key, fn, assoc)
        : Associative.assoc(key, def, assoc);
});

Associative.member = function(value) {
    var M = _moduleFor(value);
    return _isFunction(M.assoc, M.dissoc, M.exists, M.lookup);
};
