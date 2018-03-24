const Ord = require('../../protocols/Ord');
const Protocol = require('../../protocols/Protocol');
const Numeric = require('../../protocols/Numeric');
const Show = require('../../protocols/Show');
const Clone = require('../../protocols/Clone');

const Type = require('../Type');

const merge = require('../../util/mergeDescriptors');

merge(Date.prototype, {
    [Ord.equals](other) {
        return Number(this) === Number(other);
    },
    [Ord.lte](other) {
        return this <= other;
    },
    [Numeric.toNumber]() {
        return Number(this);
    },
    [Numeric.fromNumber](number) {
        return new Date(number);
    },
    [Show.show]() {
        if (isNaN(this)) {
            return 'new Date("Invalid Date")';
        }
        return `new Date("${this.toISOString()}")`;
    },
    [Clone.clone]() {
        return new Date(Number(this));
    },
});

Date[Type.has] = function has(value) {
    return value instanceof Date;
};

Protocol.implement(Date, Ord, Numeric, Show, Clone);

module.exports = Date;
