var _curry = require('./_curry');

module.exports = _curry(function(fn, arr) {
    if (arr.length === 0) {
        return fn();
    }

    return arr;
});