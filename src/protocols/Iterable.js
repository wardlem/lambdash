const Protocol = require('./Protocol');

const Iterable = Protocol.define('Iterable', {
    iterator: Symbol.iterator,
});

module.exports = Iterable;
