const Eq = require('../../protocols/Eq');
const Protocol = require('../../protocols/Protocol');
const Show = require('../../protocols/Show');

const Type = require('../Type');

const merge = require('../../util/mergeDescriptors');

function desc(symbol) {
    return symbol.toString().replace(/^Symbol\((.*)\)$/, '$1');
}

merge(Symbol.prototype, {
    [Show.show]() {
        return `Symbol(${desc(this)[Show.show]()})`;
    },
});

Symbol[Type.has] = function has(value) {
    typeof value === 'symbol';
};

Protocol.implement(Symbol, Eq, Show);

module.exports = Symbol;
