const Protocol = require('./Protocol');

const Clonable = Protocol.define('Clonable', {
    clone: null,
});

module.exports = Clonable;
