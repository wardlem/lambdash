const Protocol = require('./Protocol');

const Case = Protocol.define('Case', {
    'case': null,
});

Case.default = Symbol('default');

module.exports = Case;
