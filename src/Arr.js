var _arrEqual = require('./internal/_arrayEqual');
var _curry = require('./internal/_curry');
var _show = require('./internal/_show');
var _equal = require('./internal/_equal');
var _not = require('./internal/_not');
var __ = require('./internal/_blank');

var Ord = require('./Ord');
var Ordering = require('./Ordering');
var Sequential = require('./Sequential');

/**
 * Arr is the module for javascript's built-in array type.
 *
 * @module
 * @implements Eq
 * @implements Ord
 * @implements Functor
 * @implements Foldable
 * @implements Semigroup
 * @implements Monoid
 * @implements Applicative
 * @implements Monad
 * @implements Show
 */
var Arr = require('./internal/_primitives').Arr;

/**
 * Returns true if two arrays are structurally equal.
 *
 * This function implements Eq for arrays so long as all of the contained values of both arrays implement Eq.
 *
 * @sig Eq e => Array e -> Array e -> Boolean
 * @since 0.5.0
 * @see Eq.eq
 * @param {Array} first one of the arrays being compared for equality
 * @param {Array} second the other array being compared for equality
 * @return {Boolean} Whether or not the two arrays are structurally equal
 */
Arr.eq = _curry(_arrEqual);

/**
 * Returns a comparison of two arrays.
 *
 * This function implements Ord for arrays so long as all the members of both arrays implement Ord.
 *
 * Comparison is done on the arrays elements from left to right, until a non-equal result is found, which is returned.
 * If one array is a prefix of another, the result is _.LT if the the length of the first is less than the second,
 * _.GT if the length of the first is greater than the second or _.EQ if they are the same length.
 *
 * @sig Ord o => Array o -> Array o -> Ordering
 * @since 0.4.0
 * @see Ord.compare
 * @param {Array} first the first array being compared
 * @param {Array} second the second array being compared
 * @return {Ordering} The result of the comparison
 */
Arr.compare = _curry(function(left, right) {
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


/**
 * Maps a function over the elements of an array.
 *
 * This function implements Functor for arrays.
 *
 * @sig (a -> b) -> Array a -> Array b
 * @since 0.4.0
 * @see Functor.map
 * @param {Function} fn the function mapping over the array
 * @param {Array} arr the array being mapped over
 * @return {Array} The array with fn applied to each of its elements
 */
Arr.map = _curry(function(fn, arr) {
    var res = [];
    var ind = 0;
    while(ind < arr.length) {
        res.push(fn(arr[ind]));
        ind += 1;
    }
    return res;
});

/**
 * Folds an array from the left.
 *
 * This function is part of the implementation for Foldable for arrays.
 *
 * @sig (b -> a -> b) -> b -> Array a -> b
 * @since 0.5.0
 * @see Foldable.foldl
 * @param {Function} fn the function that calculates the accumulated value
 * @param {*} init the initial value of the accumulation
 * @param {Array} arr the array being accumulated
 * @return {*} The final accumulation of the fold
 */
Arr.foldl = _curry(function(fn, init, arr) {
    return arr.reduce(fn, init);
});

/**
 * Folds an array from the right.
 *
 * This function is part of the implementation for Foldable for arrays.
 *
 * @sig (b -> a -> b) -> b -> Array a -> b
 * @since 0.5.0
 * @see Foldable.foldr
 * @param {Function} fn the function that calculates the accumulated value
 * @param {*} init the initial value of the accumulation
 * @param {Array} arr the array being accumulated
 * @return {*} The final accumulation of the fold
 */
Arr.foldr = _curry(function(fn, init, arr) {
    return arr.reduceRight(fn, init);
});

/**
 * Folds an array from the left.
 *
 * This function is part of the implementation for Foldable for arrays.
 *
 * @sig (b -> a -> b) -> b -> Array a -> b
 * @since 0.5.0
 * @see Foldable.fold
 * @param {Function} fn the function that calculates the accumulated value
 * @param {*} init the initial value of the accumulation
 * @param {Array} arr the array being accumulated
 * @return {*} The final accumulation of the fold
 */
Arr.fold = Arr.foldl;

/**
 * Concatenates two arrays into one with.
 *
 * This function implements Semigroup for arrays.
 *
 * @sig Array a -> Array a -> Array a
 * @since 0.4.0
 * @see Semigroup.concat
 * @param {Array} left the prefix of the concatenation
 * @param {Array} right the suffix of the concatenation
 * @returns {Array} left and right concatenated together
 */
Arr.concat = _curry(function(left, right){
    return left.concat(right);
});

/**
 * Returns the empty, unit value of an array.
 *
 * This function implements Monoid for arrays.
 *
 * @sig () -> Array
 * @since 0.4.0
 * @see Monoid.empty
 * @returns {Array} An empty array.
 */
Arr.empty = _curry(function empty() {
    return [];
});

/**
 * Applies the functions contained in one array to another array
 *
 * This function along with Arr.of implements Applicative for arrays.
 *
 * @sig Array (a -> b) -> Array a -> Array b
 * @since 0.4.0
 * @see Applicative.ap
 * @param {Function[]} applicative an array of functions
 * @param {*[]} arr an array to which each function in applicative will be applied
 * @return {*[]}
 */
Arr.ap = _curry(function(applicative, arr){
    var result = [];
    var ind = 0;
    while (ind < applicative.length) {
        result = result.concat(Arr.map(applicative[ind], arr));
        ind += 1;
    }

    return result;
});

/**
 * Returns an array of the value supplied
 *
 * This function along with Arr.ap implements Applicative for arrays.
 *
 * @sig a -> Array a
 * @since 0.4.0
 * @see Applicative.of
 * @param value a value that will be wrapped in an array
 * @returns {*[]} An array with the provided value as its only element
 */
Arr.of = _curry(function of(value) {
    return [value];
});


/**
 * Flattens an array of arrays.
 *
 * This function implements Monad for array
 *
 * @sig Array (Array a) -> Array a
 * @since 0.4.0
 * @see Monad.flatten
 * @param {Array[]} arr The array of arrays being flattened
 * @return {Array}
 */
Arr.flatten = Arr.foldl(Arr.concat, []);

/**
 * Applies an array of values to a function
 *
 * @sig (* -> *) -> Array *  -> *
 * @since 0.4.0
 * @param {Function} fn a function the array will be applied to
 * @param {Array} arr an array that will be applied to the function
 * @return {*}
 * @example
 *
 *      _.applyTo((a,b) => a + b, [1,2]);  // 3
 *      _.applyTo((a,b) => a + b)([1,2]);  // 3
 */
Arr.applyTo = _curry(function(fn, arr) {
    return fn.apply(this, arr);
});

/**
 * Returns the nth index in the array.
 *
 * The index must be between 0 and 1 less than the length of the array.
 *
 * @sig Number -> Array a -> a
 * @since 0.5.0
 * @param {Number} n a valid index in the array
 * @param {Array} arr an array
 * @return {*} The value in the array at the given index
 * @example
 *
 *      _.nth(2)([1,2,3,4]);          // 3
 *      _.nth(2, ["a","b","c","d"]);  // "c"
 */
Arr.nth = _curry(function(n, arr) {
    if (n >= arr.length || n < 0) {
        throw new RangeError('Index out of bounds');
    }

    return arr[n];
});

/**
 * Returns the length of an array.
 *
 * @sig Arr a -> Number
 * @since 0.5.0
 * @param {Array} arr
 * @return {Number}
 */
Arr.len = _curry(function(arr) {
    return arr.length;
});

/**
 * Returns a subsection of an array.
 *
 * @sig Number -> Number -> Array a -> Array a
 * @since 0.5.0
 * @param {Number} start The start index of the subsection
 * @param {Number} end The end index of the subsection
 * @param {Array} arr The array being sliced
 * @return {Array}
 *
 */
Arr.slice = _curry(function(start, end, arr) {
    return Array.prototype.slice.call(arr, start, end);
});

/**
 * Reverses an array.
 *
 * Does not modify the original array.
 *
 * @sig Array a -> Array a
 * @since 0.5.0
 * @param {Array} arr The array to reverse
 * @return {Array}
 *
 */
Arr.reverse = _curry(function(arr) {
    return Array.prototype.reverse.call(Array.prototype.slice.call(arr));
});

/**
 * Puts an element between every element in an array.
 *
 * @sig a -> Array a -> Array a
 * @since 0.5.0
 * @param {*} value
 * @param {Array} array
 * @return {Array}
 *
 * @example
 *
 *      var arr = ["c","r","c","s"];
 *      var caracas = _.intersperse("a", arr);
 *      // caracas is ["c", "a", "r", "a", "c", "a", "s"]
 */
Arr.intersperse = _curry(function(value, arr) {
    if (!arr.length) {
        return [];
    }

    var res = [arr[0]];
    var ind = 1;
    while (ind < arr.length) {
        res.push(value);
        res.push(arr[ind]);
        ind += 1;
    }

    return res;
});

/**
 * Returns true if at least one value in an array is equal to a value.
 *
 * This function is part of array's set implementation.
 *
 * @sig a -> Array a -> Boolean
 * @since 0.6.0
 */
Arr.exists = _curry(function(key, arr){
    var ind = 0;
    while(ind < arr.length) {
        if (_equal(key, arr[ind])){
            return true;
        }

        ind += 1;
    }

    return false;
});

/**
 * Adds a value to an array if it doesn't already exist.
 *
 * This function is part of array's set implementation.
 *
 * @sig a -> Array a -> Array a
 * @since 0.6.0
 */
Arr.insert = _curry(function(key, arr){
    if (Arr.exists(key, arr)){
        return arr;
    }

    return Arr.concat(arr, [key]);

});

/**
 * Removes all instances of a value from an array.
 *
 * This function is part of array's set implementation.
 *
 * @sig a -> Array a -> Array a
 * @since 0.6.0
 */
Arr.remove = _curry(function(key, arr){
    var ind = 0;
    while(ind < arr.length) {
        if (_equal(key, arr[ind])){
            arr = Arr.concat(Arr.slice(0, ind, arr), Arr.slice(ind+1, arr.length, arr));
        } else {
            ind += 1;
        }

    }

    return arr;
});

/**
 * Returns a unique array of all values in left or right.
 *
 * @sig Array a -> Array a -> Array a
 * @since 0.6.0
 */
Arr.union = _curry(function(left, right){
    return Sequential.unique(Arr.concat(left,right));
});

/**
 * Returns all values contained in left that are not in right.
 *
 * @sig Array a -> Array a -> Array a
 * @since 0.6.0
 */
Arr.difference = _curry(function(left, right){
    return Sequential.filter(_not(Arr.exists(__, right)), Sequential.unique(left));
});

/**
 * Returns all values contained in left and in right.
 *
 * @sig Array a -> Array a -> Array a
 * @since 0.6.0
 */
Arr.intersection = _curry(function(left, right){
    return Sequential.filter(Arr.exists(__, right), Sequential.unique(left));
});

/**
 * Returns all values contained in left or right, but not both.
 *
 * @sig Array a -> Array a -> Array a
 * @since 0.6.0
 */
Arr.symmetricDifference = _curry(function(left, right){
    return Arr.concat(Arr.difference(left,right), Arr.difference(right,left));
});

/**
 * Returns a string representation of an array.
 *
 * This function implements Show for arrays.
 *
 * @sig Array a -> String
 * @since 0.5.0
 */
Arr.show = _curry(function(arr) {
    var items = Arr.map(_show, arr);
    return "[" + items.join(',') + "]";
});

module.exports = Arr;

