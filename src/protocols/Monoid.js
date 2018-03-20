const Protocol = require('./Protocol');

const Eq = require('./Eq');
const Semigroup = require('./Semigroup');

const Monoid = Protocol.define('Monoid', {
    empty: null,
    isempty: function() {
        return this[Eq.equals](this.empty());
    },
}, [Eq, Semigroup]);

module.exports = Monoid;
