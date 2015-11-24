var _arrEqual = require('./internal/_arrayEqual');
var _curry = require('./internal/_curry');

var Ord = require('./Ord');
var Ordering = require('./Ordering');

var Arr = require('./internal/_primitives').Arr;

// Implementation for Eq
Arr.equal = _arrEqual;

// Implementation for Ord
Arr.compare = _curry(function(left, right) {
    if (!Arr.valid(left) || !Arr.valid(right)) {
        throw new TypeError('Arr#compare can only operate on arrays');
    }
    if (left === right) {
        // short-circuit
        return Ordering.EQ;
    }

    var len = Math.min(left.length, right.length);

    var ind = 0;
    while(ind < len) {
        var ordering = Ord.compare(left[ind], right[ind]);
        if (!ordering.isEqual()) {
            return ordering;
        }

        ind += 1;
    }

    return left.length < right.length ? Ordering.LT
        : left.length > right.length ? Ordering.GT
        : Ordering.EQ;
});


// Implementation for Functor
Arr.map = _curry(function(fn, arr) {
    return arr.map(fn);
});

// Implementation for Foldable
Arr.fold = _curry(function(fn, init, arr) {
    return arr.reduce(fn, init);
});

Arr.foldRight = _curry(function(fn, init, arr) {
    return arr.reduceRight(fn, init);
});

Arr.concat = _curry(function(left, right){
    return left.concat(right);
});

// Implementation for Monad
Arr.of = function of(value) {
    return [value];
};

Arr.empty = function empty() {
    return [];
};

Arr.flatten = Arr.fold(Arr.concat, []);

module.exports = Arr;

