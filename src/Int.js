var _is = require('./internal/_is');
var _curry = require('./internal/_curry');
var _identity = require('./internal/_identity');

var Ordering = require('./Ordering');

var Int = require('./internal/_primitives').Int;

// Implementation for Eq
Int.eq = _is;

// Implementation for Ord
Int.compare = _curry(function(left, right) {
    return Ordering.fromInt(left - right);
});

// Implementation for Enum
Int.toInt = _identity;
Int.fromInt = _identity;

// Implementation for Bounded
Int.minBound = function(){
    return -2147483648;
};

Int.maxBound = function() {
    return 2147483647;
};

// Implementation for Numeric
Int.add = _curry(function(a, b){
    return a + b;
});

Int.sub = _curry(function(a, b) {
    return a - b;
});

Int.mul = _curry(function(a, b) {
    return a * b;
});

Int.div = _curry(function(a, b) {
    return b === 0 ? NaN : (a << 0 / b << 0) << 0;

});

module.exports = Int;
