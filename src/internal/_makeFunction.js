const _charRange = require('./_charRange');

const validateIdentifier = (name) => {
    return !!name && typeof name === 'string' && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);
};

module.exports = function _makeFunction(name, fn) {
    // sanitize the identifier, for security and other reasons.
    if (!validateIdentifier) {
        throw new TypeError(`${name} is not a valid identifier.`);
    }
    const argVals = _charRange('a', fn.length).join(', ');
    const wrapped = '(function(fn){ return function ' + name + '(' + argVals + '){return fn.apply(this, arguments)}})(fn)';
    /* eslint no-eval: 0 */
    return eval(wrapped);
};
