var _curryN = require('./_curryN');

module.exports = function curry(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('Can not curry a value that is not a function');
    }

    return _curryN(fn.length, fn);
};