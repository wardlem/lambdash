const _moduleFor = require('./_moduleFor');
const _last = require('./_last');

module.exports = function _useModuleMethod(method) {
    return function(...args) {
        const target = _last(args);
        const M = _moduleFor(target);
        return M[method].apply(this, args);
    };
};
