var _curryN = require('./internal/_curryN');
var _always = require('./internal/_always');

var Any = module.exports;

Any.member = _curryN(1, _always(true));
