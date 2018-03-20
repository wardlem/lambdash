const Protocol = require('./Protocol');
const Functor = require('./Functor');

const Apply = Protocol.define('Apply', {
    ap: null,
}, [Functor]);

module.exports = Apply;
