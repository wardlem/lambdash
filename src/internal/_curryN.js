var _arity = require('./_arity');

function __curryN(n, applied, fn) {
    return _arity(n, function() {

        var combined = [];

        var appInd = 0;
        var argsInd = 0;
        var totalApplied = 0;

        while(appInd < applied.length || argsInd < arguments.length) {

            if (appInd >= applied.length ||
                (applied[appInd] != null && applied[appInd]['@@functional/blank'] === true && argsInd < arguments.length)
            ) {
                combined.push(arguments[argsInd]);
                if (arguments[argsInd] == null || arguments[argsInd]['@@functional/blank'] !== true) {
                    totalApplied += 1;
                }
                argsInd += 1;
                appInd += 1;
            } else {
                combined.push(applied[appInd]);
                appInd += 1;
            }
        }

        //console.log('n ', n);
        //console.log('arguments ', arguments);
        //console.log('applied ', applied);
        //console.log('combined ', combined);
        //console.log('totalApplied ', totalApplied);
        //console.log('');

        return totalApplied >= n ? fn.apply(this, combined) : __curryN(n - totalApplied, combined, fn);

    });
}

module.exports = function curryN(n, fn) {
    return __curryN(n, [], fn);
};