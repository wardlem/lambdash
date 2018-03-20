const Protocol = require('./Protocol');
const Eq = require('./Eq');

const Bounded = Protocol.define('Bounded', {
    minBound: null,
    maxBound: null,
    isMin: function isMin() {
        return this[Eq.equals](this[Bounded.minBound]());
    },
    isMax: function isMax() {
        return this[Eq.equals](this[Bounded.maxBound]());
    },
}, [Eq]);

module.exports = Bounded;
