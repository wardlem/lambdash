const Protocol = require('./Protocol');

const Case = Protocol.define('Case', {
    'case': null,
    caseOr: function(cases, def) {
        if (cases.hasOwnProperty(Case.default)) {
            return this[Case.case](cases);
        } else {
            return this[Case.case](Object.assign({}, cases, {[Case.default]: def}));
        }
    },
});

Case.default = Symbol('Case.default');

module.exports = Case;
