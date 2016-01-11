module.exports = function(value) {
    return value != null && value.constructor === Date;
};