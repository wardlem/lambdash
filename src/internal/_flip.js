var _curry = require('./_curry');
var _curryN = require('./_curryN');

module.exports = _curry(function flip(fn) {
    return _curryN(fn.length, function(a,b){
        var tmp = a;
        arguments[0] = b;
        arguments[1] = tmp;
        return fn.apply(this, arguments);
    })
});
