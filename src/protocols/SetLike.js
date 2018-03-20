const Protocol = require('./Protocol');

const SetLike = Protocol.define('SetLike', {
    union: null,
    difference: null,
    intersection: null,
    symmetricDifference: function(other) {
        const intersect = this[SetLike.intersection](other);
        return this[SetLike.union](other)[SetLike.difference](intersect);
    },
});

module.exports = SetLike;
