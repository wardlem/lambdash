const _curry = require('./internal/_curry');
const _curryN = require('./internal/_curryN');
const _always = require('./internal/_always');
const Ordering = require('./Ordering');
const _Uint8Array = require('./internal/_primitives')._Uint8Array;

const Unit = require('./internal/_primitives').Unit;

Unit.eq = _curryN(2, _always(true));

Unit.compare = _curryN(2, _always(Ordering.EQ));

Unit.empty = _always(null);
Unit.concat = _curryN(2, _always(null));
Unit.fmap = _curryN(2, _always(null));

Unit.show = _curry(function(unit) {
    return String(unit);
});

Unit.hashWithSeed = _curry(function(seed, unit) {
    return _Uint8Array.hashWithSeed(seed, _Uint8Array.empty());
});

Unit.hash = _curry(function(unit) {
    return _Uint8Array.hash(_Uint8Array.empty());
});

module.exports = Unit;
