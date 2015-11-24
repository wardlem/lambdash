var _curry = require('./_curry');

module.exports = _curry(function(fn, init, arr) {
    return Array.prototype.reduce.call(arr, fn, init);
});