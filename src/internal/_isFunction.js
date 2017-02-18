module.exports = function _isFunction(...values) {
    for (let i = 0; i < values.length; i += 1) {
        if (typeof values[i] !== 'function') {
            return false;
        }
    }

    return true;
};
