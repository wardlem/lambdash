var _curry = require('./internal/_curry');

var _RegExp = require('./internal/_primitives').RegExp;

/**
 * Point-free, curried form of regular expression's test method.
 *
 * @sig String -> RegExp -> Boolean
 * @since 0.6.0
 */
_RegExp.test = _curry(function(str, re) {
    return re.test(str);
});

/**
 * Point-free, curried form of a regular expression's exec method.
 *
 * Unlike the built in _RegExp.prototype.exec function, this function will return
 * an empty array if no matches are found.
 *
 * @sig String -> RegExp -> [String]
 * @since 0.6.0
 */
_RegExp.exec = _curry(function(str, re) {
    return re.exec(str) || [];
});

_RegExp.show = function(value) {
    return value.toString();
};

module.exports = _RegExp;
