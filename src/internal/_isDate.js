module.exports = function(value) {
    return typeof value === 'object' && value.constructor === Date;
};