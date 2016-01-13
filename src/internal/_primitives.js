// This is here to avoid a problem with circular dependencies
// Each primitive will register itself in the _primitives object
var _slice = require('./_slice');
var _isBoolean = require('./_isBoolean');
var _isNumber = require('./_isNumber');
var _isInteger = require('./_isInteger');
var _isString = require('./_isString');
var _isArray = require('./_isArray');
var _isObject = require('./_isObject');
var _isFunction = require('./_isFunction');
var _isRegExp = require('./_isRegExp');
var _isDate = require('./_isDate');
var _isDefined = require('./_isDefined');
var _isUnit = require('./_isUnit');
var _curry = require('./_curry');


var _primitives = module.exports;

var _assert = _curry(function(test, msg, value){
    if (!test(value)) {
        throw new TypeError(msg);
    }
    return value;
});

function Bool(value) {
    if (null == value) {
        return false;
    }

    if (_isFunction(value.valueOf) && _isBoolean(value.valueOf()) ) {
        return value.valueOf();
    }

    return !!value;
}

Bool.member = _isBoolean;
Bool.assert = _assert(_isBoolean, "Invalid value for Bool");

_primitives.Bool = Bool;

function Num(value) {
    if (Num.member(+value)) {
        return Num(+value);
    }

    return Num.assert(parseFloat(value));
}

Num.member = _isNumber;
Num.assert = _assert(_isNumber, "Invalid value for Num");

_primitives.Num = Num;

function Int(value) {
    if (_isInteger(+value)) {
        return +value;
    }

    return Int.assert(parseInt(value));
}

Int.member = _isInteger;
Int.assert = _assert(_isInteger, "Invalid value for Int");

_primitives.Int = Int;

function Str(value) {
    if (!_isDefined(value)) {
        return '';
    }
    return Str.assert(String(value));
}

Str.member = _isString;
Str.assert = _assert(_isString, "Invalid value for Str");

_primitives.Str = Str;

function Arr() {
    return _slice(arguments);
}

Arr.member = _isArray;
Arr.assert = _assert(_isArray, "Invalid value for Arr");

_primitives.Arr = Arr;

function Obj(value){
    return Object(value)
}

Obj.member = _isObject;
Obj.assert = _assert(_isObject, "Invalid value for Obj");
_primitives.Obj = Obj;


function Fun(value) {
    return Fun.assert(value);
}

Fun.member = _isFunction;
Fun.assert = _assert(_isFunction, "Invalid value for Fun");
_primitives.Fun = Fun;


function Regex(value) {
    return Fun.assert(value);
}

Regex.member = _isRegExp;
Regex.assert = _assert(_isRegExp, "Invalid value for Regex");
_primitives.Regex = Regex;


function DT(value) {
    return DT.assert(value);
}

DT.member = _isDate;
DT.assert = _assert(_isDate, "Invalid value for DT");
_primitives.DT = DT;

function Unit(value) {
    return Unit.assert(value);
}

Unit.member = _isUnit;
Unit.assert = _assert(_isUnit, "Invalid value for Unit");
_primitives.Unit = Unit;

