var _moduleFor = require('./internal/_moduleFor');
var _isFunction = require('./internal/_isFunction');
var _isInteger = require('./internal/_isInteger');
var _curry = require('./internal/_curry');
var Int = require('./internal/_primitives').Int;

var Bounded = require('./Bounded');

var Enum = module.exports;


var fromInt = _curry(function fromInt(M, value){

    if (M !== Int && !_isFunction(M.fromInt)) {
        throw new TypeError('Type can not be converted from Int');
    }

    return M.fromInt(value);
});

Enum.toInt = function toInt(value) {
    if (value == null) {
        throw new TypeError('Enum#toInt requires a defined, non-null value');
    }

    if (_isInteger(value)) {
        return value;
    }

    if (_isFunction(value.toInt)) {
        return value.toInt();
    }

    var M = _moduleFor(value);
    if (_isFunction(M.toInt)) {
        return M.toInt(value);
    }

    throw new TypeError('Enum#toInt called on a value that does not implement Enum');
};

Enum.prev = function(value) {
    if (value == null) {
        throw new TypeError('Enum#pred requires a defined, non-null value');
    }

    if (Bounded.isBounded(value) && Bounded.isMin(value)) {
        throw new RangeError('Value out of enum in Enum#prev');
    }

    return fromInt(_moduleFor(value), Enum.toInt(value) - 1);
};

Enum.next = function(value) {
    if (value == null) {
        throw new TypeError('Enum#pred requires a defined, non-null value');
    }

    if (Bounded.isBounded(value) && Bounded.isMax(value)) {
        throw new RangeError('Value out of enum in Enum#next');
    }

    return fromInt(_moduleFor(value), Enum.toInt(value) + 1);
};

var _makeEnum = function(withLast, M, step, fromVal, toVal) {
    var res = [];

    var _fromInt = fromInt(M);

    while(fromVal != toVal) {
        res.push(_fromInt(fromVal));
        fromVal = step(fromVal);
    }
    if (withLast) {
        res.push(_fromInt(fromVal));
    }

    return res;
};

var _enum = _curry(function(withLast, from, to) {
    var fromVal = Enum.toInt(from);
    var toVal = Enum.toInt(to);

    var step = toVal < fromVal ? Int.add(-1)  : Int.add(1);

    return _makeEnum(withLast, _moduleFor(from), step, fromVal, toVal);
});

//var _enumBy = _curry(function(withLast, span, from, to) {
//    var fromVal = Enum.toInt(from);
//    var toVal = Enum.toInt(to);
//
//    span = Math.abs(Enum.toInt(span));
//    if (span === 0) {
//        throw new EnumError('Enum#' + (withLast ? 'enumToBy' : 'enumUntilBy') + ' can not have a span of 0');
//    }
//
//    var step = toVal < fromVal ? Int.add(-span)  : Int.add(span);
//
//    return _makeEnum(withLast, _moduleFor(from), step, fromVal, toVal);
//});

Enum.enumTo = _enum(true);
Enum.enumUntil = _enum(false);

Enum.enumFrom = _curry(function(count, from) {

    if (!Int.valid(count)) {
        throw new TypeError('Enum#enumFrom must have an integer for the count parameter');
    }

    var fromVal = Enum.toInt(from);
    var toVal = fromVal + count;

    var step = toVal < fromVal ? Int.add(-1)  : Int.add(1);

    return _makeEnum(false, _moduleFor(from), step, fromVal, toVal);
});


//Enum.enumToBy = _enumBy(true);
//Enum.enumUntilBy = _enumBy(false);

