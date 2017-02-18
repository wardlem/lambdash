const _curry = require('./internal/_curry');
const _moduleFor = require('./internal/_moduleFor');
const _isFunction = require('./internal/_isFunction');

const Hashable = module.exports;

Hashable.hash = _curry(function(value) {
    const M = _moduleFor(value);
    if (_isFunction(M.hash)) {
        return M.hash(value);
    }

    throw new TypeError('Hashable#hash called on a value that does not implement Hashable.');
});

Hashable.hashWithSeed = _curry(function(seed, value) {
    const M = _moduleFor(value);
    if (_isFunction(M.hashWithSeed)) {
        return M.hashWithSeed(value);
    }

    throw new TypeError('Hashable#hashWithSeed called on a value that does not implement Hashable.');
});

Hashable.member = function(value) {
    const M = _moduleFor(value);
    return _isFunction(M.hash, M.hashWithSeed);
};
