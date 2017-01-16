var _curry = require('./_curry');
var _moduleFor = require('./_moduleFor');
var _isFunction = require('./_isFunction');

module.exports = _curry(function(left, right) {
    var Ml = _moduleFor(left);
    var Mr = _moduleFor(right);

    if(Ml !== Mr) {
        return false;
    }

    if (_isFunction(Ml.eq)) {
        return Ml.eq(left, right);
    }

    return left === right;
});
