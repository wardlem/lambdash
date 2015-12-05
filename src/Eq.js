var _curry = require('./internal/_curry');
var _moduleFor = require('./internal/_moduleFor');
var _equal = require('./internal/_equal');

var Eq = module.exports;

Eq.equal = _equal;

Eq.notEqual = _curry(function(left, right){
    return !_equal(left, right);
});

