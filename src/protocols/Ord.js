const Protocol = require('./Protocol');

const Eq = require('./Eq');

function compare(other) {
    const Ordering = require('../types/Ordering');
    if (this[Ord.lte](other)) {
        if (other[Ord.lte](this)) {
            return Ordering.EQ;
        }
        return Ordering.LT;
    }
    Ordering.GT;
}

function lte(other) {
    // don't use the default since it calls this function
    // which would result in an endless loop...
    if (this[Ord.compare] === compare) {
        return this <= other;
    }
    return this[Ord.compare](other).isLTE();
}

const Ord = Protocol.define('Ord', {
    compare,
    lte,
    lt: function lt(other) {
        return this[Ord.lte](other) && !other[Ord.lte](this);
    },
    gt: function gt(other) {
        return !this[Ord.lte](other);
    },
    gte: function gte(other) {
        return !this[Ord.lt](other);
    },
    equals: [Eq.equals, function equals(other) {
        if (this === other) {
            return true;
        }
        return this[Ord.compare](other).isEQ();
    }],
    min: function min(other) {
        return this[Ord.lte](other) ? this : other;
    },
    max: function max(other) {
        return this[Ord.gte](other) ? this : other;
    },
}, [Eq]);

module.exports = Ord;
