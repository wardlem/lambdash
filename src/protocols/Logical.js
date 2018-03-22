const Protocol = require('./Protocol');

const Logical = Protocol.define('Logical', {
    toBoolean: function() {
        return Boolean(this);
    },
    or: function(other) {
        if (this.toBoolean()) {
            return this;
        }
        return other;
    },
    and: function(other) {
        if (!this.toBoolean()) {
            return this;
        }
        return other;
    },
});

module.exports = Logical;
