var _moduleFor = require('./_moduleFor');

module.exports = function _useModuleMethod(method) {
    return function() {
        var target = arguments[arguments.length - 1];
        var M = _moduleFor(target);
        return M[method].apply(this, arguments);
    };
};
