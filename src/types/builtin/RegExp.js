const Ord = require('../../protocols/Ord');
const Protocol = require('../../protocols/Protocol');
const Show = require('../../protocols/Show');

const Type = require('../Type');

const merge = require('../../util/mergeDescriptors');

merge(RegExp.prototype, {
    [Ord.equals](other) {
        return this.toString() === other.toString();
    },
    [Ord.lte](other) {
        return this.toString() <= other.toString();
    },
    [Show.show]() {
        return this.toString();
    },
});

RegExp[Type.has] = function has(value) {
    return value instanceof RegExp;
};

Protocol.implement(RegExp, Ord, Show);

module.exports = RegExp;
