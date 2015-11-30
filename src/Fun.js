var _arity = require('./internal/_arity');
var _compose = require('./internal/_compose');
var _pipe = require('./internal/_pipe');
var _curry = require('./internal/_curry');
var _curryN = require('./internal/_curryN');
var _always = require('./internal/_always');
var _alwaysThrow = require('./internal/_alwaysThrow');
var _thunk = require('./internal/_thunk');
var _identity = require('./internal/_identity.js');
var _makeFunction = require('./internal/_makeFunction');
var _thisify = require('./internal/_thisify');

var Fun = require('./internal/_primitives').Fun;

Fun.compose = _compose;
Fun.pipe = _pipe;
Fun.always = _always;
Fun.alwaysThrow = _alwaysThrow;
Fun.thunk = _thunk;
Fun.identity = _identity;
Fun.curry = _curry;
Fun.curryN = _curryN;
Fun.arity = _arity;
Fun.make = _makeFunction;
Fun.thisify = _thisify;

require('./internal/_module')(Fun);

module.exports = Fun;