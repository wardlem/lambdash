const sumType = require('./sumType');
const _curry = require('./internal/_curry');

const Ordering = sumType('Ordering', {LT: [], EQ: [], GT: []});

// Implementation for Ord
Ordering.compare = _curry(function(left, right) {
    return Ordering.fromInt(Ordering.toInt(left) - Ordering.toInt(right));
});

// Implementation for Enum
Ordering.fromNum = Ordering.fromInt = Ordering.fromInt = function(num) {
    return num < 0 ? Ordering.LT
        : num > 0 ? Ordering.GT
        : Ordering.EQ;
};

Ordering.toNum = Ordering.toInt = Ordering.case({
    LT: -1,
    GT: 1,
    EQ: 0,
});

module.exports = Ordering;
