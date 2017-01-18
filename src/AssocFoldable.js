const _curry = require('./internal/_curry');
const _isFunction = require('./internal/_isFunction');
const _moduleFor = require('./internal/_moduleFor');

const Semigroup = require('./Semigroup');
const Associative = require('./Associative');

const AssocFoldable = module.exports;

const _foldAssoc = _curry(function(_f, fn, init, foldable){

    const M = _moduleFor(foldable);
    if (_isFunction(M[_f])) {
        return M[_f](fn, init, foldable);
    }

    throw new TypeError('AssocFoldable#' + _f + ' called on a value that does not implement AssocFoldable');
});

/**
 * Folds an associative container from left to right with the key.
 *
 * The order the function is applied to the key value pairs are dictated
 * by the container's notion of left-to-right and may not be stable.
 *
 * @since 0.6.0
 * @sig AssocFoldable f => (r -> v -> k -> r) -> r -> (f k v) -> v
 * @example
 *
 *      const obj = {'r': 7, 'k': 8};
 *      const fn = (result, value, key) => result + key + (value + 1);
 *      _.foldlAssoc(fn, 'g', obj); // 'gr8k9'
 */
AssocFoldable.foldlAssoc = _foldAssoc('foldlAssoc');

/**
 * Folds an associative container from right to left with the key.
 *
 * The order the function is applied to the key value pairs are dictated
 * by the container's notion of right-to-left and may not be stable.
 *
 * @since 0.6.0
 * @sig AssocFoldable f => (r -> v -> k -> r) -> r -> (f k v) -> v
 * @example
 *
 *      const obj = {'k': 8, 'r': 7};
 *      const fn = (result, value, key) => result + key + (value + 1);
 *      _.foldrAssoc(fn, '', obj); // 'gr8k9'
 */
AssocFoldable.foldrAssoc = _foldAssoc('foldrAssoc');

/**
 * Returns an array of key value pair tuples (as arrays) where the first index of each pair is a key
 * in the object and the second index is the value associated with that key.
 *
 * @sig Associative a => a k v -> [[k,a]]
 * @since 0.6.0
 */
AssocFoldable.pairs = _curry(function(assoc) {
    const M = _moduleFor(assoc);
    if (_isFunction(M.pairs)) {
        return M.pairs(assoc);
    } else if (_isFunction(M.foldlAssoc)) {
        return M.foldlAssoc((accum, v, k) => Semigroup.concat(accum, [[k,v]]), [], assoc);
    }

    throw new TypeError('AssocFoldable#pairs called on a value that does not implement AssocFoldable');
});

/**
 * Returns all the keys in an associative collection as an array.
 *
 * @sig Associative a => a k v -> [k]
 * @since 0.6.0
 */
AssocFoldable.keys = _curry(function(assoc) {
    const M = _moduleFor(assoc);
    if (_isFunction(M.keys)) {
        return M.keys(assoc);
    } else if (_isFunction(M.foldlAssoc)) {
        return M.foldlAssoc((accum, v, k) => Semigroup.concat(accum, [k]), [], assoc);
    }

    throw new TypeError('AssocFoldable#pairs called on a value that does not implement AssocFoldable');
});

/**
 * Returns all the keys in an associative collection as an array.
 *
 * @sig Associative a => a k v -> [k]
 * @since 0.6.0
 */
AssocFoldable.values = _curry(function(assoc) {
    const M = _moduleFor(assoc);
    if (_isFunction(M.values)) {
        return M.values(assoc);
    } else if (_isFunction(M.foldlAssoc)) {
        return M.foldlAssoc((accum, v, k) => Semigroup.concat(accum, [v]), [], assoc);
    }

    throw new TypeError('AssocFoldable#pairs called on a value that does not implement AssocFoldable');
});

/**
 * Filters an associative container based on a predicate function that accepts both a value and key.
 *
 * @sig Associative a => (v -> k -> Boolean) -> a k v -> a k v
 * @since 0.6.0
 */
AssocFoldable.filterAssoc = _curry(function(filter, assoc) {
    const M = _moduleFor(assoc);
    if (_isFunction(M.filterAssoc)) {
        return M.filterAssoc(filter, assoc);
    } else if (_isFunction(M.foldlAssoc, M.empty, M.assoc)) {
        return M.foldlAssoc((accum, v, k) => {
            return filter(v, k) ? M.assoc(k, v, accum) : accum;
        }, M.empty(), assoc);
    }

    throw new TypeError('AssocFoldable#filterAssoc called on a value that does not implement AssocFoldable');
});

/**
 * Maps the values and keys of an associative container.
 *
 * @sig Associative a => (v -> k -> v) -> a k v -> a k v
 * @since 0.6.0
 */
AssocFoldable.mapAssoc = _curry(function(fn, assoc) {
    const M = _moduleFor(assoc);
    if (_isFunction(M.mapAssoc)) {
        return M.mapAssoc(fn, assoc);
    } else if (_isFunction(M.foldlAssoc, M.empty, M.assoc)) {
        return M.foldlAssoc((accum, v, k) => {
            return M.assoc(k, fn(v, k), assoc)
        }, M.empty(), assoc);
    }

    throw new TypeError('AssocFoldable#mapAssoc called on a value that does not implement AssocFoldable');
});

AssocFoldable.member = function(value) {
    const M = _moduleFor(value);
    return Associative.member(value) && _isFunction(M.empty, M.foldlAssoc, M.foldrAssoc);
};
