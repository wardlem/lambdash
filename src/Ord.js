const _curry = require('./internal/_curry');
const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');
const _flip = require('./internal/_flip');
const _isFunction = require('./internal/_isFunction');
const _compose = require('./internal/_compose');
const _not = require('./internal/_not');

const Eq = require('./Eq');
const Ordering = require('./Ordering');


const Ord = {name: 'Ord'};

Ord.eq = Eq.eq;

const ordForModule = _typecached((M) => {
    if (!Ord.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Ord`);
    }

    const _Ord = {};

    _Ord.compare = M.compare;
    _Ord.gt = _isFunction(M.gt)
        ? M.gt
        : _compose(Ordering.isGT, _Ord.compare)
    ;

    _Ord.lt = _isFunction(M.lt)
        ? M.lt
        : _compose(Ordering.isLT, _Ord.compare)
    ;

    _Ord.gte = _isFunction(M.gte)
        ? M.gte
        : _not(_Ord.lt)
    ;

    _Ord.lte = _isFunction(M.lte)
        ? M.lte
        : _not(_Ord.gt)
    ;

    _Ord.min = _isFunction(M.min)
        ? M.min
        : _curry((left, right) => Ord.lte(left, right) ? left : right)
    ;

    _Ord.max = _isFunction(M.max)
        ? M.max
        : _curry((left, right) => Ord.gte(left, right) ? left : right)
    ;

    return _Ord;
});

const ordForModulePrototype = _typecached((M) => {
    const methods = ordForModule(M);

    return {
        compare: _thisify(_flip(methods.compare)),
        gt: _thisify(_flip(methods.gt)),
        lt: _thisify(_flip(methods.lt)),
        gte: _thisify(_flip(methods.gte)),
        lte: _thisify(_flip(methods.lte)),
        min: _thisify(_flip(methods.min)),
        max: _thisify(_flip(methods.max)),
    };
});

/**
 * Compares two values of the same type.
 *
 * This function is part of the Ord interface and must be implemented for
 * the values upon which the function is called.
 *
 * The implementation function must return _.LT if the left value is less than the right,
 * _.GT if the left value is greater than the right, or _.EQ if the values are structurally equal.
 *
 * @sig Ord a => a -> a -> Ordering
 * @since 0.4.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the second value being compared
 * @return {Ordering} the result of the comparison between the values
 * @example
 *
 *      _.compare(1,2);  // _.LT
 *      _.compare(2,1);  // _.GT
 *      _.compare(2,2);  // _.EQ
 *
 *      _.compare([1,2,3], [1,2,5]); // _.LT
 *      _.compare([1,2,3], [1,2,3]); // _.EQ
 *
 *      _.compare('CAB')('CAR');    // _.LT
 *
 */
Ord.compare = _curryN(2, typeclass.forward('compare', ordForModule));


/**
 * Returns true if the left value is greater than the right value
 *
 * @sig Ord a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the second value being compared
 * @return {Boolean} True if left is greater than the right
 * @example
 *
 *      _.gt(1,2);  // false
 *      _.gt(2,1);  // true
 *      _.gt(2,2);  // false
 */
Ord.gt = _curryN(2, typeclass.forward('gt', ordForModule));

/**
 * Returns true if the left value is less than the right value
 *
 * @sig Ord a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the second value being compared
 * @return {Boolean} True if left is less than the right
 * @example
 *
 *      _.lt(1,2);  // true
 *      _.lt(2,1);  // false
 *      _.lt(2,2);  // false
 */
Ord.lt = _curryN(2, typeclass.forward('lt', ordForModule));

/**
 * Returns true if the left value is greater than or equal to the right value
 *
 * It is the inverse of Ord.lt
 *
 * @sig Ord a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the second value being compared
 * @return {Boolean} True if left is not less than the right
 * @example
 *
 *      _.gte(1,2);  // false
 *      _.gte(2,1);  // true
 *      _.gte(2,2);  // true
 */
Ord.gte = _curryN(2, typeclass.forward('gte', ordForModule));

/**
 * Returns true if the left value is less than or equal to the right value
 *
 * It is the inverse of Ord.gt
 *
 * @sig Ord a => a -> a -> Boolean
 * @since 0.5.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the second value being compared
 * @return {Boolean} True if left is not greater than the right
 * @example
 *
 *      _.lte(1,2);  // true
 *      _.lte(2,1);  // false
 *      _.lte(2,2);  // true
 */
Ord.lte = _curryN(2, typeclass.forward('lte', ordForModule));

/**
 * Returns the lesser of two comparable values
 *
 * If the values are equal, the left value is returned
 *
 * @sig Ord a => a -> a -> a
 * @since 0.4.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the right value being compared
 * @return {Ord} the lesser of the two values
 * @example
 *
 *      _.min(1,2);  // 1
 *      _.min("car", "cab"); // "cab"
 */
Ord.min = _curryN(2, typeclass.forward('min', ordForModule));

/**
 * Returns the greater of two comparable values
 *
 * If the values are equal, the left value is returned
 *
 * @sig Ord a => a -> a -> a
 * @since 0.4.0
 * @param {Ord} left the first value being compared
 * @param {Ord} right the right value being compared
 * @return {Ord} the greater of the two values
 * @example
 *
 *      _.max(1,2);  // 2
 *      _.max("car", "cab"); // "car"
 */
Ord.max = _curryN(2, typeclass.forward('max', ordForModule));


module.exports = typeclass(Ord, {
    deriveFn: ordForModule,
    deriveProtoFn: ordForModulePrototype,
    required: ['compare'],
    superTypes: [Eq],
});
