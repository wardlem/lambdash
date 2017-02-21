const _flip = require('./internal/_flip');
const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');

const SetOps = {name: 'SetOps'};

const setOpsForModule = _typecached((M) => {
    if (!SetOps.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement SetOps`);
    }

    const _SetOps = {
        union: M.union,
        difference: M.difference,
        intersection: M.intersection,
        symmetricDifference: M.symmetricDifference,
    };

    return _SetOps;
});

const setOpsForModulePrototype = _typecached((M) => {
    const methods = setOpsForModule(M);

    const res = {};
    Object.keys(methods).forEach((method) => {
        res[method] = _thisify(_flip(methods[method]));
    });

    return res;
});

/**
 * Returns a new set with all the keys from both sets.
 *
 * @sig SetOps s => s -> s -> s
 * @since 0.6.0
 */
SetOps.union = _curryN(2, typeclass.forward('union', setOpsForModule));

/**
 * Returns a new set with all the keys in the left that are not present in the right.
 *
 * @sig SetOps s => s -> s -> s
 * @since 0.6.0
 */
SetOps.difference = _curryN(2, typeclass.forward('difference', setOpsForModule));

/**
 * Returns a new set with all the keys in both the left and right set.
 *
 * @sig SetOps s => s -> s -> s
 * @since 0.6.0
 */
SetOps.intersection = _curryN(2, typeclass.forward('intersection', setOpsForModule));

/**
 * Returns a new set with all the keys in left or right, but not in both.
 *
 * @sig SetOps s => s -> s -> s
 * @since 0.6.0
 */
SetOps.symmetricDifference = _curryN(2, typeclass.forward('symmetricDifference', setOpsForModule));

module.exports = typeclass(SetOps, {
    deriveFn: setOpsForModule,
    deriveProtoFn: setOpsForModulePrototype,
    required: ['union', 'difference', 'intersection', 'symmetricDifference'],
    superTypes: [],
});
