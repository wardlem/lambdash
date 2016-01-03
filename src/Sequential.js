var _moduleFor = require('./internal/_moduleFor');
var _isFunction = require('./internal/_isFunction');
var _curry = require('./internal/_curry');
var _equal = require('./internal/_equal');
var _not = require('./internal/_not');
var _compose = require('./internal/_compose');
var _identity = require('./internal/_identity');

var Foldable = require('./Foldable');
var Monoid = require('./Monoid');

var Sequential = module.exports;

/**
 * Returns the length of a sequence
 *
 * This function should be implemented, though a default using the Foldable's length function exists.
 *
 * @sig Sequential s => s -> Number
 * @since 0.5.0
 * @param {Sequential} sequence the structure whose elements are being counted
 * @return {Number}
 */
Sequential.length = _curry(function(sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.length)) {
        return M.length(sequence);
    }

    return Foldable.length(sequence);
});

/**
 * Returns the element at the given index.
 *
 * If the index is negative, it returns the value at the length minus the given index.
 *
 * The index should be an integer.
 *
 * @sig Sequence s => Number -> s a -> a
 * @since 0.5.0
 * @param {Number} ind
 * @param {Sequential} sequence
 * @return {*}
 */
Sequential.nth = _curry(function(ind, sequence) {
    if (ind < 0) {
        ind = Sequential.length(sequence) + ind;
        if (ind < 0) {
            throw new RangeError('Index out of bounds');
        }
    }
    var M = _moduleFor(sequence);
    return M.nth(ind, sequence);
});

/**
 * Creates a new sequence with a value added at the end.
 *
 * The default behavior may be overwritten by the implementation.
 *
 * @sig Sequential s => a -> s a -> s a
 * @since 0.5.0
 * @param {*} value the element that will be added at the end of the sequence
 * @param {Sequential} sequence
 * @return {Sequential} a new sequence equal to the given sequence with the value added at the end
 */
Sequential.append = _curry(function(value, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.append)) {
        return M.append(value, sequence);
    }

    return M.concat(sequence, M.of(value));
});

/**
 * Creates a new sequence with a value added at the beginning.
 *
 * The default behavior may be overwritten by the implementation.
 *
 * @sig Sequential s => a -> s a -> s a
 * @since 0.5.0
 * @param {*} value the element that will be added at the beginning of the sequence
 * @param {Sequential} sequence
 * @return {Sequential} a new sequence equal to the given sequence with the value added at the beginning
 */
Sequential.prepend = _curry(function(value, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.prepend)) {
        return M.prepend(value, sequence);
    }

    return M.concat(M.of(value), sequence);
});

/**
 * Returns a subsequence of a sequence.
 *
 * The default behavior may be overwritten by an implementation specific to the type.
 *
 * Start and end should be integers.
 *
 * @sig Sequential s => Number -> Number -> s a -> s a
 * @since 0.5.0
 * @param {Number} start the index where the subsequence will start
 * @param {Number} end the index where the subsequence will end (non-inclusive)
 * @param {Sequential} sequence the structure the subsequence will be extracted from
 * @return {Sequential} A subsequence of the sequence
 */
Sequential.slice = _curry(function(start, end, sequence){
    var M = _moduleFor(sequence);
    if (_isFunction(M.slice)) {
        return M.slice(start, end, sequence);
    }

    var res = M.empty();
    start = Math.max(0, start);
    end = Math.min(end, Sequential.length(sequence));


    while (start < end) {
        res = Sequential.append(M.nth(start, sequence), res);
        start += 1;
    }

    return res;
});

/**
 * Takes the first n values from a sequence.
 *
 * If there are fewer than n values in the sequence, a copy of the sequence will be returned.
 *
 * This function is the same as sequential.slice with 0 as the first parameter
 *
 * @sig Sequential s => Number -> s a -> s a
 * @since 0.5.0
 * @param {Number} n the number of items to take
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.take = Sequential.slice(0);

/**
 * Removes the first n values from a sequence.
 *
 * If there are fewer than n values in the sequence, an empty sequence will be returned.
 *
 * This function is the same as sequential.slice with n as the first parameter and
 * the length of the sequence as the second parameter.
 *
 * @sig Sequential s => Number -> s a -> s a
 * @since 0.5.0
 * @param {Number} n the number of items to remove
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.drop = _curry(function(n, sequence) {
    return Sequential.slice(n, Sequential.length(sequence), sequence);
});

/**
 * Takes the last n values from a sequence.
 *
 * If there are fewer than n values in the sequence, a copy of the sequence will be returned.
 *
 * @sig Sequential s => Number -> s a -> s a
 * @since 0.5.0
 * @param {Number} n the number of items to keep
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.takeLast = _curry(function(n, sequence) {
    return Sequential.drop(Sequential.length(sequence) - n, sequence);
});

/**
 * Removes the last n values from a sequence.
 *
 * If there are fewer than n values in the sequence, an empty sequence will be returned.
 *
 * @sig Sequential s => Number -> s a -> s a
 * @since 0.5.0
 * @param {Number} n the number of items to remove
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.dropLast = _curry(function(n, sequence) {
    return Sequential.take(Sequential.length(sequence) - n, sequence);
});

/**
 * Returns the first item in a non-empty sequence
 *
 * @sig Sequential s => s a -> a
 * @since 0.5.0
 * @param {Sequential} sequence
 * @return {*}
 */
Sequential.head = Sequential.nth(0);

/**
 * Returns the final item in a non-empty sequence
 *
 * @sig Sequential s => s a -> a
 * @since 0.5.0
 * @param {Sequential} sequence
 * @return {*}
 */
Sequential.last = Sequential.nth(-1);

/**
 * Returns a sequence without its first element
 *
 * @sig Sequential s => s a -> s a
 * @since 0.5.0
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.tail = Sequential.drop(1);

/**
 * Returns a sequence without its final element
 *
 * @sig Sequential s => s a -> s a
 * @since 0.5.0
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.init = Sequential.dropLast(1);

/**
 * Returns a sequence with a value added between all of an existing sequences values.
 *
 * @sig Sequential s => a -> s a -> s a
 * @since 0.5.0
 * @param {*} value the element that will be added to the sequence
 * @param {Sequential} sequence
 * @return {Sequential}
 * @example
 *
 *      var sequence = "tks";
 *      _.intersperse('i', sequence);  // "tikis"
 *
 */
Sequential.intersperse = _curry(function(value, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.intersperse)) {
        return M.intersperse(value, sequence);
    }

    var l = Sequential.length(sequence);

    if (l < 2) {
        return sequence;
    }

    function _intersperse(len, sequence) {
        if (len === 0) {
            return M.empty();
        }
        var head = Sequential.head(sequence);
        var tail = _intersperse(len - 1, Sequential.tail(sequence));
        return Sequential.prepend(value, Sequential.prepend(head, tail));
    }

    var head = Sequential.head(sequence);
    var tail = _intersperse(l - 1, Sequential.tail(sequence));
    return Sequential.prepend(head, tail);
});

/**
 * Creates a sequence from another with the order reversed
 *
 * @sig Sequential s => s a -> s a
 * @since 0.5.0
 * @param {Sequential} sequence the structure being reversed
 * @return {Sequential}
 */
Sequential.reverse = _curry(function(sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.reverse)) {
        return M.reverse(sequence);
    }

    function _reverse(l, sequence) {
        if (l === 0) {
            return sequence;
        }

        var head = Sequential.head(sequence);
        var tail = Sequential.tail(sequence);

        return Sequential.append(head, _reverse(l-1, tail));
    }

    return _reverse(Sequential.length(sequence), sequence);
});

/**
 * Splits a sequence into two.
 *
 * The result is returned as an array where the first element is the sequence
 * starting at index 0 and containing n items, and the second element is the sequence
 * beginning at index n.
 *
 * @sig Sequential s => Number -> s a -> Array (s a)
 * @since 0.5.0
 * @param {Number} n an integer index where the sequence will be split
 * @param {Sequential} sequence the structure being split
 * @return {Array}
 */
Sequential.splitAt = _curry(function(n, sequence) {
    return [Sequential.take(n, sequence), Sequential.drop(n, sequence)];
});

/**
 * Takes elements from the start of a sequence as long as a predicate returns true.
 *
 * @sig Sequential s => (a -> Boolean) -> s a -> s a
 * @since 0.5.0
 * @param {Function} fn
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.takeWhile = _curry(function(fn, sequence) {
    var idx = 0;
    var l = Sequential.length(sequence);
    while (idx < l && fn(Sequential.nth(idx, sequence))) {
        idx += 1;
    }

    return Sequential.take(idx, sequence);
});

/**
 * Drops elements from the start of a sequence as long as a predicate returns true.
 *
 * @sig Sequential s => (a -> Boolean) -> s a -> s a
 * @since 0.5.0
 * @param {Function} fn
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.dropWhile = _curry(function(fn, sequence) {
    var idx = 0;
    var l = Sequential.length(sequence);
    while (idx < l && fn(Sequential.nth(idx, sequence))) {
        idx += 1;
    }

    return Sequential.drop(idx, sequence);
});

/**
 * Takes elements from the end of a sequence as long as a predicate returns true.
 *
 * @sig Sequential s => (a -> Boolean) -> s a -> s a
 * @since 0.5.0
 * @param {Function} fn
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.takeLastWhile = _curry(function(fn, sequence) {
    var idx = Sequential.length(sequence) - 1;
    while(idx >= 0 && fn(Sequential.nth(idx, sequence))) {
        idx -= 1;
    }

    return Sequential.drop(idx+1, sequence);
});

/**
 * Drops elements from the end of a sequence as long as a predicate returns true.
 *
 * @sig Sequential s => (a -> Boolean) -> s a -> s a
 * @since 0.5.0
 * @param {Function} fn
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.dropLastWhile = _curry(function(fn, sequence) {
    var idx = Sequential.length(sequence) - 1;
    while(idx >= 0 && fn(Sequential.nth(idx, sequence))) {
        idx -= 1;
    }

    return Sequential.take(idx+1, sequence);
});

/**
 * Creates a sequence from another with only the items a predicate returns true for.
 *
 * @sig Sequential s => (a -> Boolean) -> s a -> s a
 * @since 0.5.0
 * @param {Function} fn
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.filter = _curry(function(fn, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.filter)) {
        return M.filter(fn, sequence);
    }

    var res = M.empty();
    var idx = 0;
    var len = Sequential.length(sequence);

    while (idx < len) {
        var v = M.nth(idx, sequence);
        if (fn(v)) {
            res = Sequential.append(v, res);
        }
        idx += 1;
    }

    return res;
});

/**
 * Returns a sequence with all duplicate elements removed according to a predicate function.
 *
 * @since 0.5.0
 * @sig Sequential s => (a -> b) -> s a -> s a
 * @param {Function} fn a predicate function that determines uniqueness
 * @param {Sequential} sequence
 * @return {Sequential} The sequence with all duplicate elements removed according to the predicate
 */
Sequential.uniqueBy = _curry(function(fn, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.uniqueBy)) {
        return M.uniqueBy(fn, sequence);
    }

    if (Sequential.length(sequence) === 0) {
        return M.empty();
    }

    var head = Sequential.head(sequence);
    var pred = _compose(_not(_equal(fn(head))), fn);
    var rest = Sequential.filter(pred, sequence);
    return Sequential.prepend(head, Sequential.uniqueBy(fn, rest));

});

/**
 * Returns a sequence with all duplicate elements removed.
 *
 * @since 0.5.0
 * @sig Sequential s => s a -> s a
 * @param {Sequential} sequence
 * @return {Sequential} The sequence with all duplicate elements removed
 */
Sequential.unique = Sequential.uniqueBy(_identity);

/**
 * Returns the first index within a sequence for which a predicate returns true.
 *
 * Returns -1 if the element is not found.
 *
 * @since 0.5.0
 * @sig Sequential s => (a -> Boolean) -> s a -> Number
 * @param {Function} fn the predicate
 * @param {Sequential} sequence
 * @return {Number}
 */
Sequential.findIndex = _curry(function(fn, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.find)) {
        return M.find(fn, sequence);
    }

    var len = Sequential.length(sequence);
    var idx = 0;
    while (idx < len) {
        var v = M.nth(idx, sequence);
        if (fn(v)) {
            return idx;
        }
        idx += 1;
    }

    return -1;
});

/**
 * Returns the last index within a sequence for which a predicate returns true.
 *
 * Returns -1 if the element is not found.
 *
 * @since 0.5.0
 * @sig Sequential s => (a -> Boolean) -> s a -> Number
 * @param {Function} fn the predicate
 * @param {Sequential} sequence
 * @return {Number}
 */
Sequential.findLastIndex = _curry(function(fn, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.find)) {
        return M.find(fn, sequence);
    }

    var idx = Sequential.length(sequence) - 1;
    while (idx >= 0) {
        var v = M.nth(idx, sequence);
        if (fn(v)) {
            return idx;
        }
        idx -= 1;
    }

    return -1;
});

/**
 * Returns the first element within a sequence for which a predicate returns true.
 *
 * @since 0.5.0
 * @sig Sequential s => (a -> Boolean) -> s a -> a
 * @param {Function} fn the predicate
 * @param {Sequential} sequence
 * @return {*}
 */
Sequential.find = _curry(function(fn, sequence) {
    var idx = Sequential.findIndex(fn, sequence);
    if (idx === -1) {
        throw new RangeError('The item could not be found');
    }
    return Sequential.nth(idx, sequence);
});

/**
 * Returns that last element within a sequence for which a predicate returns true.
 *
 * @since 0.5.0
 * @sig Sequential s => (a -> Boolean) -> s a -> a
 * @param {Function} fn the predicate
 * @param {Sequential} sequence
 * @return {*}
 */
Sequential.findLast = _curry(function(fn, sequence) {
    var idx = Sequential.findLastIndex(fn, sequence);
    if (idx === -1) {
        throw new RangeError('The item could not be found');
    }
    return Sequential.nth(idx, sequence);
});

/**
 * Returns the first index of an element in a sequence.
 *
 * Returns -1 if the element does not appear in the sequence.
 *
 * @since 0.5.0
 * @sig Sequential s => a -> s a -> Number
 * @param {*} v the value being searched for
 * @param {Sequential} sequence the structure being searched
 * @return {Number}
 */
Sequential.indexOf = _curry(function(v, sequence) {
    return Sequential.findIndex(_equal(v), sequence);
});

/**
 * Returns the last index of an element in a sequence.
 *
 * Returns -1 if the element does not appear in the sequence.
 *
 * @since 0.5.0
 * @sig Sequential s => a -> s a -> Number
 * @param {*} v the value being searched for
 * @param {Sequential} sequence the structure being searched
 * @return {Number}
 */
Sequential.lastIndexOf = _curry(function(v, sequence) {
    return Sequential.findLastIndex(_equal(v), sequence);
});

Sequential.member = function(value) {
    if (value == null) {
        return false;
    }

    var M = _moduleFor(value);
    return Foldable.member(value) && Monoid.member(value) && _isFunction(M.nth) && _isFunction(M.of);
};

