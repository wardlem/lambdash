const _curry = require('./internal/_curry');
const _moduleFor = require('./internal/_moduleFor');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');

const Functor = require('./Functor');

const Applicative = {name: 'Applicative'};

const applicativeForModule = _typecached((M) => {
    if (!Applicative.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Applicative`);
    }

    return {
        ap: M.ap,
    };
});

const applicativeForModulePrototype = _typecached((M) => {
    const methods = applicativeForModule(M);

    return {
        ap: _thisify(methods.ap),
    };
});

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
Applicative.ap = _curry((apply, value) => applicativeForModule(_moduleFor(value)).ap(apply, value));

module.exports = typeclass(Applicative, {
    required: ['ap', 'of'],
    superTypes: [Functor],
    deriveFn: applicativeForModule,
    deriveProtoFn: applicativeForModulePrototype,
});
