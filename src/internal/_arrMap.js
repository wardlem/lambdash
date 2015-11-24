var _curry = require('./_curry');

module.exports = _curry(function arrMap(fn, arr) {
    return Array.prototype.map.call(arr, fn);
});
