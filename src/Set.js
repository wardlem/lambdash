const _curry = require('./internal/_curry');
const _show = require('./internal/_show');
const Foldable = require('./Foldable');
const _Int32Array = require('./internal/_primitives').Int32Array;
const Hashable = require('./Hashable');

/**
 * _Set is the module for javascript's built in Set type.
 *
 * @module
 * @implements Eq
 * @implements Functor
 * @implements Foldable
 * @implements Semigroup
 * @implements Monoid
 * @implements Applicative
 * @implements Monad
 * @implements SetOps
 * @implements SetKind
 * @implements Show
 */
const _Set = require('./internal/_primitives').Set;

/**
 * Returns true if two sets contain the same elements.
 *
 * Uses strict javascript equality, the same as the native Set type uses,
 * rather than structural equality.
 */
_Set.eq = _curry(function eq(left, right) {
    if (left === right) {
        return true;
    }

    if (left.size !== right.size) {
        return false;
    }

    for (let value of left) {
        if (!right.has(value)) {
            return false;
        }
    }

    return true;
});

/**
 * Creates a new set with all the values in the original updated with the function.
 *
 * @sig (a -> b) -> (Set a) -> (Set b)
 * @since 0.7.0
 */
_Set.map = _curry(function map(fn, set) {
    const newSet = new Set();

    set.forEach(value => { newSet.add(fn(value)); });

    return newSet;
});

/**
 * Reduces the values of a set into a single value with the provided function
 *
 * The order the values are applied to the function are dictated by the set's values() method.
 * As such, the order is unstable.
 *
 * @sig (a -> v -> a) -> a -> (Set v) -> a
 * @since 0.7.0
 */
_Set.foldl = _curry(function(fn, init, set) {
    for (let value of set) {
        init = fn(init, value);
    }

    return init;
});

/**
 * Reduces the values of a set into a single value with the provided function
 *
 * The order the values are applied to the function are the reverse of the set's values() method.
 * As such, the order is unstable.
 *
 * @sig (a -> v -> a) -> a -> (Set v) -> a
 * @since 0.7.0
 */
_Set.foldr = _curry(function(fn, init, set) {
    // the order does not matter, but we do it for good measure
    for (let value of Array.from(set).reverse()) {
        init = fn(init, value);
    }

    return init;
});

/**
 * Joins two sets into one
 *
 * @sig (Set a) -> (Set a) -> (Set a)
 * @since 0.7.0
 */
_Set.concat = _curry(function concat(left, right) {
    const newSet = new Set(left);

    right.forEach(value => { newSet.add(value); });

    return newSet;
});

/**
 * Returns an empty set
 *
 * @sig () -> Set a
 * @since 0.7.0
 */
_Set.empty = _curry(function empty() {
    return new Set();
});

/**
 * Applies all the functions in one set to the values in another set and concatenates them together
 *
 * @sig (Set (a -> b)) -> (Set a) -> (Set b)
 * @since 0.7.0
 */
_Set.ap = _curry(function ap(applicative, set) {
    let result = new Set();

    for (let fn of applicative) {
        result = _Set.concat(result, _Set.map(fn, set));
    }

    return result;
});

/**
 * Creates a set with the given value as its only member
 *
 * @sig a -> Set a
 * @since 0.7.0
 */
_Set.of = _curry(function of(value) {
    const set = new Set();
    set.add(value);
    return set;
});

/**
 * Takes a set of sets and joins the values into a single set.
 *
 * @sig (Set (Set a)) -> Set a
 * @since 0.7.0
 */
_Set.flatten = _curry(function(sets) {
    return _Set.foldl(_Set.concat, new Set(), sets);
});

/**
 * Joins the values of two sets into one.
 *
 * This function is identical to _.Set.concat
 *
 * @sig (Set a) -> (Set a) -> (Set a)
 * @since 0.7.0
 */
_Set.union = _Set.concat;

_Set.difference = _curry(function(left, right) {
    const result = new Set();

    for (let value of left) {
        if (!right.has(value)) {
            result.add(value);
        }
    }

    return result;
});

_Set.intersection = _curry(function(left, right) {
    const result = new Set();

    for (let value of left) {
        if (right.has(value)) {
            result.add(value);
        }
    }

    return result;
});

_Set.symmetricDifference = _curry(function(left, right) {
    return _Set.concat(_Set.difference(left, right), _Set.difference(right, left));
});

_Set.exists = _curry(function(key, set) {
    return set.has(key);
});

_Set.insert = _curry(function(key, set) {
    const newSet = new Set(set);
    newSet.add(key);
    return newSet;
});

_Set.remove = _curry(function(key, set) {
    const newSet = new Set(set);
    newSet.delete(key);
    return newSet;
});

_Set.show = _curry(function(set) {
    var items = _Set.map(_show, set);
    return 'Set(' + Foldable.joinWith(',', items) + ')';
});

/**
 * Hashes a map with a provided seed
 *
 * @sig (Hashable k, Hashable v) => Integer -> (Map k v) -> Integer
 * @since 0.7.0
 */
_Set.hashWithSeed = _curry(function hashWithSeed(seed, set) {
    const values = [];

    for (let value of set) {
        values.push(Hashable.hashWithSeed(seed, value));
    }

    return _Int32Array.hashWithSeed(seed, Int32Array.of(values));
});

module.exports = _Set;
