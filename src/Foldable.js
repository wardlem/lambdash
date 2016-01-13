var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');
var _not = require('./internal/_not');
var _equal = require('./internal/_equal');
var _identity = require('./internal/_identity');
var _compose = require('./internal/_compose');
var _alwaysThrow = require('./internal/_alwaysThrow');
var _ = require('./internal/_blank');

var Ord = require('./Ord');
var Monoid = require('./Monoid');
var Functor = require('./Functor');
var Numeric = require('./Numeric');

var Foldable = module.exports;

var Arr = require('./Arr');

var _fold = _curry(function(_f, fn, init, foldable){

    var M = _moduleFor(foldable);
    if (_isFunction(M[_f])) {
        return M[_f](fn, init, foldable);
    }

    throw new TypeError('Foldable#' + _f + ' called on a value that does not implement Foldable');
});


/**
 * Folds a value from left to right.
 *
 * @since 0.5.0
 * @sig Foldable f => (b -> a -> b) -> b -> f a -> b
 * @param {Function} fn the iterator function with signature (b -> a -> b) where the first parameter
 *                   is the accumulated value and a is a value in the container being folded
 * @param {*} init the initial accumulation value
 * @param {Foldable} the container being folded
 * @return {*} the accumulated value
 */
Foldable.foldl = _fold('foldl');


/**
 * Folds a value from right to left.
 *
 * @since 0.5.0
 * @sig Foldable f => (b -> a -> b) -> b -> f a -> b
 * @param {Function} fn the iterator function with signature (b -> a -> b) where the first parameter
 *                   is the accumulated value and a is a value in the container being folded
 * @param {*} init the initial accumulation value
 * @param {Foldable} the container being folded
 * @return {*} the accumulated value
 */
Foldable.foldr = _fold('foldr');

/**
 * Maps each element of a container to a monoid and concatenates the result
 *
 * The type signature is different than Haskell's version.
 * The reason for this is that the empty value for the monoid can not be consistently inferred.
 *
 * @since 0.5.0
 * @sig (Foldable f, Monoid m) => (a -> m) -> f a -> m
 * @param {Function} fn the iterator function that must return a monoid
 * @param {Monoid} empty the empty value for the monoid that will be concatenated
 * @param {Foldable} foldable the container being folded
 * @return {Monoid} the concatenated result of the fold
 * @example
 *
 *     var foldable = [1,2,3]
 *     var fn = n => return String(n + 1)
 *     var empty = '';
 *
 *     _.foldMap(fn, empty, foldable);  // '234'
 *
 *
 *     var Sum = _.productType('Sum', {value: _.Num});
 *     Sum.empty = _.always(Sum(0));
 *     Sum.concat = _.curry(function(left, right) {
 *         return Sum(left.value + right.value);
 *     });
 *
 *     _.foldMap(Sum, Sum.empty(), [1,2,3]); // Sum(6)
 */
Foldable.foldMap = _curry(function(fn, foldable) {
    var EMPTY = {};
    var result = Foldable.foldr(function(accum, value) {
        if (accum === EMPTY) {
            return fn(value);
        }
        return Monoid.concat(fn(value), accum);
    }, EMPTY, foldable);

    if (result === EMPTY) {
        throw new TypeError('Foldable#foldMap can not called on an empty structure');
    }

    return result;
});

/**
 * Maps each element of a container to a monoid and concatenates the result
 *
 * @since 0.5.0
 * @sig (Foldable f, Monoid m) => (a -> m) -> m -> f a -> m
 * @param {Function} fn the iterator function that must return a monoid
 * @param {Monoid} empty the empty value for the monoid that will be concatenated
 * @param {Foldable} foldable the container being folded
 * @return {Monoid} the concatenated result of the fold
 * @example
 *
 *     var foldable = [1,2,3]
 *     var fn = n => return String(n + 1)
 *     var empty = '';
 *
 *     _.foldMap(fn, empty, foldable);  // '234'
 *
 *
 *     var Sum = _.productType('Sum', {value: _.Num});
 *     Sum.empty = _.always(Sum(0));
 *     Sum.concat = _.curry(function(left, right) {
 *         return Sum(left.value + right.value);
 *     });
 *
 *     _.foldMap(Sum, Sum.empty(), [1,2,3]); // Sum(6)
 */
Foldable.foldMap2 = _curry(function(fn, empty, foldable) {
    return Foldable.foldr(function(accum, value) {
        return Monoid.concat(fn(value), accum);
    }, empty, foldable)
});

/**
 * Folds a container, accumulating the result in a monoid
 *
 * Corresponds to Haskell's `fold`
 * The type signature is different than Haskell's version.
 * The reason for this is that the empty value for the monoid can not be consistently inferred.
 *
 * @since 0.5.0
 * @sig (Foldable f, Monoid m) => f m -> m
 * @param {Monoid} empty the empty value for the monoid that will be concatenated
 * @param {Foldable} foldable the container being folded
 * @return {Monoid} the concatenated result of the fold
 * @example
 *
 *     var foldable = ['a','b','c']
 *     var empty = '';
 *
 *     _.join(empty, foldable);  // 'abc'
 *
 *
 *     var Sum = _.productType('Sum', {value: _.Num});
 *     Sum.empty = _.always(Sum(0));
 *     Sum.concat = _.curry(function(left, right) {
 *         return Sum(left.value + right.value);
 *     });
 *
 *     _.join(Sum.empty(), [Sum(1),Sum(2),Sum(3)]); // Sum(6)
 */
Foldable.join = Foldable.foldMap(_identity);

/**
 * Folds a container, accumulating the result in a monoid
 *
 * Corresponds to Haskell's `fold`
 * The type signature is different than Haskell's version.
 * The reason for this is that the empty value for the monoid can not be consistently inferred.
 *
 * @since 0.5.0
 * @sig (Foldable f, Monoid m) => m -> f m -> m
 * @param {Monoid} empty the empty value for the monoid that will be concatenated
 * @param {Foldable} foldable the container being folded
 * @return {Monoid} the concatenated result of the fold
 * @example
 *
 *     var foldable = ['a','b','c']
 *     var empty = '';
 *
 *     _.join(empty, foldable);  // 'abc'
 *
 *
 *     var Sum = _.productType('Sum', {value: _.Num});
 *     Sum.empty = _.always(Sum(0));
 *     Sum.concat = _.curry(function(left, right) {
 *         return Sum(left.value + right.value);
 *     });
 *
 *     _.join(Sum.empty(), [Sum(1),Sum(2),Sum(3)]); // Sum(6)
 */
Foldable.join2 = Foldable.foldMap2(_identity);

/**
 * Transforms a foldable structure into an array
 *
 * @sig Foldable f => f a -> Array a
 * @param {Foldable} foldable the structure being converted to an array
 * @return {Array}
 */
Foldable.toArray = Foldable.foldMap2(Arr.of, []);

/**
 * Counts the elements in a foldable value
 *
 * @since 0.5.0
 * @sig Foldable f => f -> Integer
 * @param {Foldable} foldable
 * @return {Number} The number of elements in the container
 * @example
 *
 *     _.Foldable.len([1,2,3]);  // 3
 *     _.Foldable.len('');       // 0
 */
Foldable.len = Foldable.foldl(function(count, x) {return count + 1;}, 0);

/**
 * Returns whether or not a foldable value is empty
 *
 * @since 0.5.0
 * @sig Foldable f => f -> Boolean
 * @param {Foldable} foldable
 * @returns {Boolean}
 *
 * @example
 *
 *      _.Foldable.isEmpty([1,2,3]);  // false
 *      _.Foldable.isEmpty('');       // true
 */
Foldable.isEmpty = _curry(function(foldable) { return Foldable.len(foldable) === 0});

/**
 * The inverse of Foldable.isEmpty function
 *
 * @since 0.5.0
 * @sig Foldable f => f -> Boolean
 * @param {Foldable} foldable
 * @returns {Boolean}
 *
 * @example
 *
 *      _.Foldable.isNotEmpty([1,2,3]);  // true
 *      _.Foldable.isNotEmpty('');       // false
 */
Foldable.isNotEmpty = _not(Foldable.isEmpty);

/**
 * Returns whether or not a foldable contains a value
 *
 * @since 0.5.0
 * @sig Foldable f => a -> f a -> Boolean
 * @param {*} search the value being searched for
 * @param {Foldable} foldable the value being searched
 * @returns {Boolean}
 * @example
 *
 *     var turduckin = ['turkey', 'duck', 'chicken']
 *     _.contains('duck', turduckin);    // true
 *     _.contains('pigeon', turduckin);  // false
 *
 *     _.contains([1,2,3], [[4,5,6], [7,8,9], [1,2,3]]); // true
 */
Foldable.contains = _curry(function(search, foldable) {
    return Foldable.foldl(function(accum, value) {
        return accum || _equal(search, value);
    }, false, foldable);
});

/**
 * Returns the inverse of whether or not a foldable contains a value
 *
 * @since 0.5.0
 * @sig Foldable f => a -> f a -> Boolean
 * @param {*} search the value being searched for
 * @param {Foldable} foldable the value being searched
 * @returns {Boolean}
 * @example
 *
 *     var turduckin = ['turkey', 'duck', 'chicken']
 *     _.contains('duck', turduckin);    // false
 *     _.contains('pigeon', turduckin);  // true
 *
 *     _.contains([1,2,3], [[4,5,6], [7,8,9], [1,2,3]]); // false
 *     _.contains([1,2,4], [[4,5,6], [7,8,9], [1,2,3]]); // true
 */
Foldable.notContains = _not(Foldable.contains);

/**
 * Returns true if all values in a foldable return true for some predicate function
 *
 * @since 0.5.0
 * @sig Foldable f => (a -> Boolean) -> f a -> Boolean
 * @param fn the function that will be tested against each value
 * @param foldable the structure being folded
 * @returns {Boolean}
 * @example
 *
 *     var test = v => return v > 1;
 *
 *     _.all(test, [2,3,4]);  // true
 *     _.all(test, [1,3,4]);  // false
 *     _.all(test, []);       // true
 */
Foldable.all = _curry(function(fn, foldable) {
    return Foldable.foldl(function(accum, v) {
        return accum && fn(v);
    }, true, foldable);
});

/**
 * Returns true if any values in a foldable return true for some predicate function
 *
 * @since 0.5.0
 * @sig Foldable f => (a -> Boolean) -> f a -> Boolean
 * @param fn the function that will be tested against each value
 * @param foldable the structure being folded
 * @returns {Boolean}
 * @example
 *
 *     var test = v => v < 1;
 *
 *     _.any(test, [2,3,4]);    // false
 *     _.any(test, [2,3,4,0]);  // true
 *     _.any(test, []);         // false
 */
Foldable.any = _curry(function(fn, foldable) {
    return Foldable.foldl(function(accum, v) {
        return accum || fn(v);
    }, false, foldable);
});

/**
 * Returns the number of elements in the structure that return true for a predicate.
 *
 * @since 0.5.0
 * @sig Foldable f => (a -> Boolean) -> f a -> Number
 * @param {Function} fn the function used to test each value
 * @param {Foldable} foldable the structure being tested
 * @return {Number} The number of elements that the predicate returned true for
 * @example
 *
 *      var arr = [1,1,2,3,4,4,5]
 *
 *      _.countWith(_.gt(_, 2), arr);  // 4
 */
Foldable.countWith = _curry(function(fn, foldable) {
    return Foldable.foldl(function(accum, value) {
        return fn(value) ? accum + 1 : accum;
    }, 0, foldable)
});

/**
 * Returns the number of elements in foldable which are equal to a given value.
 * @since 0.5.0
 * @sig (Foldable f, Eq e) => e -> f e -> Number
 * @param {Eq} v the value being counted in the structure
 * @param {Foldable} foldable the structure
 * @return {Number} The number of values in the structure equal to v
 * @example
 *
 *      var arr = [1,1,2,3,4,4,5]
 *
 *      _.count(4, arr);  // 2
 */
Foldable.count = _curry(function(v, foldable) {
    return Foldable.countWith(_equal(v), foldable);
});


var __fold1 = _curry(function(_fold, err, fn, foldable) {
    var NOTHING = {};
    var result = Foldable[_fold](function(accum, value) {
        if (accum === NOTHING) {
            return value;
        } else {
            return fn(accum, value);
        }
    }, NOTHING, foldable);

    if (result === NOTHING) {
        err();
    }

    return result;
});

var _fold1 = __fold1('foldl');

/**
 * Folds a non-empty structure without a base case from left to right.
 *
 * @sig Foldable f => (b -> a -> b) -> f a -> b
 * @param {Function} fn the function that will fold over the structure
 * @param {Foldable} foldable the structure being folded
 * @return {*}
 */
Foldable.foldl1 = __fold1(
    'foldl',
    _alwaysThrow(TypeError, 'Foldable#foldl1 can not be called on an empty structure')
);

/**
 * Folds a non-empty structure without a base case from right to left.
 *
 * @sig Foldable f => (b -> a -> b) -> f a -> b
 * @param {Function} fn the function that will fold over the structure
 * @param {Foldable} foldable the structure being folded
 * @return {*}
 */
Foldable.foldr1 = __fold1(
    'foldr',
    _alwaysThrow(TypeError, 'Foldable#foldr1 can not be called on an empty structure')
);

/**
 * Returns the maximum value in a non-empty structure
 *
 * @sig (Foldable f, Ord a) => f a -> a
 * @param {Foldable} foldable the structure the maximum value is being retrieved from
 * @return {Ord}
 */
Foldable.maximum = _fold1(
    _alwaysThrow(TypeError, 'Foldable#maximum can not be called on an empty structure'),
    Ord.max
);

/**
 * Returns the minimum value in a non-empty structure
 *
 * @sig (Foldable f, Ord a) => f a -> a
 * @param {Foldable} foldable the structure the minimum value is being retrieved from
 * @return {Ord}
 */
Foldable.minimum = _fold1(
    _alwaysThrow(TypeError, 'Foldable#minimum can not be called on an empty structure'),
    Ord.min
);

/**
 * Returns the accumulated sum of the values in a non-empty structure
 *
 * @sig (Foldable f, Numeric a) => f a -> a
 * @param {Foldable} foldable the structure being summed
 * @return {Numeric}
 */
Foldable.sum = _fold1(
    _alwaysThrow(TypeError, "Foldable#sum can not be called on an empty structure"),
    Numeric.add
);

/**
 * Returns the accumulated product of the values in a non-empty structure
 *
 * @sig (Foldable f, Numeric a) => f a -> a
 * @param {Foldable} foldable the structure being accumulated
 * @return {Numeric}
 */
Foldable.product = _fold1(
    _alwaysThrow(TypeError, "Foldable#mul can not be called on an empty structure"),
    Numeric.mul
);

Foldable.member = function(value) {
    var M = _moduleFor(value);
    return _isFunction(M.foldl) && _isFunction(M.foldr);
};





