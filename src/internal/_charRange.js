var _incChar = require('./_incChar');
var _first = require('./_first');

module.exports = function _charRange(from, count) {
    var range = [];
    from = _first(from);
    while (count > 0) {
        range.push(from);
        from = _incChar(from);
        count -= 1;
    }

    return range;
};
