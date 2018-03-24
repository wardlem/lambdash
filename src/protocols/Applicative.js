const Protocol = require('./Protocol');
const Apply = require('./Apply');
const Of = require('./Of');

const Applicative = Protocol.define('Applicative', {
}, [Apply, Of]);

module.exports = Applicative;
