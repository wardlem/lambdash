var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');
var _isNumber = require('./internal/_isNumber');
var _flip = require('./internal/_flip');
var _alwaysThrow = require('./internal/_alwaysThrow');

var Eq = require('./Eq');
var Enum = require('./Enum');

var Numeric = module.exports;

Numeric.equal = Eq.equal;
Numeric.toInt = Enum.toInt;


var _binOp = _curry(function(op, fail, a, b) {
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

    //if (_isFunction(M.fromNum) && _isFunction(M.toNum)) {
    //    return M.fromNum(Num[op](M.toNum(a), M.toNum(b)));
    //}

    return fail(a, b, M);
});

var _unaryOp = _curry(function(op, fail, a) {
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

    //if (_isFunction(M.fromNum) && _isFunction(M.toNum)) {
    //    return M.fromNum(Num[op](M.toNum(a)));
    //}

    return fail(a, M);
});

var _fail = function(op) {
    return _alwaysThrow(TypeError, 'Numeric#' + op + ' called on a value that does not implement it')
};

Numeric.add = _binOp('add', _fail('sum'));
Numeric.sub = _binOp('sub', _fail('sub'));
Numeric.subBy = _flip(Numeric.sub);
Numeric.mul = _binOp('mul', _fail('mul'));
Numeric.div = _binOp('div', _fail('div'));
Numeric.divBy = _flip(Numeric.div);
Numeric.mod = _binOp('mod', _fail('mod'));
Numeric.modBy = _flip(Numeric.mod);

Numeric.toNum = _unaryOp('toNum', _fail('toNum'));
Numeric.abs = _unaryOp('abs', function(a, M) {
    if (_isFunction(M.fromInt) && _isFunction(M.mul) && _isFunction(M.sign)) {
        var sign = M.sign(a);
        return M.mul(a, sign);
    }

    throw new TypeError('Could not get absolute value of number');
});

Numeric.sign = _unaryOp('sign', function(a, M) {
    if (_isFunction(M.toNum) && _isFunction(M.fromInt)) {
        return M.fromInt(Numeric.sign(M.toNum(a)));
    }

    _fail('sign')();
});

Numeric.negate = _unaryOp('negate', function(a, M) {

    // derived
    if (_isFunction(M.fromInt) && _isFunction(M.mul)) {
        var negOne = M.fromInt(-1);
        return M.mul(a, negOne);
    }

    throw new TypeError('Could not negate value');
});

Numeric.reciprocal = _unaryOp('reciprocal', function(value, M) {

    // derived
    if (_isFunction(M.fromNum) && _isFunction(M.div)) {
        var one = M.fromNum(1);
        return M.div(one, value);
    }

    throw new TypeError('Could not get reciprocal of value');

});

Numeric.pow = _binOp('pow', function(a, b, M) {

    if (_isFunction(M.toNum) && _isFunction(M.fromNum)) {
        return M.fromNum(Math.pow(M.toNum(a), M.toNum(b)));
    }

    throw new TypeError('Could not pow value');
});

Numeric.powBy = _flip(Numeric.pow);