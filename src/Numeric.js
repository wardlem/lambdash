var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');
var _isNumber = require('./internal/_isNumber');
var _flip = require('./internal/_flip');

var Eq = require('./Eq');
var Enum = require('./Enum');

var Numeric = module.exports;

Numeric.equal = Eq.equal;
Numeric.toInt = Enum.toInt;
Numeric.toNum = function(value) {
    if (value == null) {
        throw new TypeError('Numeric#toNum requires a defined, non-null value');
    }

    if (_isNumber(value)) {
        return value;
    }

    if (_isFunction(value.toNum)) {
        return value.toNum();
    }

    var M = _moduleFor(value);
    if (_isFunction(M.toNum)) {
        return M.toNum(value);
    }

    throw new TypeError('Numeric#toNum called on a value that does not implement Numeric');
};

var _binOp = _curry(function(op, a, b) {
    if (a == null || b == null) {
        throw new TypeError('Numeric#' + op + ' can not operate on null or undefined values');
    }

    if (_isFunction(a[op])) {
        return a[op](b);
    }

    var M = _moduleFor(a);
    if (_isFunction(M[op])) {
        return M[op](a, b);
    }

    throw new TypeError('Numeric#' + op + ' called on values that do not implement Numeric');
});

var _unaryOp = _curry(function(op, a) {
    if (a == null) {
        throw new TypeError('Numeric#' + op + ' can not operate on null or undefined values');
    }

    if (_isFunction(a[op])) {
        return a[op]();
    }

    var M = _moduleFor(a);
    if (_isFunction(M[op])) {
        return M[op](a);
    }

    throw new TypeError('Numeric#' + op + ' called on a value that does not implement Numeric');
});

Numeric.add = _binOp('sum');
Numeric.subtract = _binOp('subtract');
Numeric.subtractBy = _flip(Numeric.subtract);
Numeric.multiply = _binOp('product');
Numeric.divide = _binOp('divide');
Numeric.divideBy = _flip(Numeric.divide);
Numeric.negate = _unaryOp('negate');
Numeric.abs = _unaryOp('abs');
Numeric.signum = _unaryOp('signum');
