module.exports = function(value) {
    return value != null && (value.constructor === Object || value.constructor === null);
};
