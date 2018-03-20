const Protocol = require('./Protocol');

const Associative = require('./Associative');
const SetLike = require('./SetLike');

const Set = Protocol.define('Set', {
    has: Associative.exists,
    insert: null,
    'delete': Associative.delete,
    size: Associative.size,
}, [SetLike]);

module.exports = Set;
