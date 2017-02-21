const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');

const Show = {name: 'Show'};

const showForModule = _typecached((M) => {
    const _Show = {};

    _Show.show = M.show
        ? M.show
        : _curryN(1, (v) => String(v))
    ;

    return _Show;
});

const showForModulePrototype = _typecached((M) => {
    const methods = showForModule(M);

    return {
        show: _thisify(methods.show),
    };
});

/**
 * Converts a value to its string representation.
 *
 * @sig Show s => s -> String
 * @since 0.5.0
 * @param {Show} value
 * @returns {String} a string representation of the value
 */
Show.show = _curryN(1, typeclass.forward('show', showForModule));

module.exports = typeclass(Show, {
    deriveFn: showForModule,
    deriveProtoFn: showForModulePrototype,
    required: [],
    superTypes: [],
});
