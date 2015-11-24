var _curry = require('./_curry');

module.exports = _curry(function(test, value) {
    return test === value;
});