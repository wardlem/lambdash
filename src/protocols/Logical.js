const Protocol = require('./Protocol');

const Logical = Protocol.define('Logical', {
    toBoolean: function() {
        return Boolean(this);
    },
    toFalse: null,
    or: function(other) {
        if (this[Logical.toBoolean]()) {
            return this;
        }
        return other;
    },
    and: function(other) {
        if (!this[Logical.toBoolean]()) {
            return this;
        }
        return other;
    },
    xor: function(other) {
        if (this[Logical.toBoolean]()) {
            if (other[Logical.toBoolean]()) {
                return this.toFalse();
            } else {
                return this;
            }
        } else if (other[Logical.toBoolean]()) {
            return other;
        } else {
            return this.toFalse();
        }
    },
});

module.exports = Logical;
