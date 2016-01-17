var _curry = require('./internal/_curry');

var Regex = require('./internal/_primitives').Regex;

/**
 * Point-free, curried form of regular expression's test method.
 *
 * @sig String -> RegExp -> Boolean
 * @since 0.6.0
 */
Regex.test = _curry(function(str, re){
    return re.test(str);
});

/**
 * Point-free, curried form of a regular expression's exec method.
 *
 * @sig String -> RegExp -> null|Array
 * @since 0.6.0
 */
Regex.exec = _curry(function(str, re){
    return re.exec(str);
});

Regex.show = function(value) {
    return value.toString();
};

module.exports = Regex;