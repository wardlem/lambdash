const Protocol = require('./Protocol');

const Show = Protocol.define('Show', {
    show: function() {
        return String(this);
    },
});

module.exports = Show;
