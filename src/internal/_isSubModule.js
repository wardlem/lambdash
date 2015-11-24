var _isDefined = require('./_isDefined');

module.exports = function(mod) {
    return mod != null && _isDefined(mod['@@functional/parentModule']);
};