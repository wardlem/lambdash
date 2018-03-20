const Protocol = require('./Protocol');
const Apply = require('./Apply');

const Applicative = Protocol.define('Applicative', {
    of: null,
}, [Apply]);

module.exports = Applicative;
