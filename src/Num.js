var _is = require('./internal/_is');
var _curry = require('./internal/_curry');
var _identity = require('./internal/_identity');

var Ordering = require('./Ordering');

var Num = require('./internal/_primitives').Num;

// Implementation for Eq
Num.equal = _is;

// Implementation for Ord
Num.compare = _curry(function(left, right) {
    return Ordering.fromNum(left - right);
});

// Implementation for Enum
Num.toInt = function(value) {
    return value << 0;
};

Num.fromInt = _identity;

module.exports = Num;