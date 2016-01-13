var _curry = require('./internal/_curry');
var _curryN = require('./internal/_curryN');
var _always = require('./internal/_always');
var Ordering = require('./Ordering');

Unit = require('./internal/_primitives').Unit;

Unit.eq = _curryN(2, _always(true));

Unit.compare = _curryN(2, _always(Ordering.EQ));

Unit.empty = _always(null);
Unit.concat = _curryN(2, _always(null));
Unit.map = _curryN(2, _always(null));

Unit.show = _curry(function(unit){
    return String(unit);
});

module.exports = Unit;