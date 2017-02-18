var _slice = require('./_slice');

module.exports = function _thunk(fn) {
    var args = _slice(arguments, 1);

    return function thunk() {
        return fn.apply(this, args);
    };
};
