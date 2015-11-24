var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _compose = require('./internal/_compose');
var _not = require('./internal/_not');
var _moduleFor = require('./internal/_moduleFor');

var Eq = require('./Eq');
var Ordering = require('./Ordering');

var Ord = module.exports;

Ord.equal = Eq.equal;

function _defaultCompare(left, right) {
    return left < right ? Ordering.LT
        : right > left ? Ordering.GT
        : Ordering.EQ;
}

Ord.compare = _curry(function(left, right) {
    if (left == null || right == null) {
        throw new TypeError('Ord#compare can not operate on undefined or null values');
    }

    if (_isFunction(left.compare)) {
        return left.compare(right);
    }

    var M = _moduleFor(left);
    if (_isFunction(M.compare)) {
        return M.compare(left, right);
    }

    return _defaultCompare(left, right);
});

Ord.isGreaterThan = _compose(Ordering.isGreaterThan, Ord.compare);
Ord.isLessThan = _compose(Ordering.isLessThan, Ord.compare);
Ord.isGreaterThanOrEqual = _not(Ord.isLessThan);
Ord.isLessThanOrEqual = _not(Ord.isGreaterThan);
Ord.min = _curry(function(left, right) {
    return Ord.isLessThanOrEqual(left, right) ? left : right;
});
Ord.max = _curry(function(left, right) {
    return Ord.isGreaterThanOrEqual(left, right) ? left : right;
});
