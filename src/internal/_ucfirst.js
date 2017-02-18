var _curry = require('./_curry');
module.exports = _curry(function(str) {
    if (str.length == 0) {
        return str;
    }

    return str[0].toUpperCase() + str.substr(1);
});
