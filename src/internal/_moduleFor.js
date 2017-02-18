const _primitives = require('./_primitives');
const _isModule = require('./_isModule');
const _isSubModule = require('./_isSubModule');
const _Buffer = require('./_Buffer');
const _isTypedArray = require('./_isTypedArray');

function moduleFor(value) {
    if (value == null) {
        return _primitives.Unit;
    }

    const C = value.constructor;

    if (_isModule(C)) {
        if (_isSubModule(C)) {
            return C['@@functional/parentModule'];
        }
        return C;
    }

    // TODO: consider using Object.prototype.toString.call(value)
    switch (C) {
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
        case _Buffer:
            return _primitives.Uint8Array;
        case ArrayBuffer:
            return _primitives.ArrayBuffer;
        default:
            if (_isTypedArray(value)) {
                return _primitives[C.name];
            }
            // not a plain javascript object
            return C;
    }
}

module.exports = moduleFor;
