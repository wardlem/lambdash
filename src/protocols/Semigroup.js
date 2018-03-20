const Protocol = require('./Protocol');

const Semigroup = Protocol.define('Semigroup', {
    concat: null,
});

module.exports = Semigroup;
