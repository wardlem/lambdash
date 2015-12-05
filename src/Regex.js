var Regex = require('./internal/_primitives').Regex;

Regex.toString = function(value) {
    return value.toString();
};

module.exports = Regex;