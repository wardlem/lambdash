const Protocol = require('./Protocol');
const Applicative = require('./Applicative');

const Monad = Protocol.define('Monad', {
    flatten: null,
    flatMap: function flatMap(fn) {
        return this[Monad.map](fn)[Monad.flatten]();
    },
}, [Applicative]);

module.exports = Monad;
