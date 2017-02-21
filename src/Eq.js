const _moduleFor = require('./internal/_moduleFor');
const _typecached = require('./internal/_typecached');
const _curry = require('./internal/_curry');
const _isFunction = require('./internal/_isFunction');
const _thisify = require('./internal/_thisify');
const _flip = require('./internal/_flip');
const typeclass = require('./typeclass');

const Eq = {name: 'Eq'};

const eqForModule = _typecached((M) => {
    const _Eq = {};

    _Eq.eq = _isFunction(M.eq) ? M.eq : _curry((l,r) => l === r);
    _Eq.neq = _isFunction(M.neq) ? M.neq : _curry((l,r) => !(_Eq.eq(l,r)));

    return _Eq;
});

const eqForModulePrototype = _typecached((M) => {
    const methods = eqForModule(M);
    return {
        eq: _thisify(_flip(methods.eq)),
        neq: _thisify(_flip(methods.neq)),
    };
});

/**
 * Returns whether or not two values are considered structurally equal.
 *
 * The default is javascript's === operator.
 * This function is part of the Eq interface
 *
 * @sig Eq a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Eq} left the first value being compared
 * @param {Eq} right the second value being compared
 * @return {Boolean} whether or not the two values are equal according to the type's definition of equal
 */
Eq.eq = _curry((l, r) => eqForModule(_moduleFor(r)).eq(l,r));

/**
 * Returns whether or not two values are considered structurally not equal.
 *
 * The default is javascript's !== operator.
 *
 * It is the inverse of Eq.eq
 *
 * @sig Eq a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Eq} left the first value being compared
 * @param {Eq} right the second value being compared
 * @return {Boolean} whether or not the two values are not equal according to the type's definition of equal
 */
Eq.neq = _curry((l, r) => eqForModule(_moduleFor(r)).neq(l,r));

module.exports = typeclass(Eq, {
    required: [],
    superTypes: [],
    deriveFn: eqForModule,
    deriveProtoFn: eqForModulePrototype,
});
