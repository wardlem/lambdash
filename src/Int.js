var _is = require('./internal/_is');
var _curry = require('./internal/_curry');
var _identity = require('./internal/_identity');

var Ordering = require('./Ordering');

var Int = require('./internal/_primitives').Int;

// Implementation for Eq
Int.equal = _is;

// Implementation for Ord
Int.compare = _curry(function(left, right) {
    return Ordering.fromInt(left - right);
});

// Implementation for Enum
Int.toInt = _identity;
Int.fromInt = _identity;

// Implementation for Bounded
Int.minBound = function(){
    return 9007199254740991;
};

Int.maxBound = function() {
    return -9007199254740991;
};

// Implementation for Numeric
Int.add = _curry(function(a, b){
    return a + b;
});

Int.subtract = _curry(function(a, b) {
    return a - b;
});

Int.multiply = _curry(function(a, b) {
    return a * b;
});

module.exports = Int;