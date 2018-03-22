const Sum = require('./Sum');

const Protocol = require('../protocols/Protocol');

const Numeric = require('../protocols/Numeric');
const Case = require('../protocols/Case');
const Ord = require('../protocols/Ord');
const Bounded = require('../protocols/Bounded');
const Enumerable = require('../protocols/Enumerable');

const merge = require('../../util/mergeDescriptors');

const Ordering = Sum.define(function Ordering(value) {
    if (typeof value !== 'number') {
        throw new TypeError('Ordering constructor should be called with a number');
    }

    return Ordering.prototype[Numeric.fromNumber].call(null, value);
}, {
    LT: null,
    EQ: null,
    GT: null,
});

merge(Ordering.prototype, {
    [Numeric.fromNumber](value) {
        if (value < 0) {
            return Ordering.LT;
        } else if (value > 0) {
            return Ordering.GT;
        } else {
            return Ordering.EQ;
        }
    },
    [Numeric.toNumber]() {
        return this[Case.case]({
            LT: -1,
            EQ: 0,
            GT: 1,
        });
    },
    [Ord.lte](other) {
        return this[Numeric.toNumber]()[Ord.lte](other[Numeric.toNumber()]);
    },
    [Bounded.minBound]() { return Ordering.LT; },
    [Bounded.maxBound]() { return Ordering.GT; },
    [Enumerable.prev]() {
        return this.case({
            LT: () => {throw new RangeError('Cannot call Enumerable.prev on Ordering.LT');},
            EQ: Ordering.LT,
            GT: Ordering.EQ,
        });
    },
    [Enumerable.next]() {
        return this.case({
            LT: Ordering.EQ,
            EQ: Ordering.GT,
            GT: () => {throw new RangeError('Cannot call Enumerable.next on Ordering.GT');},
        });
    },
    isLT() { return this === Ordering.LT; },
    isEQ() { return this === Ordering.EQ; },
    isGT() { return this === Ordering.GT; },
    isLTE() { return this !== Ordering.GT; },
    isGTE() { return this !== Ordering.LT; },
    isNE() { return this !== Ordering.EQ; },
});

Protocol.implement(Ordering, Ord, Numeric, Bounded);

module.exorts = Ordering;
