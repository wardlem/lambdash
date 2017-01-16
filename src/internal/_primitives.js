// This is here to avoid a problem with circular dependencies
// Each primitive will register itself in the _primitives object
var _slice = require('./_slice');
var _isBoolean = require('./_isBoolean');
var _isNumber = require('./_isNumber');
var _isInteger = require('./_isInteger');
var _isString = require('./_isString');
var _isArray = require('./_isArray');
var _isObject = require('./_isObject');
var _isPlainObject = require('./_isPlainObject');
var _isFunction = require('./_isFunction');
var _isRegExp = require('./_isRegExp');
var _isDate = require('./_isDate');
var _isDefined = require('./_isDefined');
var _isUnit = require('./_isUnit');
var _isMap = require('./_isMap');
var _isSet = require('./_isSet');
var _curry = require('./_curry');


var _primitives = module.exports;

var _assert = _curry(function(test, msg, value){
    if (!test(value)) {
        throw new TypeError(msg);
    }
    return value;
});

function _Boolean(value) {
    if (null == value) {
        return false;
    }

    if (_isFunction(value.valueOf) && _isBoolean(value.valueOf()) ) {
        return value.valueOf();
    }

    return !!value;
}

_Boolean.member = _isBoolean;
_Boolean.assert = _assert(_isBoolean, "Invalid value for Boolean");

_primitives.Boolean = _Boolean;

function _Number(value) {
    if (_Number.member(+value)) {
        return Num(+value);
    }

    return _Number.assert(parseFloat(value));
}

_Number.member = _isNumber;
_Number.assert = _assert(_isNumber, "Invalid value for Number");
_primitives.Number = _Number;

function _Integer(value) {
    if (_isInteger(+value)) {
        return +value;
    }

    return _Integer.assert(parseInt(value));
}

_Integer.member = _isInteger;
_Integer.assert = _assert(_isInteger, "Invalid value for Integer");

_primitives.Integer = _Integer;

function _String(value) {
    if (!_isDefined(value)) {
        return '';
    }
    return _String.assert(String(value));
}

_String.member = _isString;
_String.assert = _assert(_isString, "Invalid value for String");

_primitives.String = _String;

function _Array() {
    return _slice(arguments);
}

_Array.member = _isArray;
_Array.assert = _assert(_isArray, "Invalid value for Array");

_primitives.Array = _Array;

function _Object(value){
    return Object(value)
}

_Object.member = _isPlainObject;
_Object.assert = _assert(_isPlainObject, "Invalid value for Object");
_primitives.Object = _Object;

function _Set(){
    return new Set(arguments);
}
_Set.member = _isSet;
_Set.assert = _assert(_isSet, "Invalid value for Set");
_primitives.Set = _Set;

function _Map(){
    return new Map(arguments);
}
_Map.member = _isMap;
_Map.assert = _assert(_isMap, "Invalid value for Map");
_primitives.Map = _Map


function _Function(value) {
    return _Function.assert(value);
}

_Function.member = _isFunction;
_Function.assert = _assert(_isFunction, "Invalid value for Function");
_primitives.Function = _Function;


function _RegExp(value) {
    return _RegExp.assert(value);
}

_RegExp.member = _isRegExp;
_RegExp.assert = _assert(_isRegExp, "Invalid value for RegExp");
_primitives.RegExp = _RegExp;


function _Date(value) {
    return _Date.assert(value);
}

_Date.member = _isDate;
_Date.assert = _assert(_isDate, "Invalid value for Date");
_primitives.Date = _Date;

function Unit(value) {
    if (arguments.length === 0)
    {
      return null;
    }
    return Unit.assert(value);
}

Unit.member = _isUnit;
Unit.assert = _assert(_isUnit, "Invalid value for Unit");
_primitives.Unit = Unit;
