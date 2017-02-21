const _curry = require('./internal/_curry');
const _moduleFor = require('./internal/_moduleFor');
const _isFunction = require('./internal/_isFunction');
const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');

const Hashable = {name: 'Hashable'};

const HASH_BASE = 0x811c9dc5;

const hashableForModule = _typecached((M) => {
    if (!Hashable.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Hashable`);
    }
    const _Hashable = {};

    _Hashable.hashWithSeed = M.hashWithSeed;
    _Hashable.hash = _isFunction(M.hash)
        ? M.hash
        : _Hashable.hashWithSeed(HASH_BASE)
    ;

    return _Hashable;
});

const hashableForModulePrototype = _typecached((M) => {
    const methods = hashableForModule(M);

    return {
        hashWithSeed: _thisify(methods.hashWithSeed),
        hash: _thisify(methods.hash),
    };
});

/**
 * Hashes a value with a given seed
 *
 * @since 0.7.0
 * @sig (Hashable h) => Integer -> h -> Integer
 */
Hashable.hashWithSeed = _curryN(2, typeclass.forward('hashWithSeed', hashableForModule));

/**
 * Hashes a value with a default seed
 *
 * @since 0.7.0
 * @sig (Hashable h) => h -> Integer
 */
Hashable.hash = _curryN(1, typeclass.forward('hash', hashableForModule));

Hashable.member = function(value) {
    const M = _moduleFor(value);
    return _isFunction(M.hash, M.hashWithSeed);
};

module.exports = typeclass(Hashable, {
    deriveFn: hashableForModule,
    deriveProtoFn: hashableForModulePrototype,
    required: ['hashWithSeed'],
    superTypes: [],
});
