var _arity = require('./_arity');

module.exports = function not(fn) {
    return _arity(fn.length, function(){
        return !fn.apply(this, arguments);
    })
};