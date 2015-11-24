var _curry = require('./internal/_curry');
//var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');
var _equal = require('./internal/_equal');

var Eq = module.exports;

Eq.equal = _equal;

Eq.notEqual = _curry(function(left, right){
    return !_equal(left, right);
});

//Eq.valid = function(value) {
//    return value == undefined || _isFunction(value.equal) || _isFunction(_moduleFor(value).equal);
//};

