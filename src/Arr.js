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
        if (!Ordering.isEQ(ordering)) {
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
    var res = [];
    var ind = 0;
    while(ind < arr.length) {
        res.push(fn(arr[ind]));
        ind += 1;
    }
    return res;
});

// Implementation for Foldable
Arr.foldl = _curry(function(fn, init, arr) {
    return arr.reduce(fn, init);
});

Arr.foldr = _curry(function(fn, init, arr) {
    return arr.reduceRight(fn, init);
});

Arr.fold = Arr.foldl;

Arr.concat = _curry(function(left, right){
    return left.concat(right);
});

// Implementation for Applicative
Arr.ap = _curry(function(applicative, arr){
    var result = [];
    var ind = 0;
    while (ind < applicative.length) {
        result = result.concat(Arr.map(applicative[ind], arr));
        ind += 1;
    }

    return result;
});

// Implementation for Monad
Arr.of = function of(value) {
    return [value];
};

Arr.empty = function empty() {
    return [];
};

Arr.flatten = Arr.foldl(Arr.concat, []);

// Other array functions
Arr.applyTo = _curry(function(arr, fn) {
    fn.apply(this, arr);
});

module.exports = Arr;

