var _moduleFor = require('./internal/_moduleFor');
var _curryN = require('./internal/_curryN');
var _isFunction = require('./internal/_isFunction');
var _slice = require('./internal/_slice');
var _equal = require('./internal/_equal');

var Monoid = module.exports;

Monoid.empty = function(value) {
    var M = _moduleFor(value);
    return M.empty();
};

Monoid.isEmpty = function(value) {
    return _equal(value, Monoid.empty(value));
};

Monoid.concat = _curry(function(a, b) {
    var M = _moduleFor(a);
    return M.concat(a, b);
});

Monoid.concatAll = function() {
    if (arguments.length === 0) {
        throw new TypeError('Monoid#concatAll can not be called with no arguments');
    }

    var start = arguments[0];
    var argsInd = 1;

    while(argsInd < arguments.length) {
        start = Monoid.concat(start, arguments[argsInd]);
        argsInd += 1;
    }

    return start;
};

