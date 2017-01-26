const _arrEqual = require('./internal/_arrayEqual');
const _curry = require('./internal/_curry');
const _show = require('./internal/_show');
const _equal = require('./internal/_equal');
const _not = require('./internal/_not');
const __ = require('./internal/_blank');

const Ord = require('./Ord');
const Ordering = require('./Ordering');
const Sequential = require('./Sequential');

/**
 * _Array is the module for javascript's built-in array type.
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
 * @implements Sequential
 * @implements SetOps
 * @implements SetKind
 * @implements Show
 */
const _Array = require('./internal/_primitives').Array;

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
_Array.eq = _curry(_arrEqual);

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
_Array.compare = _curry(function(left, right) {
    if (left === right) {
        // short-circuit
        return Ordering.EQ;
    }

    const len = Math.min(left.length, right.length);
    for (let ind = 0; ind < len; ind++) {
        const ordering = Ord.compare(left[ind], right[ind]);
        if (!Ordering.isEQ(ordering)) {
            return ordering;
        }
    }

    return Ordering.fromNum(left.length - right.length);
});


/**
 * Maps a function over the elements of an array.
 *
 * This function implements Functor for arrays.
 *
 * @sig (a -> b) -> Array a -> Array b
 * @since 0.4.0
 * @see Functor.fmap
 * @param {Function} fn the function mapping over the array
 * @param {Array} array the array being mapped over
 * @return {Array} The array with fn applied to each of its elements
 */
_Array.fmap = _curry(function(fn, array) {
    var res = [];
    var ind = 0;
    while(ind < array.length) {
        res.push(fn(array[ind]));
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
 * @param {Array} _array the array being accumulated
 * @return {*} The final accumulation of the fold
 */
_Array.foldl = _curry(function(fn, init, array) {
    return array.reduce(fn, init);
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
 * @param {Array} array the array being accumulated
 * @return {*} The final accumulation of the fold
 */
_Array.foldr = _curry(function(fn, init, array) {
    return array.reduceRight(fn, init);
});

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
_Array.concat = _curry(function(left, right){
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
_Array.empty = _curry(function empty() {
    return [];
});

/**
 * Applies the functions contained in one array to another array
 *
 * This function along with _Array.of implements Applicative for arrays.
 *
 * @sig Array (a -> b) -> Array a -> Array b
 * @since 0.4.0
 * @see Applicative.ap
 * @param {Function[]} applicative an array of functions
 * @param {*[]} array an array to which each function in applicative will be applied
 * @return {*[]}
 */
_Array.ap = _curry(function(applicative, array){
    var result = [];
    var ind = 0;
    while (ind < applicative.length) {
        result = result.concat(_Array.fmap(applicative[ind], array));
        ind += 1;
    }

    return result;
});

/**
 * Returns an array of the value supplied
 *
 * This function along with _Array.ap implements Applicative for arrays.
 *
 * @sig a -> Array a
 * @since 0.4.0
 * @see Applicative.of
 * @param value a value that will be wrapped in an array
 * @returns {*[]} An array with the provided value as its only element
 */
_Array.of = _curry(function of(value) {
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
 * @param {Array[]} array The array of arrays being flattened
 * @return {Array}
 */
_Array.flatten = _Array.foldl(_Array.concat, []);

/**
 * Applies an array of values to a function
 *
 * @sig (* -> *) -> Array *  -> *
 * @since 0.4.0
 * @param {Function} fn a function the array will be applied to
 * @param {Array} array an array that will be applied to the function
 * @return {*}
 * @example
 *
 *      _.applyTo((a,b) => a + b, [1,2]);  // 3
 *      _.applyTo((a,b) => a + b)([1,2]);  // 3
 */
_Array.applyTo = _curry(function(fn, array) {
    return fn.apply(this, array);
});

/**
 * Returns the nth index in the array.
 *
 * The index must be between 0 and 1 less than the length of the array.
 *
 * @sig Number -> Array a -> a
 * @since 0.5.0
 * @param {Number} n a valid index in the array
 * @param {Array} array an array
 * @return {*} The value in the array at the given index
 * @example
 *
 *      _.nth(2)([1,2,3,4]);          // 3
 *      _.nth(2, ["a","b","c","d"]);  // "c"
 */
_Array.nth = _curry(function(n, array) {
    if (n >= array.length || n < 0) {
        throw new RangeError('Index out of bounds');
    }

    return array[n];
});

/**
 * Returns the length of an array.
 *
 * @sig _Array a -> Number
 * @since 0.5.0
 * @param {Array} array
 * @return {Number}
 */
_Array.len = _curry(function(array) {
    return array.length;
});

/**
 * Returns a subsection of an array.
 *
 * @sig Number -> Number -> Array a -> Array a
 * @since 0.5.0
 * @param {Number} start The start index of the subsection
 * @param {Number} end The end index of the subsection
 * @param {Array} array The array being sliced
 * @return {Array}
 *
 */
_Array.slice = _curry(function(start, end, array) {
    return Array.prototype.slice.call(array, start, end);
});

/**
 * Reverses an array.
 *
 * Does not modify the original array.
 *
 * @sig Array a -> Array a
 * @since 0.5.0
 * @param {Array} array The array to reverse
 * @return {Array}
 *
 */
_Array.reverse = _curry(function(array) {
    return Array.prototype.reverse.call(Array.prototype.slice.call(array));
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
 *      var array = ["c","r","c","s"];
 *      var caracas = _.intersperse("a", array);
 *      // caracas is ["c", "a", "r", "a", "c", "a", "s"]
 */
_Array.intersperse = _curry(function(value, array) {
    if (!array.length) {
        return [];
    }

    var res = [array[0]];
    var ind = 1;
    while (ind < array.length) {
        res.push(value);
        res.push(array[ind]);
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
_Array.exists = _curry(function(key, array){
    var ind = 0;
    while(ind < array.length) {
        if (_equal(key, array[ind])){
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
_Array.insert = _curry(function(key, array){
    if (_Array.exists(key, array)){
        return array;
    }

    return _Array.concat(array, [key]);

});

/**
 * Removes all instances of a value from an array.
 *
 * This function is part of array's set implementation.
 *
 * @sig a -> Array a -> Array a
 * @since 0.6.0
 */
_Array.remove = _curry(function(key, array){
    var ind = 0;
    while(ind < array.length) {
        if (_equal(key, array[ind])){
            array = _Array.concat(_Array.slice(0, ind, array), _Array.slice(ind+1, array.length, array));
        } else {
            ind += 1;
        }
    }

    return array;
});

/**
 * Returns a unique array of all values in left or right.
 *
 * @sig Array a -> Array a -> Array a
 * @since 0.6.0
 */
_Array.union = _curry(function(left, right){
    return Sequential.unique(_Array.concat(left,right));
});

/**
 * Returns all values contained in left that are not in right.
 *
 * @sig Array a -> Array a -> Array a
 * @since 0.6.0
 */
_Array.difference = _curry(function(left, right){
    return Sequential.filter(_not(_Array.exists(__, right)), Sequential.unique(left));
});

/**
 * Returns all values contained in left and in right.
 *
 * @sig Array a -> Array a -> Array a
 * @since 0.6.0
 */
_Array.intersection = _curry(function(left, right){
    return Sequential.filter(_Array.exists(__, right), Sequential.unique(left));
});

/**
 * Returns all values contained in left or right, but not both.
 *
 * @sig Array a -> Array a -> Array a
 * @since 0.6.0
 */
_Array.symmetricDifference = _curry(function(left, right){
    return _Array.concat(_Array.difference(left,right), _Array.difference(right,left));
});

/**
 * Returns a string representation of an array.
 *
 * This function implements Show for arrays.
 *
 * @sig Array a -> String
 * @since 0.5.0
 */
_Array.show = _curry(function(array) {
    var items = _Array.fmap(_show, array);
    return "[" + items.join(',') + "]";
});

/**
 * Converts an array like value into an array
 *
 * An array like value is one with a length property and sequential
 * numeric indices.
 *
 * @sig * -> Array
 * @since 0.6.3
 */
_Array.fromArrayLike = _curry(function(arrLike){
    return Array.prototype.slice.call(arrLike);
});

module.exports = _Array;
