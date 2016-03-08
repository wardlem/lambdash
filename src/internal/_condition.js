var _curry = require('./_curry');

module.exports = function() {
    // https://github.com/ramda/ramda/blob/master/src/cond.js
    var conditions = arguments;
    return function() {
        var condIndex = 0;
        while (condIndex < conditions.length) {
            if (conditions[condIndex][0].apply(this, arguments)) {
                return conditions[condIndex][1].apply(this, arguments);
            }
            condIndex += 1;
        }
    }
};
