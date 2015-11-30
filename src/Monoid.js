var _moduleFor = require('./internal/_moduleFor');
var _curryN = require('./internal/_curryN');
var _flip = require('./internal/_flip');
var _isFunction = require('./internal/_isFunction');
var _slice = require('./internal/_slice');

var Monoid = module.exports;

Monoid.empty = function(value) {
    var M = _moduleFor(value);
    return M.empty();
};

Monoid.concat = function() {
    if (arguments.length === 0) {
        throw new TypeError('Monoid#concat can not be called without any arguments');
    }

    var start = arguments[0];
    var rest = _slice(arguments, 1);

    if (_isFunction(start.concat)) {
        return start.concat.apply(start, rest);
    }

    var M = _moduleFor(start);
    if (_isFunction(M.concat)) {
        return M.concat.apply(M, arguments);
    }

    throw new TypeError('Monoid#concat called with arguments that do not implement Monoid');
};

Monoid.append = _curryN(2, Monoid.concat);

Monoid.prepend = _flip(Monoid.append);

