var _arity = require('./_arity');
var __ = require('./_blank');
var _slice = require('./_slice');

module.exports = function(fn) {
    return _arity(fn.length - 1, function() {
        var applied = _slice(arguments);
        var count = fn.length - 1;
        var appInd = applied.length;

        while (appInd < count) {
            applied[appInd] = __;
            appInd += 1;
        }

        applied[count] = this;

        return fn.apply(this, applied);

    });
};
