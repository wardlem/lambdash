var _compose = require('./_compose');
var _reverse = require('./_reverse');

module.exports = function pipe() {
    if (arguments.length === 0) {
        throw new TypeError('Fun#pipe can not be called without any arguments.');
    }

    return _compose.apply(this, _reverse(arguments));
};
