module.exports = function _slice(value, start, end) {
    return Array.prototype.slice.call(value, start == null ? 0 : start, end == null ? value.length : end);
};
