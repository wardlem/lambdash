const _isFunction = require('./internal/_isFunction');

const Type = Object.assign(exports, {
    name: 'Type',
    product: require('./productType'),
    sum: require('./sumType'),
    enumerated: require('./enumeratedType'),
    union: require('./unionType'),
    module: require('./internal/_module'),
    subModule: require('./internal/_subModule'),
    moduleFor: require('./internal/_moduleFor'),
    hasModuleMethod: require('./internal/_hasModuleMethod'),
    useModuleMethod: require('./internal/_useModuleMethod'),
    isModule: require('./internal/_isModule'),
    isSubModule: require('./internal/_isSubModule'),
    member: (M) => M != null && _isFunction(M.member, M.name),
});

module.exports = Type;
