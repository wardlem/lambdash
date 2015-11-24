var _curry = require('./_curry');

module.exports = _curry(function flip(fn, a, b) {
    return fn(b, a);
});