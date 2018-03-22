const Ord = require('../../protocols/Ord');
const Protocol = require('../../protocols/Protocol');
const Numeric = require('../../protocols/Numeric');
const Enumerable = require('../../protocols/Enumerable');
const Case = require('../../protocols/Case');
const Show = require('../../protocols/Show');
const Logical = require('../../protocols/Logical');
const Ordering = require('../Ordering');

const Type = require('../Type');

const _isFunction = require('../internal/_isFunction');
const _identity = require('../internal/_identity');

const merge = require('../../util/mergeDescriptors');

merge(Number.prototype, {
    [Ord.compare](other) {
        return Ordering(this - other);
    },
    [Ord.lte](other) {
        return this <= other;
    },
    [Ord.gte](other) {
        return this >= other;
    },
    [Ord.lt](other) {
        return this < other;
    },
    [Ord.gt](other) {
        return this > other;
    },
    [Ord.equals](other) {
        return this === other;
    },
    [Enumerable.prev]() {
        // TODO: this should be an integer
        return Math.trunc(this) - 1;
    },
    [Enumerable.next]() {
        // TODO: this should be an integer
        return Math.trunc(this) + 1;
    },
    [Numeric.toNumber]: _identity,
    [Numeric.fromNumber]: _identity,
    [Numeric.plus](other) {
        return this + other;
    },
    [Numeric.minus](other) {
        return this - other;
    },
    [Numeric.times](other) {
        return this * other;
    },
    [Numeric.divide](other) {
        return this / other;
    },
    [Numeric.modulus](other) {
        return this % other;
    },
    [Numeric.pos](other) {
        return Math.pow(this, other);
    },
    [Numeric.abs]() {
        return Math.abs(this);
    },
    [Numeric.sign]() {
        return Math.sign(this);
    },
    [Numeric.negate]() {
        return this * -1;
    },
    [Numeric.reciprocal]() {
        return 1 / this;
    },
    [Numeric.round]() {
        return Math.round(this);
    },
    [Numeric.ceil]() {
        return Math.ceil(this);
    },
    [Numeric.floor]() {
        return Math.floor(this);
    },
    [Numeric.trunc]() {
        return Math.trunc(this);
    },
    [Case.case](cases) {
        const keys = Object.keys(cases);
        function found(value) {
            if (_isFunction(value)) {
                return value(this);
            } else {
                return value;
            }
        }

        for (let key of keys) {
            const keyparts = key.split('|');

            for (let keypart of keyparts) {
                let gt = false;
                let lt = false;
                let eq = true;
                if (keypart[0] === '>') {
                    keypart = keypart.substr(1);
                    eq = false;
                } else if (keypart[0] === '<') {
                    keypart = keypart.substr(1);
                    eq = false;
                }

                if (keypart[0] === '=') {
                    eq = true;
                    keypart = keypart.substr(1);
                }

                const keyval = parseFloat(keypart);
                if (Number.isNaN(keyval)) {
                    // invalid key
                    continue;
                }

                if (eq && this === keyval) {
                    return found(cases[key]);
                } else if (gt && this > keyval) {
                    return found(cases[key]);
                } else if (lt && this < keyval) {
                    return found(cases[key]);
                }
            }
        }

        if (cases.hasOwnProperty(Case.default)) {
            return found(cases[Case.default]);
        }

        throw new TypeError(`Missing case for ${this} when matching number value`);
    },
    [Show.show]() {
        return String(this);
    },
});

Number[Type.has] = function has(value) {
    // TODO: allow NaN?
    return typeof value === 'number';
};

Protocol.implement(Number, Ord, Numeric, Enumerable, Case, Show, Logical);

module.exports = Number;
