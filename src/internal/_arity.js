const {curried, source} = require('./_symbols');
const setFunctionLength = require('../util/setFunctionLength');
const nameFunction = require('../util/nameFunction');

module.exports = function _arity(n, fn) {
    function arity() {
        fn.apply(this, arguments);
    }

    setFunctionLength(n, arity);
    nameFunction(fn.name, arity);
    arity[curried] = fn[curried];
    arity[source] = fn[source] || fn;

    return arity;
};
