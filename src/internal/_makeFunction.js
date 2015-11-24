var _charRange = require('./_charRange');

module.exports = function _makeFunction(name, fn) {
    var argVals = _charRange('a', fn.length).join(', ');
    var wrapped = "(function(fn){ return function " + name + "(" + argVals + "){return fn.apply(this, arguments)}})(fn)";
    return eval(wrapped);
};