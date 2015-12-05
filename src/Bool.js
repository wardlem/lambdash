var _curry = require('./internal/_curry');
var _always = require('./internal/_always');

var Ordering = require('./Ordering');
var Stringable = require('./Stringable');

var Bool = require('./internal/_primitives').Bool;

// Implementation for Eq
Bool.equal = function(left, right) {
    return left === right;
};

// Implementation for Ord
Bool.compare = _curry(function(left, right) {
    return Ordering.fromInteger(left - right);
});

// Implementation for Enum
Bool.toInteger = function(value) {
    return +value;
};

Bool.fromInteger = function(value) {
    return value !== 0;
};

// Implementation for Bounded
Bool.minBound = function() {
    return false;
};

Bool.maxBound = function() {
    return true;
};

Bool.and = _curry(function(left, right) {
    return left && right;
});

Bool.or = _curry(function(left, right) {
    return left || right;
});

Bool.not = function(bool) {
    return !bool;
};

Bool.T = _always(true);
Bool.F = _always(false);


module.exports = Bool;

