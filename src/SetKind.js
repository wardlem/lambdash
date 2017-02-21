const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');

const SetOps = require('./SetOps');


const SetKind = {name: 'SetKind'};

const setKindForModule = _typecached((M) => {
    if (!SetKind.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement SetKind`);
    }

    const _SetKind = {
        exists: M.exists,
        insert: M.insert,
        remove: M.remove,
    };

    return _SetKind;
});

const setKindForModulePrototype = _typecached((M) => {
    const methods = setKindForModule(M);

    const res = {};
    Object.keys(methods).forEach((method) => {
        res[method] = _thisify(methods[method]);
    });

    return res;
});

/**
 * Returns true if the key is in the set.
 *
 * @sig SetKind s => k -> s k -> Boolean
 * @since 0.6.0
 */
SetKind.exists = _curryN(2, typeclass.forward('exists', setKindForModule));

/**
 * Returns a new set with the key added.
 *
 * @sig SetKind s => k -> s k -> s k
 * @since 0.6.0
 */
SetKind.insert = _curryN(2, typeclass.forward('insert', setKindForModule));

/**
 * Removes a new set with an element removed from another set.
 *
 * @sig SetKind s => k -> s k -> s k
 * @since 0.6.0
 */
SetKind.remove = _curryN(2, typeclass.forward('remove', setKindForModule));

module.exports = typeclass(SetKind, {
    deriveFn: setKindForModule,
    deriveProtoFn: setKindForModulePrototype,
    required: ['exists', 'insert', 'remove'],
    superTypes: [SetOps],
});
