var _moduleFor = require('./internal/_moduleFor');
var _isFunction = require('./internal/_isFunction');

var Stringable = module.exports;

Stringable.toString = function(value) {
    if (value != null) {
        if (_isFunction(value.toString)) {
            return value.toString();
        }
        var M = _moduleFor(value);
        if (_isFunction(M.toString)) {
            return M.toString(value);
        }
    }
    return String(value);
};