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
var _slice = require('./internal/_slice');

var ap = require('./Applicative').ap;
var map = require('./Functor').map;
var foldl = require('./Foldable').foldl;

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

Fun.liftN = _curry(function(n, fn) {
    // Thank you Ramda: https://github.com/ramda/ramda/blob/master/src/liftN.js
    var lifted = _curryN(n, fn);
    return _curryN(n, function() {
        return foldl(ap, map(lifted, arguments[0]), _slice(arguments, 1));
    });
});

Fun.lift = function(fn) {
    return Fun.liftN(fn.length, fn);
};

require('./internal/_module')(Fun);

module.exports = Fun;