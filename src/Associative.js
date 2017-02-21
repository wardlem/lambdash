const _useModuleMethod = require('./internal/_useModuleMethod');
const _curryN = require('./internal/_curryN');
const __ = require('./internal/_blank');
const _typecached = require('./internal/_typecached');
const _isFunction = require('./internal/_isFunction');
const typeclass = require('./typeclass');
const _thisify = require('./internal/_thisify');

const Functor = require('./Functor');

const Associative = {name: 'Associative'};

const associativeForModule = _typecached((M) => {
    if (!Associative.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Associative`);
    }

    const _Associative = {};

    _Associative.assoc = M.assoc;
    _Associative.dissoc = M.dissoc;
    _Associative.exists = M.exists;
    _Associative.lookup = M.lookup;
    _Associative.lookupAll = _isFunction(M.lookupAll)
        ? M.lookupAll
        : _curryN(2, function(keys, assoc) {
            return Functor.map(M.lookup(__, assoc), keys);
        })
    ;

    _Associative.lookupOr = _isFunction(M.lookupOr)
        ? M.lookupOr
        : _curryN(3, function(def, key, assoc) {
            return M.exists(key, assoc) ? M.lookup(key, assoc) : def;
        })
    ;

    _Associative.update = _isFunction(M.update)
        ? M.update
        : _curryN(3, function(key, fn, assoc) {
            return M.assoc(key, fn(M.lookup(key, assoc)), assoc);
        })
    ;

    _Associative.updateOr = _isFunction(M.updateOr)
        ? M.updateOr
        : _curryN(4, function(def, key, fn, assoc) {
            return M.exists(key, assoc)
                ? _Associative.update(key, fn, assoc)
                : M.assoc(key, def, assoc);
        })
    ;

    return _Associative;
});

const associativeForModulePrototype = _typecached((M) => {
    const methods = associativeForModule(M);

    return {
        assoc: _thisify(methods.assoc),
        dissoc: _thisify(methods.dissoc),
        exists: _thisify(methods.exists),
        lookup: _thisify(methods.lookup),
        lookupAll: _thisify(methods.lookupAll),
        lookupOr: _thisify(methods.lookupOr),
        update: _thisify(methods.update),
        updateOr: _thisify(methods.updateOr),
    };
});

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
Associative.lookupAll = _curryN(2, typeclass.forward('lookupAll', associativeForModule));

/**
 * Returns the value associated with a key or a default value if it does not exist.
 *
 * @sig Associative a => v -> k -> a k v -> v
 * @since 0.6.0
 */
Associative.lookupOr = _curryN(3, typeclass.forward('lookupOr', associativeForModule));

/**
 * Returns an associative with the value at the given key updated by a function.
 *
 * @sig Associative a => k -> (v -> v) -> a k v -> a k v
 * @since 0.6.2
 */
Associative.update = _curryN(3, typeclass.forward('update', associativeForModule));

/**
 * Returns an associative with the value at the given key updated by a function.
 *
 * If the key does not exist a default is associated.
 *
 * @sig Associative a => v -> k -> (v -> v) -> a k v -> a k v
 * @since 0.6.2
 */
Associative.updateOr = _curryN(4, typeclass.forward('updateOr', associativeForModule));

module.exports = typeclass(Associative, {
    superTypes: [],
    required: ['assoc', 'dissoc', 'exists', 'lookup'],
    deriveFn: associativeForModule,
    deriveProtoFn: associativeForModulePrototype,
});
