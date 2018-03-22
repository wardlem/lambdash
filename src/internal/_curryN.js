const {blank, curried, source} = require('./_symbols');
const setFunctionLength = require('../util/setFunctionLength');
const nameFunction = require('../util/nameFunction');

function __curryN(n, applied, fn) {
    const curriedFn = function _curried() {

        const combined = [];

        let appInd = 0;
        let argsInd = 0;
        let totalApplied = 0;

        while (appInd < applied.length || argsInd < arguments.length) {

            if (appInd >= applied.length ||
                (applied[appInd] != null && applied[appInd][blank] === true && argsInd < arguments.length)
            ) {
                combined.push(arguments[argsInd]);
                if (arguments[argsInd] == null || arguments[argsInd][blank] !== true) {
                    totalApplied += 1;
                }
                argsInd += 1;
                appInd += 1;
            } else {
                combined.push(applied[appInd]);
                appInd += 1;
            }
        }

        return totalApplied >= n ? fn.apply(this, combined) : __curryN(n - totalApplied, combined, fn);
    };

    setFunctionLength(n, curriedFn);
    nameFunction(fn.name, curriedFn);
    curriedFn[curried] = true;
    curriedFn[source] = fn[source] || fn;
    return curriedFn;
}

module.exports = function curryN(n, fn) {
    return __curryN(n, [], fn);
};
