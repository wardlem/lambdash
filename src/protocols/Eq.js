const Protocol = require('./Protocol');

const Eq = Protocol.define('Eq', {
    equals: function(other) {
        return this === other;
    },
    notEquals: function(other) {
        return !this[Eq.equals](other);
    },
});

module.exports = Eq;
