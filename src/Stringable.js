var _moduleFor = require('./internal/_moduleFor');
var _isFunction = require('./internal/_isFunction');
var Obj = require('./internal/_primitives').Obj;

var Stringable = module.exports;

Stringable.toString = function(value) {
    if (value != null) {
        //if (_isFunction(value.toString)) {
        //    return value.toString();
        //}
        var M = _moduleFor(value);
        if (_isFunction(M.toString)) {
            return M.toString(value);
        }
    }
    var str = String(value);
    if (str === '[object Object]') {
        return Obj.toString(value);
    }

    return str;
};