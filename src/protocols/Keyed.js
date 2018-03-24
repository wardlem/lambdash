const Protocol = require('./Protocol');

const Keyed = Protocol.define('Keyed', {
    has: null,
    'delete': null,
    size: null,
}, []);

module.exports = Keyed;
