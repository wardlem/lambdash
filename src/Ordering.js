var sumType = require('./sumType');
var _is = require('./internal/_is');
var _thisify = require('./internal/_thisify');
var _curry = require('./internal/_curry');

var Ordering = sumType('Ordering', {'LT': [], 'EQ': [], 'GT': []});

// Implementation for Ord
Ordering.compare = _curry(function(left, right) {
    return Ordering.fromInt(Ordering.toInt(right) - Ordering.toInt(left));
});

// Implementation for Enum
Ordering.fromNum = Ordering.fromInt = function(num) {
    return num < 0 ? Ordering.LT
        : num > 0 ? Ordering.GT
        : Ordering.EQ
};

Ordering.toInt = Ordering.case({
    "LT": -1,
    "GT": 1,
    "EQ": 0
});

Ordering.isLessThan = _is(Ordering.LT);
Ordering.isGreaterThan = _is(Ordering.GT);
Ordering.isEqual = _is(Ordering.EQ);

Ordering.prototype.isLessThan = _thisify(Ordering.isLessThan);
Ordering.prototype.isGreaterThan = _thisify(Ordering.isGreaterThan);
Ordering.prototype.isEqual = _thisify(Ordering.isEqual);

module.exports = Ordering;