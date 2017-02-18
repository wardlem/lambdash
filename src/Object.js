var _curry = require('./internal/_curry');
var _arrSort = require('./internal/_arrSort');
var _arrEqual = require('./internal/_arrayEqual');
var _equal = require('./internal/_equal');
var _show = require('./internal/_show');
var _flip = require('./internal/_flip');
var __ = require('./internal/_blank');

var Functor = require('./Functor');
var Foldable = require('./Foldable');
var Ord = require('./Ord');
var Ordering = require('./Ordering');
var nth = require('./Sequential').nth;


var _Object = require('./internal/_primitives').Object;

// implementation for Eq

/**
 * Returns true if two objects are structurally equal based on their own keys.
 *
 * @sig {String: a} -> {String: a} -> Boolean
 * @since 0.5.0
 */
_Object.eq = _curry(function(left, right) {
    if (left === right) {
        return true;
    }

    var lKeys = _arrSort(Object.keys(left));
    var rKeys = _arrSort(Object.keys(right));

    if (!_arrEqual(lKeys, rKeys)) {
        return false;
    }

    var keyInd = 0;
    while (keyInd < lKeys.length) {
        var key = lKeys[keyInd];
        if (!(key in right) || !_equal(left[key], right[key])) {
            return false;
        }
        keyInd += 1;
    }

    return true;
});

/**
 * Compares two objects and returns an ordering.
 *
 * Keys are compared based on their lexical ordering.
 *
 * @sig {String: a} -> {String: a} -> Ordering
 * @since 0.6.0
 */
_Object.compare = _curry(function(left, right) {
    if (left === right) {
        return Ordering.EQ;
    }

    var lKeys = _arrSort(Object.keys(left));
    var rKeys = _arrSort(Object.keys(right));

    var count = Math.min(lKeys.length, rKeys.length);
    var ind = 0;
    var comp;
    while (ind < count) {
        comp = Ord.compare(lKeys[ind], rKeys[ind]);
        if (comp !== Ordering.EQ) {
            return comp;
        }
        comp = Ord.compare(left[lKeys[ind]], right[rKeys[ind]]);
        if (comp !== Ordering.EQ) {
            return comp;
        }
        ind += 1;
    }

    return Ordering.fromNum(lKeys.length - rKeys.length);
});

/**
 * Maps the values of an objects own keys, returning a transformed object.
 *
 * @sig (a -> b) -> {String: a} -> {String: b}
 * @since 0.6.0
 */
_Object.fmap = _curry(function(fn, object) {
    return Foldable.foldl(function(accum, key) {
        accum[key] = fn(object[key]);
        return accum;
    }, {}, _Object.ownPropNames(object));
});

/**
 * Like map, but includes the object keys as a second parameter to the mapping function.
 *
 * @sig (a -> String -> b) -> {String: a} -> {String: b}
 * @since 0.6.0
 */
_Object.mapAssoc = _curry(function(fn, object) {
    return Foldable.foldl(function(accum, key) {
        accum[key] = fn(object[key], key);
        return accum;
    }, {}, _Object.ownPropNames(object));
});

/**
 * Right biased union of two objects based on their keys.
 *
 * @sig {String: a} -> {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.concat = _curry(function(left, right) {
    var result = _Object.copy(left);
    for (var k in right) {
        result[k] = right[k];
    }
    return result;
});

/**
 * Returns an empty object
 *
 * @sig () -> {String: *}
 * @since 0.6.0
 */
_Object.empty = function() {
    return {};
};

/**
 * Left biased union of two objects based on their keys.
 *
 * @sig {String: a} -> {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.union = _flip(_Object.concat);

/**
 * Returns an object with the key values in the left for which there is no key in right.
 *
 * @sig {String: a} -> {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.difference = _curry(function(left, right) {
    var result = {};
    for (var k in left) {
        if (!(k in right)) {
            result[k] = left[k];
        }
    }

    return result;
});

/**
 * Returns an object whose keys are those that exist in both left and right and whose values are those in left.
 *
 * @sig {String: a} -> {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.intersection = _curry(function(left, right) {
    var result = {};
    for (var k in left) {
        if (k in right) {
            result[k] = left[k];
        }
    }

    return result;
});

/**
 * Returns an object whose keys are all those present in left or right, but not both
 *
 * @sig {String: a} -> {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.symmetricDifference = _curry(function(left, right) {
    var result = {};
    var k;
    for (k in left) {
        if (!(k in right)) {
            result[k] = left[k];
        }
    }

    for (k in right) {
        if (!(k in left)) {
            result[k] = right[k];
        }
    }

    return result;
});

/**
 * Folds an object's values from left to right.
 *
 * @sig (b -> a -> b) -> b -> {String: a} -> b
 * @since 0.6.0
 */
_Object.foldl = _curry(function(fn, init, object) {
    var keys = Object.keys(object);

    return Foldable.foldl(function(accum, key) {
        return fn(accum, object[key]);
    }, init, keys);
});

/**
 * Folds an object's values from right to left.
 *
 * @sig (b -> a -> b) -> b -> {String: a} -> b
 * @since 0.6.0
 */
_Object.foldr = _curry(function(fn, init, object) {
    var keys = Object.keys(object);

    return Foldable.foldr(function(accum, key) {
        return fn(accum, object[key]);
    }, init, keys);
});

/**
 * Folds an object's values and keys from left to right with keys in sorted order.
 *
 * @sig (b -> a -> String -> b) -> b -> {String: a} -> b
 * @since 0.6.0
 */
_Object.foldlAssoc = _curry(function(fn, init, object) {
    var keys = Object.keys(object);

    return Foldable.foldl(function(accum, key) {
        return fn(accum, object[key], key);
    }, init, keys);
});

/**
 * Folds an object's values and keys from right to left with keys in sorted order.
 *
 * @sig (b -> a -> String -> b) -> b -> {String: a} -> b
 * @since 0.6.0
 */
_Object.foldrAssoc = _curry(function(fn, init, object) {
    var keys = Object.keys(object);

    return Foldable.foldr(function(accum, key) {
        return fn(accum, object[key], key);
    }, init, keys);
});

/**
 * Copies an objects enumerable properties to a new object
 *
 * @sig {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.copy = _curry(function(object) {
    var res = {};
    for (var k in object) {
        res[k] = object[k];
    }
    return res;
});

/**
 * Copies an objects own enumerable properties to a new object
 *
 * @sig {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.copyOwn = _curry(function(object) {
    var res = {};
    for (var k in object) {
        if (object.hasOwnProperty(k)) {
            res[k] = object[k];
        }
    }
    return res;
});

/**
 * Creates a new object from another with a key set to a new value.
 *
 * @sig String -> a -> {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.assoc = _curry(function(key, value, object) {
    var res = _Object.copy(object);

    res[key] = value;
    return res;
});

/**
 * Creates a new object from another with a key removed.
 *
 * @sig String -> {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.dissoc = _curry(function(key, object) {
    var res = {};
    for (var k in object) {
        if (k !== key) {
            res[k] = object[k];
        }
    }

    return res;
});

/**
 * Returns true if an object has a property.
 *
 * @sig String -> {String: a} -> Boolean
 * @since 0.6.0
 */
_Object.propExists = _curry(function(key, object) {
    return key in object;
});

/**
 * Returns true if an object has a property.
 *
 * @sig String -> {String: a} -> Boolean
 * @since 0.6.0
 */
_Object.exists = _Object.propExists;

/**
 * Returns true if an object has an own property.
 *
 * @sig String -> {String: a} -> Boolean
 * @since 0.6.0
 */
_Object.ownPropExists = _curry(function(key, object) {
    return Object.prototype.hasOwnProperty.call(object, key);
});

/**
 * Returns the property associated with a key in an object.
 *
 * This function treats every value given to it as a regular javascript object.
 * This is in contrast to the librarie's lookup function which treats its
 * operands as associative collections.
 * However, when operating on plain-old javascript objects, these two functions
 * behave identically.
 *
 * @sig String -> {String: a} -> a|undefined
 * @since 0.6.0
 */
_Object.prop = _curry(function(key, object) {
    return object[key];
});

/**
 * Returns the property associated with a key in an object.
 *
 * @sig String -> {String: a} -> a|undefined
 * @since 0.6.0
 */
_Object.lookup = _Object.prop;

/**
 * Returns the property associated with a key in an object if it exists or a default value if it does not exist.
 *
 * @sig a -> String -> {String: a} -> a
 * @since 0.6.0
 */
_Object.propOr = _curry(function(def, key, object) {
    return _Object.exists(key, object) ? object[key] : def;
});

/**
 * Takes a structure of keys and returns a structure of properties.
 *
 * @sig Foldable f => f String -> {String: a} -> f a
 * @since 0.6.0
 */
_Object.props = _curry(function(props, object) {
    return Functor.fmap(_Object.prop(__, object), props);
});

/**
 * Returns the enumerable keys of an object as an array.
 *
 * @sig {String: a} -> [String]
 * @since 0.6.0
 */
_Object.propNames = _curry(function(object) {
    return Object.keys(_Object.copy(object));
});

_Object.keys = _Object.propNames;

/**
 * Returns the enumerable own keys of an object as an array.
 *
 * The keys are sorted.
 *
 * @sig {String: a} -> [String]
 * @since 0.6.0
 */
_Object.ownPropNames = _curry(function(object) {
    return Object.keys(object);
});

/**
 * Returns the enumerable values of an object as an array.
 *
 * @sig {String: a} -> [a]
 * @since 0.6.0
 */
_Object.values = _curry(function(object) {
    return _Object.props(_Object.keys(object), object);
});

/**
 * Returns the enumerable own values of an object as an array.
 *
 * @sig {String: a} -> [a]
 * @since 0.6.0
 */
_Object.ownValues = _curry(function(object) {
    return _Object.props(_Object.ownPropNames(object), object);
});

/**
 * Returns an array of array of key value pairs where the first index of each pair is a key
 * in the object and the second index is the value associated with that key.
 *
 * @sig {String: a} -> [[String, a]]
 * @since 0.6.0
 */
_Object.pairs = _curry(function(object) {
    return Functor.fmap(function(key) {
        return [key, object[key]];
    }, _Object.propNames(object));
});

/**
 * Returns an array of array of key value pairs where the first index of each pair is an own key
 * in the object and the second index is the value associated with that key.
 *
 * @sig {String: a} -> [[String, a]]
 * @since 0.6.0
 */
_Object.ownPairs = _curry(function(object) {
    return Functor.fmap(function(key) {
        return [key, object[key]];
    }, _Object.ownPropNames(object));
});

/**
 * Returns an object from a sequence of pairs.
 *
 * @sig Sequential s => s (s String|a) -> {String: a}
 * @since 0.6.2
 */
_Object.fromPairs = _curry(function(pairs) {
    return Foldable.foldl(function(accum, pair) {
        accum[nth(0, pair)] = nth(1, pair);
        return accum;
    }, {}, pairs);
});

/**
 * Takes a sequence of keys and a sequence of values and creates an object
 *
 * @sig Sequential s => s String -> s a -> {String: a}
 * @since 0.6.2
 */
_Object.zip = _curry(function(keys, values) {
    var l = Foldable.len(keys);
    var i = 0;
    var object = {};
    while (i < l) {
        object[nth(i,keys)] = nth(i,values);
        i += 1;
    }
    return object;
});

/**
 * Takes a predicate function and an object and returns an object with the same keys
 * as the one given whose values pass the predicate function.
 *
 * @sig (a -> Boolean) -> {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.filter = _curry(function(fn, object) {
    return _Object.foldlAssoc(function(accum, value, key) {
        if (fn(value)) {
            accum[key] = value;
        }
        return accum;
    }, {}, object);
});

/**
 * Works the same as filter, except passes the key as a second argument to the predicate.
 *
 * @sig (a -> String -> Boolean) -> {String: a} -> {String: a}
 * @since 0.6.0
 */
_Object.filterAssoc = _curry(function(fn, object) {
    return _Object.foldlAssoc(function(accum, value, key) {
        if (fn(value, key)) {
            accum[key] = value;
        }
        return accum;
    }, {}, object);
});


/**
 * Returns a string representation of an object.
 *
 * @sig {String: a} -> String
 * @since 0.5.0
 */
_Object.show = _curry(function(object) {
    var keys = _arrSort(Object.keys(object));
    var items = keys.map(function(key) {
        return '"' + key + '"' + ': ' + _show(object[key]);
    });

    return '{' + items.join(', ') + '}';
});

module.exports = _Object;
