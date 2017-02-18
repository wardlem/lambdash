const _isDefined = require('./internal/_isDefined');
const _isFunction = require('./internal/_isFunction');

module.exports = (types) => {
    const constraints = types.map(function(type) {
        return type != null && _isFunction(type.member) ? type.member
            :  _isFunction(type) ? (v) => v instanceof type
            :  _isDefined;
    });

    let Union = Object.create(null);

    return Object.assign(Union, {
        member: (v) => constraints.reduce((res, validator) => res || validator(v), false),
        name: types.map((T) => T.name || '').join('Or'),
    });
};
