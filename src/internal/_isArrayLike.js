var _isInteger = require('./_isInteger');
var _isDefined = require('./_isDefined');

module.exports = function(value) {
    if (value == null) {
        return false;
    }

    if (!_isInteger(value.length) || value.length < 0) {
        return false;
    }

    if (value.length === 0) {
        return true;
    }

    return _isDefined(value[0]) && _isDefined([value.length - 1]);
};
