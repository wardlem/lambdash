const _moduleFor = require('./internal/_moduleFor');
const _equal = require('./internal/_equal');
const _isFunction = require('./internal/_isFunction');
const _curry = require('./internal/_curry');
const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');

const Bounded = {name: 'Bounded'};

const boundedForModule = _typecached(function(M) {
    if (!Bounded.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Bounded`);
    }

    const _Bounded = {};

    _Bounded.minBound = M.minBound;
    _Bounded.maxBound = M.maxBound;
    _Bounded.isMin = _isFunction(M.isMin)
        ? M.isMin
        : _curry(v => _equal(v, M.minBound()))
    ;
    _Bounded.isMax = _isFunction(M.isMax)
        ? M.isMax
        : _curry(v => _equal(v, M.maxBound()))
    ;

    return _Bounded;
});

const boundedForModulePrototype = _typecached(function(M) {
    const methods = boundedForModule(M);

    return {
        minBound: methods.minBound,
        maxBound: methods.maxBound,
        isMin: _thisify(methods.isMin),
        isMax: _thisify(methods.isMax),
    };
});

/**
 * Returns true if a bounded value is the minimum for its type
 *
 * @sig Bounded b => b -> Boolean
 * @since 0.4.0
 * @param value a bounded value
 * @returns {Boolean}
 * @example
 *
 *      _.isMin(false);  // true
 *      _.isMin(true);   // false
 */
Bounded.isMin = _curryN(1, typeclass.forward('isMin', boundedForModule));

/**
 * Returns true if a bounded value is the maximum for its type
 *
 * @sig Bounded b => b -> Boolean
 * @since 0.4.0
 * @param value a bounded value
 * @returns {Boolean}
 * @example
 *
 *      _.isMax(false);  // false
 *      _.isMax(true);   // true
 */
Bounded.isMax = _curryN(1, typeclass.forward('isMax', boundedForModule));

/**
 * Returns the minimum bound for the type of the value.
 *
 * @sig Bounded b => b -> b
 * @since 0.5.0
 * @param value a bounded value
 * @returns {Bounded}
 * @example
 *
 *      _.minBound(false);  // false
 *      _.minBound(true);   // false
 */
Bounded.minBound = _curryN(1, typeclass.forward('minBound', boundedForModule));

/**
 * Returns the maximum bound for the type of the value.
 *
 * @sig Bounded b => b -> b
 * @since 0.5.0
 * @param value a bounded value
 * @returns {Bounded}
 * @example
 *
 *      _.maxBound(false);  // true
 *      _.maxBound(true);   // true
 */
Bounded.maxBound = _curryN(1, typeclass.forward('maxBound', boundedForModule));

module.exports = typeclass(Bounded, {
    deriveFn: boundedForModule,
    deriveProtoFn: boundedForModulePrototype,
    superTypes: [],
    required: ['minBound', 'maxBound'],
});
