var _curry = require('./_curry');
var _moduleFor = require('./_moduleFor');
var _isFunction = require('./_isFunction');

module.exports = _curry(function(left, right) {
    if (left == null || right == null) {
        return left === right;
    }

    if (_isFunction(left.equal)) {
        return left.equal(right);
    }

    var M = _moduleFor(left);
    if (_isFunction(M.equal)) {
        return M.equal(left, right);
    }

    return left === right;
});