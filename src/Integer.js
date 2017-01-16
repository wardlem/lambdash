var _is = require('./internal/_is');
var _curry = require('./internal/_curry');
var _identity = require('./internal/_identity');

var Ordering = require('./Ordering');

var _Integer = require('./internal/_primitives').Integer;

// Implementation for Eq
_Integer.eq = _is;

// Implementation for Ord
_Integer.compare = _curry(function(left, right) {
    return Ordering.fromInt(left - right);
});

// Implementation for Enum
_Integer.toInt = _identity;
_Integer.fromInt = _identity;

// Implementation for Bounded
_Integer.minBound = function(){
    return -2147483648;
};

_Integer.maxBound = function() {
    return 2147483647;
};

// Implementation for Numeric
_Integer.add = _curry(function(a, b){
    return a + b;
});

_Integer.sub = _curry(function(a, b) {
    return a - b;
});

_Integer.mul = _curry(function(a, b) {
    return a * b;
});

_Integer.div = _curry(function(a, b) {
    return b === 0 ? NaN : (a << 0 / b << 0) << 0;
});

module.exports = _Integer;
