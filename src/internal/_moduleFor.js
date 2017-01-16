var _primitives = require('./_primitives');
var _isModule = require('./_isModule');
var _isSubModule = require('./_isSubModule');

function moduleFor(value) {
    if (value == null) {
        return _primitives.Unit;
    }

    var C = value.constructor;

    if (_isModule(C)) {
        if (_isSubModule(C)) {
            return C['@@functional/parentModule'];
        }
        return C;
    }

    switch(C){
        case Number:
            return _primitives.Number;
        case Boolean:
            return _primitives.Boolean;
        case String:
            return _primitives.String;
        case Array:
            return _primitives.Array;
        case Function:
            return _primitives.Function;
        case RegExp:
            return _primitives.RegExp;
        case Date:
            return _primitives.Date;
        case Object:
        case null:
            return _primitives.Object;
        case Map:
            return _primitives.Map;
        case Set:
            return _primitives.Set;
        default:
            // not a plain javascript object
            return C;
    }
}

module.exports = moduleFor;
