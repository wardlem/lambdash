var _is = require('./internal/_is');
var _curry = require('./internal/_curry');
var _identity = require('./internal/_identity');

var Ordering = require('./Ordering');

var Str = require('./internal/_primitives').Str;

// Implementation for Eq
Str.eq = _is;

// Implementation for Ord
Str.compare = _curry(function(left, right) {
    return left < right ? Ordering.LT
        : left > right ? Ordering.GT
        : Ordering.EQ
});

// Implementation for Enum
Str.toInt = function(value) {
    if (value.length === 0) {
        throw new TypeError('Can not convert empty string to integer');
    }

    return value.charCodeAt(0);
};

Str.fromInt = String.fromCharCode;

// Implementation for Functor
Str.map = _curry(function(fn, str) {
    return str.split('').map(fn).join('');
});

// Implementation for Semigroup
Str.concat = _curry(function(left, right) {
    return String(left) + String(right);
});

// Implementation for Monoid
Str.empty = function() {
    return '';
};

// Implementation for Foldable
Str.fold = Str.foldl = _curry(function(fn, init, string) {
    return string.split('').reduce(fn, init);
});

Str.foldr = _curry(function(fn, init, string) {
    return string.split('').reduceRight(fn, init);
});

// Implementation for Sequential
Str.length = _curry(function(str){
    return str.length;
});

Str.nth = _curry(function(ind, str) {
    if (ind < 0) {
        ind = str.length + ind;
    }

    if (ind < 0 || ind >= str.length) {
        throw new RangeError('String index out of bounds');
    }

    return str[ind];
});

Str.append = _curry(function(app, str) {
    return str + app;
});

Str.prepend = _curry(function(prep, str) {
    return prep + str;
});

// String functions
Str.split = _curry(function(delim, string) {
    return string.split(delim);
});

Str.join = _curry(function(delim, arr) {
    return arr.join(delim);
});

Str.show = _curry(function(str){
    return '"' + str + '"';
});

Str.lines = Str.split('\n');
Str.words = Str.split(/\s/);
Str.unlines = Str.join('\n');
Str.unwords = Str.join(' ');

module.exports = Str;