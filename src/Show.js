var _moduleFor = require('./internal/_moduleFor');
var _isFunction = require('./internal/_isFunction');
var _curry = require('./internal/_curry');

var Show = module.exports;

/**
 * Converts a value to its string representation.
 *
 * @sig Show s => s -> String
 * @since 0.5.0
 * @param {Show} value
 * @returns {String} a string representation of the value
 */
Show.show = _curry(function(value) {
    if (value == null) {
        return String(value);
    }

    var M = _moduleFor(value);
    if (_isFunction(M.show)) {
        return M.show(value);
    }

    throw new TypeError('Show#show called on a value that does not implement Show.');
});

Show.member = function(value) {
    if (value == null) {
        return true;
    }

    return _isFunction(_moduleFor(value).show);
};