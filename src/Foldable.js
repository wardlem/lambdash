const _curry = require('./internal/_curry');
const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _isFunction = require('./internal/_isFunction');
const _equal = require('./internal/_equal');
const _identity = require('./internal/_identity');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');

const Foldable = {name: 'Foldable'};

const foldableForModule = _typecached(M => {
    const Ord = require('./Ord');
    const Monoid = require('./Monoid');
    const Numeric = require('./Numeric');

    if (!Foldable.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Foldable`);
    }

    const _Foldable = {};

    _Foldable.foldl = M.foldl;
    _Foldable.foldr = M.foldr;

    const EMPTY = Symbol();

    _Foldable.foldMap = _isFunction(M.foldMap)
        ? M.foldMap
        : _curry((fn, foldable) => {
            const result = _Foldable.foldr(function(accum, value) {
                if (accum === EMPTY) {
                    return fn(value);
                }
                return Monoid.concat(fn(value), accum);
            }, EMPTY, foldable);

            if (result === EMPTY) {
                throw new TypeError('foldMap can not called on an empty structure');
            }

            return result;
        })
    ;

    _Foldable.foldMapDef = _isFunction(M.foldMapDef)
        ? M.foldMapDef
        : _curry((fn, empty, foldable) => _Foldable.foldr((accum, value) => {
            return Monoid.concat(fn(value), accum);
        }, empty, foldable))
    ;

    _Foldable.join = _isFunction(M.join)
        ? M.join
        : _Foldable.foldMap(_identity)
    ;

    _Foldable.joinWith = _isFunction(M.joinWith)
        ? M.join
        : _curry((sep, foldable) => {
            let ind = 0;
            return _Foldable.foldMap(function(v) {
                if (ind === 0) {
                    ind += 1;
                    return v;
                } else {
                    return Monoid.concat(v,sep);
                }
            }, foldable);
        })
    ;

    _Foldable.joinDef = _isFunction(M.joinDef)
        ? M.joinDef
        : _Foldable.foldMapDef(_identity)
    ;

    _Foldable.joinWithDef = _isFunction(M.joinWithDef)
        ? M.joinWithDef
        : _curry((empty, sep, foldable) => {
            let ind = 0;
            return _Foldable.foldMapDef(function(v) {
                if (ind === 0) {
                    ind += 1;
                    return v;
                } else {
                    return Monoid.concat(v,sep);
                }
            }, empty, foldable);
        })
    ;

    _Foldable.toArray = _isFunction(M.toArray)
        ? M.toArray
        : _Foldable.foldMapDef((v) => [v], Object.freeze([]))
    ;

    _Foldable.len = _isFunction(M.len)
        ? M.len
        : _Foldable.foldl((count, x) => count + 1, 0)
    ;

    _Foldable.isEmpty = _isFunction(M.isEmpty)
        ? M.isEmpty
        : _curry(foldable => _Foldable.len(foldable) === 0)
    ;

    _Foldable.isNotEmpty = _isFunction(M.isNotEmpty)
        ? M.isNotEmpty
        : _curry(foldable => _Foldable.len(foldable) !== 0)
    ;

    _Foldable.contains = _isFunction(M.contains)
        ? M.contains
        : _curry((search, foldable) => _Foldable.foldl(
            (accum, value) => accum || _equal(search, value),
            false,
            foldable
        ))
    ;

    _Foldable.notContains = _isFunction(M.notContains)
        ? M.notContains
        : _curry((search, foldable) => !_Foldable.contains(search, foldable))
    ;

    _Foldable.all = _isFunction(M.all)
        ? M.all
        : _curry((fn, foldable) => _Foldable.foldl((accum, v) => {
            return accum && fn(v);
        }, true, foldable))
    ;

    _Foldable.any = _isFunction(M.any)
        ? M.any
        : _curry((fn, foldable) => _Foldable.foldl((accum, v) => {
            return accum || fn(v);
        }, false, foldable))
    ;

    _Foldable.countWith = _isFunction(M.countWith)
        ? M.countWith
        : _curry((fn, foldable) => _Foldable.foldl((accum, value) => {
            return fn(value) ? accum + 1 : accum;
        }, 0, foldable))
    ;

    _Foldable.count = _isFunction(M.count)
        ? M.count
        : _curry((v, foldable) => _Foldable.countWith(_equal(v), foldable))
    ;

    _Foldable.foldl1 = _isFunction(M.foldl1)
        ? M.foldl1
        : _curry((fn, foldable) => {
            const result = _Foldable.foldl((accum, value) => {
                return accum === EMPTY ? value : fn(accum, value);
            }, EMPTY, foldable);

            if (result === EMPTY) {
                throw new TypeError('foldl1 cannot be called with an empty structure');
            }

            return result;
        })
    ;

    _Foldable.foldr1 = _isFunction(M.foldr1)
        ? M.foldr1
        : _curry((fn, foldable) => {
            const result = _Foldable.foldr((accum, value) => {
                return accum === EMPTY ? value : fn(accum, value);
            }, EMPTY, foldable);

            if (result === EMPTY) {
                throw new TypeError('foldr1 cannot be called with an empty structure');
            }

            return result;
        })
    ;

    _Foldable.maximum = _isFunction(M.maximum)
        ? M.maximum
        : _Foldable.foldl1(Ord.max)
    ;

    _Foldable.minimum = _isFunction(M.minimum)
        ? M.minimum
        : _Foldable.foldl1(Ord.min)
    ;

    _Foldable.sum = _isFunction(M.sum)
        ? M.sum
        : _Foldable.foldl1(Numeric.add)
    ;

    _Foldable.product = _isFunction(M.product)
        ? M.product
        : _Foldable.foldl1(Numeric.mul)
    ;

    return _Foldable;
});

const foldableForModulePrototype = _typecached((M) => {
    const methods = foldableForModule(M);

    return Object.keys(methods).reduce((res, key) => {
        res[key] = _thisify(methods[key]);
        return res;
    }, {});
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
Foldable.foldl = _curryN(3, typeclass.forward('foldl', foldableForModule));


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
Foldable.foldr = _curryN(3, typeclass.forward('foldr', foldableForModule));

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
 *     const foldable = [1,2,3]
 *     const fn = n => String(n + 1)
 *
 *     _.foldMap(fn, foldable);  // '234'
 *
 *
 *     const Sum = _.productType('Sum', {value: _.Num});
 *     Sum.concat = _.curry(function(left, right) {
 *         return Sum(left.value + right.value);
 *     });
 *
 *     _.foldMap(Sum, [1,2,3]); // Sum(6)
 */
Foldable.foldMap = _curryN(2, typeclass.forward('foldMap', foldableForModule));

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
 *     const foldable = [1,2,3]
 *     const fn = n => return String(n + 1)
 *     const empty = '';
 *
 *     _.foldMapDef(fn, empty, foldable);  // '234'
 *
 *
 *     const Sum = _.productType('Sum', {value: _.Num});
 *     Sum.empty = _.always(Sum(0));
 *     Sum.concat = _.curry(function(left, right) {
 *         return Sum(left.value + right.value);
 *     });
 *
 *     _.foldMapDef(Sum, Sum.empty(), [1,2,3]); // Sum(6)
 */
Foldable.foldMapDef = _curryN(3, typeclass.forward('foldMapDef', foldableForModule));

/**
 * Folds a container, accumulating the result in a monoid
 *
 * Corresponds to Haskell's `fold`
 *
 * This function will throw an exception if the Foldable container is empty.
 *
 * @since 0.5.0
 * @sig (Foldable f, Monoid m) => f m -> m
 * @param {Foldable} foldable the container being folded
 * @return {Monoid} the concatenated result of the fold
 * @example
 *
 *     const foldable = ['a','b','c']
 *     const empty = '';
 *
 *     _.join(foldable);  // 'abc'
 *
 *
 *     const Sum = _.productType('Sum', {value: _.Num});
 *     Sum.empty = _.always(Sum(0));
 *     Sum.concat = _.curry(function(left, right) {
 *         return Sum(left.value + right.value);
 *     });
 *
 *     _.join([Sum(1),Sum(2),Sum(3)]); // Sum(6)
 */
Foldable.join = _curryN(1, typeclass.forward('join', foldableForModule));

/**
 * Joins a monad with a separator.
 *
 * This function will throw an exception with the collection is empty.
 *
 * @since 0.6.0
 * @sig (Foldable f, Monoid m) => m -> f m -> m
 * @param {Monoid} sep the separator to join the values with
 * @param {Foldable} foldable a collection of monoids
 * @returns {Monoid}
 * @example
 *
 *      _.joinWith(',', ['first', 'second', 'third']); // 'first,second,third'
 */
Foldable.joinWith = _curryN(2, typeclass.forward('joinWith', foldableForModule));

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
 *     const foldable = ['a','b','c']
 *     const empty = '';
 *
 *     _.joinDef(empty, foldable);  // 'abc'
 *
 *
 *     const Sum = _.productType('Sum', {value: _.Num});
 *     Sum.empty = _.always(Sum(0));
 *     Sum.concat = _.curry(function(left, right) {
 *         return Sum(left.value + right.value);
 *     });
 *
 *     _.joinDef(Sum.empty(), [Sum(1),Sum(2),Sum(3)]); // Sum(6)
 */
Foldable.joinDef = _curryN(2, typeclass.forward('joinDef', foldableForModule));

/**
 * Joins a monad with a separator.
 *
 * This function is like joinWith except that it accepts an empty value
 * to prevent throwing an exception.
 *
 * @since 0.6.0
 * @sig (Foldable f, Monoid m) => m -> f m -> m
 * @param {Monoid} empty the empty value for
 * @param {Monoid} sep the separator to join the values with
 * @param {Foldable} foldable a collection of monoids
 * @returns {Monoid}
 * @example
 *
 *      _.joinWith2(',', '', ['first', 'second', 'third']); // 'first,second,third'
 *      _.joinWith2(',', '', []);                           // ''
 */
Foldable.joinWithDef = _curryN(3, typeclass.forward('joinWithDef', foldableForModule));

/**
 * Transforms a foldable structure into an array
 *
 * @sig Foldable f => f a -> Array a
 * @param {Foldable} foldable the structure being converted to an array
 * @return {Array}
 */
Foldable.toArray = _curryN(1, typeclass.forward('toArray', foldableForModule));

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
Foldable.len = _curryN(1, typeclass.forward('len', foldableForModule));

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
Foldable.isEmpty = _curryN(1, typeclass.forward('isEmpty', foldableForModule));

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
Foldable.isNotEmpty = _curryN(1, typeclass.forward('isNotEmpty', foldableForModule));

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
 *     const turduckin = ['turkey', 'duck', 'chicken']
 *     _.contains('duck', turduckin);    // true
 *     _.contains('pigeon', turduckin);  // false
 *
 *     _.contains([1,2,3], [[4,5,6], [7,8,9], [1,2,3]]); // true
 */
Foldable.contains = _curryN(2, typeclass.forward('contains', foldableForModule));

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
 *     const turduckin = ['turkey', 'duck', 'chicken']
 *     _.notContains('duck', turduckin);    // false
 *     _.notContains('pigeon', turduckin);  // true
 *
 *     _.notContains([1,2,3], [[4,5,6], [7,8,9], [1,2,3]]); // false
 *     _.notContains([1,2,4], [[4,5,6], [7,8,9], [1,2,3]]); // true
 */
Foldable.notContains = _curryN(2, typeclass.forward('notContains', foldableForModule));

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
 *     const test = v => return v > 1;
 *
 *     _.all(test, [2,3,4]);  // true
 *     _.all(test, [1,3,4]);  // false
 *     _.all(test, []);       // true
 */
Foldable.all = _curryN(2, typeclass.forward('all', foldableForModule));

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
 *     const test = v => v < 1;
 *
 *     _.any(test, [2,3,4]);    // false
 *     _.any(test, [2,3,4,0]);  // true
 *     _.any(test, []);         // false
 */
Foldable.any = _curryN(2, typeclass.forward('any', foldableForModule));

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
 *      const arr = [1,1,2,3,4,4,5]
 *
 *      _.countWith(_.gt(_, 2), arr);  // 4
 */
Foldable.countWith = _curryN(2, typeclass.forward('countWith', foldableForModule));

/**
 * Returns the number of elements in foldable which are equal to a given value.
 *
 * @since 0.5.0
 * @sig (Foldable f, Eq e) => e -> f e -> Number
 * @param {Eq} v the value being counted in the structure
 * @param {Foldable} foldable the structure
 * @return {Number} The number of values in the structure equal to v
 * @example
 *
 *      const arr = [1,1,2,3,4,4,5]
 *
 *      _.count(4, arr);  // 2
 */
Foldable.count = _curryN(2, typeclass.forward('count', foldableForModule));

/**
 * Folds a non-empty structure without a base case from left to right.
 *
 * @sig Foldable f => (b -> a -> b) -> f a -> b
 * @param {Function} fn the function that will fold over the structure
 * @param {Foldable} foldable the structure being folded
 * @return {*}
 */
Foldable.foldl1 = _curryN(2, typeclass.forward('foldl1', foldableForModule));

/**
 * Folds a non-empty structure without a base case from right to left.
 *
 * @sig Foldable f => (b -> a -> b) -> f a -> b
 * @param {Function} fn the function that will fold over the structure
 * @param {Foldable} foldable the structure being folded
 * @return {*}
 */
Foldable.foldr1 = _curryN(2, typeclass.forward('foldr1', foldableForModule));

/**
 * Returns the maximum value in a non-empty structure
 *
 * @sig (Foldable f, Ord a) => f a -> a
 * @param {Foldable} foldable the structure the maximum value is being retrieved from
 * @return {Ord}
 */
Foldable.maximum = _curryN(1, typeclass.forward('maximum', foldableForModule));

/**
 * Returns the minimum value in a non-empty structure
 *
 * @sig (Foldable f, Ord a) => f a -> a
 * @param {Foldable} foldable the structure the minimum value is being retrieved from
 * @return {Ord}
 */
Foldable.minimum = _curryN(1, typeclass.forward('minimum', foldableForModule));

/**
 * Returns the accumulated sum of the values in a non-empty structure
 *
 * @sig (Foldable f, Numeric a) => f a -> a
 * @param {Foldable} foldable the structure being summed
 * @return {Numeric}
 */
Foldable.sum = _curryN(1, typeclass.forward('sum', foldableForModule));

/**
 * Returns the accumulated product of the values in a non-empty structure
 *
 * @sig (Foldable f, Numeric a) => f a -> a
 * @param {Foldable} foldable the structure being accumulated
 * @return {Numeric}
 */
Foldable.product = _curryN(1, typeclass.forward('product', foldableForModule));

module.exports = typeclass(Foldable, {
    deriveFn: foldableForModule,
    deriveProtoFn: foldableForModulePrototype,
    required: ['foldl', 'foldr'],
    superTypes: [],
});
