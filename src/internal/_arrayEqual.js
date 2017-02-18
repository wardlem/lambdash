var _equal = require('./_equal');

module.exports = function _arrayEqual(left, right) {
    if (left.length !== right.length) {
        return false;
    }

    var ind = 0;
    var len = left.length;
    while (ind < len) {
        if (!_equal(left[ind], right[ind])) {
            return false;
        }
        ind += 1;
    }

    return true;
};
