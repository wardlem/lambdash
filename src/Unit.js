var _curry = require('./internal/_curry');
var Ordering = require('./Ordering');

Unit = require('./internal/_primitives').Unit;

Unit.eq = _curry(function(left, right) {
    // null and undefined are the same as far as I am concerned.
    return true;
});

Unit.compare = _curry(function(left, right) {
    return Ordering.EQ;
});

Unit.show = _curry(function(unit){
    return String(unit);
});

module.exports = Unit;