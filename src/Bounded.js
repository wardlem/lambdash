var _moduleFor = require('./internal/_moduleFor');
var _equal = require('./internal/_equal');
var _isFunction = require('./internal/_isFunction');

var Bounded = module.exports;

Bounded.isMax = function(value) {
    if (_isFunction(value.isMax)) {
        return value.isMax();
    }
    var M = _moduleFor(value);

    return _equal(value, M.maxBound());
};

Bounded.isMin = function(value) {
    if (_isFunction(value.isMin)) {
        return value.isMin();
    }
    var M = _moduleFor(value);

    return _equal(value, M.minBound());
};

Bounded.isBounded = function(value) {
    if (value == null) {
        return false;
    }
    if (_isFunction(value.isMin) && _isFunction(value.isMax)) {
        return true;
    }

    var M = _moduleFor(value);
    return (_isFunction(M.minBound) && _isFunction(M.maxBound));
};