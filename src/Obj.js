var _curry = require('./internal/_curry');
var _arrSort = require('./internal/_arrSort');
var _arrEqual = require('./internal/_arrayEqual');
var _equal = require('./internal/_equal');
var _show = require('./internal/_show');
var _flip = require('./internal/_flip');
var _compose = require('./internal/_compose');
var __ = require('./internal/_blank');

var Functor = require('./Functor');
var Foldable = require('./Foldable');

var Obj = require('./internal/_primitives').Obj;

// implementation for Eq

/**
 * Returns true if two objects are structurally equal based on their own keys.
 *
 * @sig {String: a} -> {String: a} -> Boolean
 * @since 0.5.0
 */
Obj.eq = _curry(function(left, right) {
    if (left === right) {
        return true;
    }

    var lKeys = _arrSort(Object.keys(left));
    var rKeys = _arrSort(Object.keys(right));

    if (!_arrEqual(lKeys, rKeys)) {
        return false;
    }

    var keyInd = 0;
    while(keyInd < lKeys.length) {
        var key = lKeys[keyInd];
        if (!(key in right) || !_equal(left[key], right[key])) {
            return false;
        }
        keyInd += 1;
    }

    return true;
});

/**
 * Maps the values of an objects own keys, returning a transformed object.
 *
 * @sig (a -> b) -> {String: a} -> {String: b}
 * @since 0.6.0
 */
Obj.map = _curry(function(fn, obj) {
    return Foldable.foldl(function(accum, key){
        accum[key] = fn(obj[key]);
        return accum;
    }, {}, Obj.ownKeys(obj));
});

/**
 * Like map, but includes the object keys as a second parameter to the mapping function.
 *
 * @sig (a -> String -> b) -> {String: a} -> {String: b}
 * @since 0.6.0
 */
Obj.mapAssoc = _curry(function(fn, obj) {
    return Foldable.foldl(function(accum, key){
        accum[key] = fn(obj[key], key);
        return accum;
    }, {}, Obj.ownKeys(obj));
});

/**
 * Right biased union of two objects based on their keys.
 *
 * @sig {String: a} -> {String: a} -> {String: a}
 * @since 0.6.0
 */
Obj.concat = _curry(function(left, right){
    var result = Obj.copy(left);
    for (var k in right){
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
Obj.empty = function(){
    return {};
};

/**
 * Left biased union of two objects based on their keys.
 *
 * @sig {String: a} -> {String: a} -> {String: a}
 * @since 0.6.0
 */
Obj.union = _flip(Obj.concat);

/**
 * Returns an object with the key values in the left for which there is no key in right.
 *
 * @sig {String: a} -> {String: a} -> {String: a}
 * @since 0.6.0
 */
Obj.difference = _curry(function(left, right){
    var result = {};
    for (var k in left){
        if(!(k in right)){
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
Obj.intersection = _curry(function(left, right){
    var result = {};
    for (var k in left){
        if(k in right){
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
Obj.symettricDifference = _curry(function(left, right){
    var result = {};
    var k;
    for (k in left){
        if(!(k in right)){
            result[k] = left[k];
        }
    }

    for (k in right){
        if(!(k in left)){
            result[k] = right[k];
        }
    }

    return result;
});

/**
 * Folds an object's values from left to right with keys in sorted order.
 *
 * @sig (b -> a -> b) -> b -> {String: a} -> b
 */
Obj.foldl = _curry(function(fn, init, obj){
    var keys = _arrSort(Object.keys(obj));

    return Foldable.foldl(function(accum, key){
        return fn(accum, obj[key]);
    }, init, keys);
});

/**
 * Folds an object's values from right to left with keys in sorted order.
 *
 * @sig (b -> a -> b) -> b -> {String: a} -> b
 */
Obj.foldr = _curry(function(fn, init, obj){
    var keys = _arrSort(Object.keys(obj));

    return Foldable.foldr(function(accum, key){
        return fn(accum, obj[key]);
    }, init, keys);
});

/**
 * Folds an object's values and keys from left to right with keys in sorted order.
 *
 * @sig (b -> a -> String -> b) -> b -> {String: a} -> b
 */
Obj.foldlAssoc = _curry(function(fn, init, obj){
    var keys = _arrSort(Object.keys(obj));

    return Foldable.foldl(function(accum, key){
        return fn(accum, obj[key], key);
    }, init, keys);
});

/**
 * Folds an object's values and keys from right to left with keys in sorted order.
 *
 * @sig (b -> a -> String -> b) -> b -> {String: a} -> b
 */
Obj.foldrAssoc = _curry(function(fn, init, obj){
    var keys = _arrSort(Object.keys(obj));

    return Foldable.foldr(function(accum, key){
        return fn(accum, obj[key], key);
    }, init, keys);
});

/**
 * Copies an objects enumerable properties to a new object
 *
 * @sig {String: a} -> {String: a}
 * @since 0.6.0
 */
Obj.copy = _curry(function(obj){
    var res = {};
    for (var k in obj) {
        res[k] = obj[k];
    }
    return res;
});

/**
 * Copies an objects own enumerable properties to a new object
 *
 * @sig {String: a} -> {String: a}
 * @since 0.6.0
 */
Obj.copyOwn = _curry(function(obj){
    var res = {};
    for (var k in obj) {
        if (obj.hasOwnProperty(k)){
            res[k] = obj[k];
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
Obj.assoc = _curry(function(key, value, obj){
    var res = Obj.copy(obj);

    res[key] = value;
    return res;
});

/**
 * Creates a new object from another with a key removed.
 *
 * @sig String -> {String: a} -> {String: a}
 * @since 0.6.0
 */
Obj.dissoc = _curry(function(key, obj){
    var res = {};
    for (var k in obj) {
        if (k !== key) {
            res[k] = obj[k];
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
Obj.has = _curry(function(key, obj){
    return key in obj;
});

/**
 * Returns true if an object has an own property.
 *
 * @sig String -> {String: a} -> Boolean
 * @since 0.6.0
 */
Obj.hasOwn = _curry(function(key, obj){
    return Object.prototype.hasOwnProperty.call(obj, key);
});

/**
 * Returns the property associated with a key in an object.
 *
 * @sig String -> {String: a} -> a|undefined
 * @since 0.6.0
 */
Obj.prop = _curry(function(key, obj){
    return obj[key];
});

/**
 * Returns the property associated with a key in an object if it exists or a default value if it does not exist.
 *
 * @sig a -> String -> {String: a} -> a
 * @since 0.6.0
 */
Obj.propOr = _curry(function(def, key, obj){
    return Obj.has(key, obj) ? obj[key] : def;
});

/**
 * Takes a structure of keys and returns a structure of properties.
 *
 * @sig Foldable f => f String -> {String: a} -> f a
 * @since 0.6.0
 */
Obj.props = _curry(function(props, obj){
    return Functor.map(Obj.prop(__, obj), props);
});

/**
 * Returns the enumerable keys of an object as an array.
 *
 * The keys are sorted.
 *
 * @sig {String: a} -> [String]
 * @since 0.6.0
 */
Obj.keys = _curry(function(obj){
    return _arrSort(Object.keys(Obj.copy(obj)));
});

/**
 * Returns the enumerable own keys of an object as an array.
 *
 * The keys are sorted.
 *
 * @sig {String: a} -> [String]
 * @since 0.6.0
 */
Obj.ownKeys = _curry(function(obj){
    return _arrSort(Object.keys(obj));
});

/**
 * Returns the enumerable values of an object as an array.
 *
 * @sig {String: a} -> [a]
 * @since 0.6.0
 */
Obj.values = _curry(function(obj){
    return Obj.props(Obj.keys(obj), obj);
});

/**
 * Returns the enumerable own values of an object as an array.
 *
 * @sig {String: a} -> [a]
 * @since 0.6.0
 */
Obj.ownValues = _curry(function(obj){
    return Obj.props(Obj.ownKeys(obj), obj);
});

/**
 * Returns an array of array of key value pairs where the first index of each pair is a key
 * in the object and the second index is the value associated with that key.
 *
 * @sig {String: a} -> [[String, a]]
 * @since 0.6.0
 */
Obj.pairs = _curry(function(obj){
    return Functor.map(function(key){
        return [key, obj[key]];
    }, Obj.keys(obj))
});

/**
 * Returns an array of array of key value pairs where the first index of each pair is an own key
 * in the object and the second index is the value associated with that key.
 *
 * @sig {String: a} -> [[String, a]]
 * @since 0.6.0
 */
Obj.ownPairs = _curry(function(obj){
    return Functor.map(function(key){
        return [key, obj[key]];
    }, Obj.ownKeys(obj));
});

/**
 * Takes a predicate function and an object and returns an object with the same keys
 * as the one given whose values pass the predicate function.
 *
 * @sig (a -> Boolean) -> {String: a} -> {String: a}
 * @since 0.6.0
 */
Obj.filter = _curry(function(fn, obj){
    return Obj.foldlAssoc(function(accum, value, key){
        if (fn(value)){
            accum[key] = value;
        }
        return accum;
    }, {}, obj);
});

/**
 * Works the same as filter, except passes the key as a second argument to the predicate.
 *
 * @sig (a -> String -> Boolean) -> {String: a} -> {String: a}
 * @since 0.6.0
 */
Obj.filterAssoc = _curry(function(fn, obj){
    return Obj.foldlAssoc(function(accum, value, key){
        if (fn(value, key)){
            accum[key] = value;
        }
        return accum;
    }, {}, obj);
});


/**
 * Returns a string representation of an object.
 *
 * @sig {String: a} -> String
 * @since 0.5.0
 */
Obj.show = _curry(function(obj){
    var keys = _arrSort(Object.keys(obj));
    var items = keys.map(function(key){
        return '"' + key + '"' + ": " + _show(obj[key]);
    });

    return "{" + items.join(', ') + "}";
});

module.exports = Obj;