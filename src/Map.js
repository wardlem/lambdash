const _curry = require('./internal/_curry');
const _Array = require('./Array');
const _equal = require('./internal/_equal');
const _flip = require('./internal/_flip');
const _show = require('./internal/_show');
const _Int32Array = require('./internal/_primitives').Int32Array;
const Hashable = require('./Hashable');

/**
 * _Map is the module for javascript's built in Map type.
 *
 * @module
 * @implements Eq
 * @implements Functor
 * @implements Foldable
 * @implements Semigroup
 * @implements Monoid
 * @implements SetOps
 * @implements Show
 * @implements Associative
 * @implements AssocFoldable
 * @implements Hashable
 */
const _Map = require('./internal/_primitives').Map;

/**
 * Returns true if two Maps have the same key-value pairs, false otherwise.
 *
 * The keys are compared using javascript's notion of strict equality,
 * but the values are compared by structure.
 *
 * @sig Eq v => (Map k v) -> (Map k v) -> Boolean
 * @since 0.7.0
 */
_Map.eq = _curry(function(left, right) {
    if (left === right) {
        return true;
    }

    if (left.size !== right.size) {
        return false;
    }

    for (let [k,v] of left.entries()) {
        if (!right.has(k) || _equal(v, right.get(k))) {
            return false;
        }
    }

    return true;
});

/**
 * Creates a new map with all the values in the original updated with the function.
 *
 * @sig (a -> b) -> (Map k a) -> (Map k b)
 * @since 0.7.0
 */
_Map.map = _curry(function map(fn, map) {
    const newMap = new Map();
    map.forEach((value, key) => { newMap.set(key, fn(value)); });
    return newMap;
});

/**
 * Reduces the values of a map into a single value with the provided function
 *
 * The order the values are applied to the function are dictated by the map's values() method.
 * As such, the order is unstable.
 *
 * @sig (a -> v -> a) -> a -> (Map k v) -> a
 * @since 0.7.0
 */
_Map.foldl = _curry(function(fn, init, map) {
    for (let value of map.values()) {
        init = fn(init, value);
    }

    return init;
});

/**
 * Reduces the values of a map into a single value with the provided function
 *
 * The order the values are applied to the function are the reverse of the map's values() method.
 * As such, the order is unstable.
 *
 * @sig (a -> v -> a) -> a -> (Map k v) -> a
 * @since 0.7.0
 */
_Map.foldr = _curry(function(fn, init, map) {
    return _Array.foldr(fn, init, Array.from(map.values()));
});

/**
 * Joins two maps into one.
 *
 * If a key exists in both the left and the right map, the value in the left is used.
 *
 * @sig (Map k v) -> (Map k v) -> (Map k v)
 * @since 0.7.0
 */
_Map.concat = _curry(function concat(left, right) {
    const newMap = new Map(right);

    left.forEach((value, key) => { newMap.set(key, value); });

    return newMap;
});

/**
 * Returns an empty map
 *
 * @sig () -> Map k v
 * @since 0.7.0
 */
_Map.empty = _curry(function empty() {
    return new Map();
});

/**
 * Joins to maps into one
 *
 * If a key exists in both maps, the value from the right is used.
 *
 * @sig (Map k v) -> (Map k v) -> (Map k v)
 * @since 0.7.0
 */
_Map.union = _flip(_Map.concat);

/**
 * Returns all key value pairs in left for which there is no key in right
 *
 * @sig (Map k v) -> (Map k v) -> (Map k v)
 * @since 0.7.0
 */
_Map.difference = _curry(function(left, right) {
    const newMap = new Map();

    for (let [key, value] of left.entries()) {
        if (!right.has(key)) {
            newMap.set(key, value);
        }
    }

    return newMap;
});

/**
 * Returns a map whose keys are those that exist in both left and right and
 * whose values are those in left.
 *
 * @sig (Map k v) -> (Map k v) -> (Map k v)
 * @since 0.7.0
 */
_Map.intersection = _curry(function intersection(left, right) {
    const newMap = new Map();

    for (let [key, value] of left.entries()) {
        if (right.has(key)) {
            newMap.set(key, value);
        }
    }

    return newMap;
});

/**
 * Returns a map with the keys that are in right or left, but not both
 *
 * @sig (Map k v) -> (Map k v) -> (Map k v)
 * @since 0.7.0
 */
_Map.symmetricDifference = _curry(function symmetricDifference(left, right) {
    return _Map.concat(_Map.difference(left, right), _Map.difference(right, left));
});

/**
 * Hashes a map with a provided seed
 *
 * @sig (Hashable k, Hashable v) => Integer -> (Map k v) -> Integer
 * @since 0.7.0
 */
_Map.hashWithSeed = _curry(function hashWithSeed(seed, map) {
    const values = [];

    for (let [key, value] of map.entries()) {
        values.push(Hashable.hashWithSeed(seed, key));
        values.push(Hashable.hashWithSeed(seed, value));
    }

    return _Int32Array.hashWithSeed(seed, Int32Array.of(values));
});

_Map.foldlAssoc = _curry(function(fn, init, map) {
    let pairs = Array.from(map.entries());

    return pairs.reduce((accum, [k,v]) => fn(accum, v, k), init);
});

_Map.foldrAssoc = _curry(function(fn, init, map) {
    let pairs = Array.from(map.entries()).reverse();

    return pairs.reduce((accum, [k,v]) => fn(accum, v, k), init);
});

_Map.assoc = _curry(function(key, value, map) {
    const newMap = new Map(map);
    newMap.set(key, value);
    return newMap;
});

_Map.dissoc = _curry(function(key, map) {
    const newMap = new Map(map);
    newMap.delete(key);
    return newMap;
});

_Map.exists = _curry(function(key, map) {
    return map.has(key);
});

_Map.lookup = _curry(function(key, map) {
    return map.get(key);
});

_Map.hashWithSeed = _curry(function(seed, map) {
    const Hashable = require('./Hashable');
    return _Map.foldlAssoc((res, v, k) => {
        return Hashable.hashWithSeed(
            Hashable.hashWithSeed(seed, k),
            v
        );
    }, seed, map);
});

_Map.show = _curry(function(map) {
    const values = _Map.mapAssoc((v,k) => `[${_show(k)},${_show(v)}]`, map);

    return `Map([${values}])`;
});
module.exports = _Map;
