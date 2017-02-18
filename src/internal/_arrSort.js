var _slice = require('./_slice');

module.exports = function _arrSort(arr, fn) {
    return _slice(arr).sort(fn);
};
