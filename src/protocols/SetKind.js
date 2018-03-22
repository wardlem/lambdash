const Protocol = require('./Protocol');

const SetLike = require('./SetLike');
const Keyed = require('./Keyed');

const SetKind = Protocol.define('SetKind', {
    insert: null,
}, [SetLike, Keyed]);

module.exports = SetKind;
