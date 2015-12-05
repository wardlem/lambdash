var _moduleFor = require('./internal/_moduleFor');
var _equal = require('./internal/_equal');
var _isFunction = require('./internal/_isFunction');

var Bounded = module.exports;


Bounded.isMin = function(value) {
    return _equal(value, Bounded.minBound(value));
};

Bounded.isMax = function(value) {
    return _equal(value, Bounded.maxBound(value));
};


Bounded.minBound = function(value) {
    var M = _moduleFor(value);

    return M.minBound();
};

Bounded.maxBound = function(value) {
    var M = _moduleFor(value);

    return M.maxBound();
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