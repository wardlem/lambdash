const Protocol = require('./Protocol');

const Keyed = Protocol.define('SetKind', {
    has: null,
    'delete': null,
    size: null,
}, []);

module.exports = Keyed;
