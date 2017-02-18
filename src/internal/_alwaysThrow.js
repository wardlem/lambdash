var _thunk = require('./_thunk');

module.exports = function(Constructor) {
    var thunk = _thunk.apply(this, arguments);

    return function() {
        throw thunk();
    };
};
