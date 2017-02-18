var _moduleFor = require('./_moduleFor');
var _isFunction = require('./_isFunction');

module.exports = function _hasModuleMethod(method) {
    return function() {
        var target = arguments[arguments.length - 1];
        var M = _moduleFor(target);
        return _isFunction(M[method]);
    };
};
