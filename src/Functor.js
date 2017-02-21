const _isFunction = require('./internal/_isFunction');
const _moduleFor = require('./internal/_moduleFor');
const _curry = require('./internal/_curry');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');

const Functor = {name: 'Functor'};

const functorForModule = (M) => {
    if (!Functor.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Functor`);
    }

    return {
        map: M.map,
    };
};

const functorForModulePrototype = (M) => {
    const methods = functorForModule(M);

    return {
        map: _thisify(methods.map),
    };
};

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
    const M = _moduleFor(functor);
    return M.map(fn, functor);
});

module.exports = typeclass(Functor, {
    required: ['map'],
    superTypes: [],
    deriveFn: functorForModule,
    deriveProtoFn: functorForModulePrototype,
});
