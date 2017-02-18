var curry = require('./_curry');

module.exports = curry(function _index(index, value) {
    return value[index];
});
