var _arity = require('./_arity');

module.exports = function or() {
    var conditions = arguments;

    return _arity(conditions[0].length, function() {
        var ind = 0;
        while (ind < conditions.length) {
            if (conditions[ind].apply(this, arguments)) {
                return true;
            }
            ind += 1;
        }
        return false;
    });
};
