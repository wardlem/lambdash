var _arity = require('./_arity');
var _slice = require('./_slice');
var _curryN = require('./_curryN');
var _last = require('./_last');
var Fun = require('./_primitives').Fun;

module.exports = function compose() {
    if (arguments.length === 0) {
        throw new TypeError('Fun#compose can not be called without any arguments.');
    }

    var f = Fun.assert(_last(arguments));

    var args = arguments;

    var argsInd = arguments.length - 2;
    while(argsInd >= 0) {
        f = (function(g){
            var f = Fun.assert(args[argsInd]);
            return function() {
                return f.call(this, g.apply(this, arguments));
            }
        })(f);

        argsInd -= 1;
    }

    return _curryN(_last(args).length, f);


    //var g = compose.apply(compose, _slice(arguments, 1));
    //
    //return _curryN(g.length, function() {
    //    return f.call(this, g.apply(this, arguments));
    //});
};