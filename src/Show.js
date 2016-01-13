var _moduleFor = require('./internal/_moduleFor');
var _isFunction = require('./internal/_isFunction');
var _curry = require('./internal/_curry');
var _show = require('./internal/_show');

var Show = module.exports;

/**
 * Converts a value to its string representation.
 *
 * @sig Show s => s -> String
 * @since 0.5.0
 * @param {Show} value
 * @returns {String} a string representation of the value
 */
Show.show = _show;

Show.member = function(value) {
    return _isFunction(_moduleFor(value).show);
};