const Ord = require('../../protocols/Ord');
const Protocol = require('../../protocols/Protocol');
const Numeric = require('../../protocols/Numeric');
const Enumerable = require('../../protocols/Enumerable');
const Case = require('../../protocols/Case');
const Bounded = require('../../protocols/Bounded');
const Show = require('../../protocols/Show');
const Logical = require('../../protocols/Logical');
const Clone = require('../../protocols/Clone');

const _isFunction = require('../internal/_isFunction');
const _identity = require('../internal/_identity');

const merge = require('../../util/mergeDescriptors');

merge(Boolean.prototype, {
    [Ord.lte](other) {
        return this <= other;
    },
    [Bounded.minBound]() {
        return false;
    },
    [Bounded.maxBound]() {
        return true;
    },
    [Numeric.toNumber]() {
        return Number(this);
    },
    [Numeric.fromNumber](number) {
        return Boolean(number);
    },
    [Enumerable.prev]() {
        if (this === true) {
            return false;
        }

        throw new RangeError('Cannot call Enumerable.prev on false');
    },
    [Enumerable.next]() {
        if (this === false) {
            return true;
        }

        throw new RangeError('Cannot call Enumerable.next on true');
    },
    [Case.case](cases) {

        let match = null;
        let hasMatch = false;
        if (cases.hasOwnProperty(String(this))) {
            match = cases[String(this)];
            hasMatch = true;
        } else if (cases.hasOwnProperty(Case.default)) {
            match = cases[Case.default];
            hasMatch = true;
        }

        if (hasMatch) {
            if (_isFunction(match)) {
                return match(this);
            } else {
                return match;
            }
        }

        throw new TypeError(`Missing case for ${this} when matching boolean value`);
    },
    [Show.show]() {
        return String(this);
    },
    [Logical.toBoolean]: _identity,
    [Clone.clone]: _identity,
});

Protocol.implement(Boolean, Ord, Bounded, Numeric, Enumerable, Case, Show, Logical);

module.exports = Boolean;
