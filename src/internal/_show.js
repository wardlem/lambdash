var _curry = require('./_curry');
var _moduleFor = require('./_moduleFor');
var _isFunction = require('./_isFunction');

module.exports = _curry(function(value){
    var M = _moduleFor(value);
    if (_isFunction(M.show)) {
        return M.show(value);
    }

    return String(value);

    //throw new TypeError('Show#show called on a value that does not implement Show.');
});