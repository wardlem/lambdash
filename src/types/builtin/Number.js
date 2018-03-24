const Ord = require('../../protocols/Ord');
const Protocol = require('../../protocols/Protocol');
const Numeric = require('../../protocols/Numeric');
const Enumerable = require('../../protocols/Enumerable');
const Case = require('../../protocols/Case');
const Show = require('../../protocols/Show');
const Logical = require('../../protocols/Logical');
const Clone = require('../../protocols/Clone');
const Ordering = require('../Ordering');

const Type = require('../Type');

const _isFunction = require('../../internal/_isFunction');
const _identity = require('../../internal/_identity');

const merge = require('../../util/mergeDescriptors');

merge(Number.prototype, {
    [Ord.compare](other) {
        return Ordering(this.valueOf() - other.valueOf());
    },
    [Ord.lte](other) {
        return this.valueOf() <= other.valueOf();
    },
    [Ord.gte](other) {
        return this.valueOf() >= other.valueOf();
    },
    [Ord.lt](other) {
        return this.valueOf() < other.valueOf();
    },
    [Ord.gt](other) {
        return this.valueOf() > other.valueOf();
    },
    [Ord.equals](other) {
        return this.valueOf() === other.valueOf();
    },
    [Enumerable.prev]() {
        // TODO: this should be an integer
        return Math.trunc(this.valueOf()) - 1;
    },
    [Enumerable.next]() {
        // TODO: this should be an integer
        return Math.trunc(this.valueOf()) + 1;
    },
    [Numeric.toNumber]() {
        return this.valueOf();
    },
    [Numeric.fromNumber]: _identity,
    [Numeric.plus](other) {
        return this.valueOf() + other.valueOf();
    },
    [Numeric.minus](other) {
        return this.valueOf() - other.valueOf();
    },
    [Numeric.times](other) {
        return this.valueOf() * other.valueOf();
    },
    [Numeric.divide](other) {
        return this.valueOf() / other.valueOf();
    },
    [Numeric.modulus](other) {
        return this.valueOf() % other.valueOf();
    },
    [Numeric.pow](other) {
        return Math.pow(this.valueOf(), other.valueOf());
    },
    [Numeric.abs]() {
        return Math.abs(this.valueOf());
    },
    [Numeric.sign]() {
        return Math.sign(this.valueOf());
    },
    [Numeric.negate]() {
        return this.valueOf() * -1;
    },
    [Numeric.reciprocal]() {
        return 1 / this.valueOf();
    },
    [Numeric.round]() {
        return Math.round(this.valueOf());
    },
    [Numeric.ceil]() {
        return Math.ceil(this.valueOf());
    },
    [Numeric.floor]() {
        return Math.floor(this.valueOf());
    },
    [Numeric.trunc]() {
        return Math.trunc(this.valueOf());
    },
    [Case.case](cases) {
        const keys = Object.keys(cases);
        function found(value) {
            if (_isFunction(value)) {
                return value(this.valueOf());
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
                    gt = true;
                    eq = false;
                } else if (keypart[0] === '<') {
                    keypart = keypart.substr(1);
                    lt = true;
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

                if (eq && this.valueOf() === keyval) {
                    return found(cases[key]);
                } else if (gt && this.valueOf() > keyval) {
                    return found(cases[key]);
                } else if (lt && this.valueOf() < keyval) {
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
        return String(this.valueOf());
    },
    [Logical.toFalse]() {
        return 0;
    },
    [Clone.clone]() {
        return this.valueOf();
    },
});

Number[Type.has] = function has(value) {
    // TODO: allow NaN?
    return typeof value === 'number' || value instanceof Number;
};

Protocol.implement(Number, Ord, Numeric, Enumerable, Case, Show, Logical, Clone);

module.exports = Number;
