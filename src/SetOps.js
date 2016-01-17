var _curryN = require('./internal/_curryN');
var _useModuleMethod = ('./internal/_useModuleMethod');
var _moduleFor = require('./internal/_moduleFor');
var _isFunction = require('./internal/_isFunction');


var SetOps = module.exports;

SetOps.union = _curryN(2, _useModuleMethod('union'));
SetOps.difference = _curryN(2, _useModuleMethod('difference'));
SetOps.intersection = _curryN(2, _useModuleMethod('intersection'));
SetOps.symmetricDifference = _curryN(2, _useModuleMethod('symmetricDifference'));


SetOps.member = function(value) {
    var M = _moduleFor(value);
    return
        _isFunction(M.union) && _isFunction(M.difference) &&
        _isFunction(M.interesection) && _isFunction(M.symmetricDifference);

}