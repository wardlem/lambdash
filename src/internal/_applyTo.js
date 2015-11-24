var _curry = require('./_curry');

module.exports = _curry(function(fn, arr){
    return fn.apply(this, arr);
});