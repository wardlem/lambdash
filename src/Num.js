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

// Implementation for numeric
Num.add = _curry(function(a, b) {
    return a + b;
});

Num.sub = _curry(function(a, b) {
    return a - b;
});

Num.mul = _curry(function(a, b) {
    return a * b;
});

Num.div = _curry(function(a, b) {
    return a / b;
});

Num.mod = _curry(function(a, b) {
    return a % b;
});

Num.abs = Math.abs;

Num.neg = function(a) {
    return -a;
};

Num.reciprocal = function(a) {
    return 1 / a;
};

Num.sign = function(a) {
    return a === 0 ? 0 : a < 0 ? -1 : 1;
};

Num.pow = _curry(Math.pow);

module.exports = Num;