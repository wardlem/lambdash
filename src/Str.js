var _is = require('./internal/_is');
var _curry = require('./internal/_curry');
var _identity = require('./internal/_identity');

var Ordering = require('./Ordering');

var Str = require('./internal/_primitives').Str;

// Implementation for Eq
Str.equal = _is;

// Implementation for Ord
Str.compare = _curry(function(left, right) {
    return left < right ? Ordering.LT
        : left > right ? Ordering.GT
        : Ordering.EQ
});

// Implementation for Enum
Str.toInt = function(value) {
    if (value.length === 0) {
        throw new TypeError('Can not convert empty string to integer');
    }

    return value.charCodeAt(0);
};

Str.fromInt = String.fromCharCode;

module.exports = Str;