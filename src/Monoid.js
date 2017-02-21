const _curry = require('./internal/_curry');
const _isFunction = require('./internal/_isFunction');
const _equal = require('./internal/_equal');
const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');

const Semigroup = require('./Semigroup');

const Monoid = {name: 'Monoid'};

const monoidForModule = _typecached(M => {
    if (!Monoid.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Monoid`);
    }

    const _Monoid = {};

    _Monoid.empty = M.empty;
    _Monoid.isEmpty = _isFunction(M.isEmpty)
        ? M.isEmpty
        : _curry(v => _equal(_Monoid.empty(), v))
    ;

    _Monoid.isNotEmpty = _isFunction(M.isNotEmpty)
        ? M.isNotEmpty
        : _curry(v => !_Monoid.isEmpty(v))
    ;

    _Monoid.cycleN = _isFunction(M.cycleN)
        ? M.cycleN
        : _curry((n, monoid) => {
            let res = _Monoid.empty();
            while (n > 0) {
                res = M.concat(res, monoid);
                n -= 1;
            }
            return res;
        })
    ;

    return _Monoid;
});

const monoidForModulePrototype = _typecached(M => {
    const methods = monoidForModule(M);

    return {
        empty: methods.empty,
        isEmpty: _thisify(methods.isEmpty),
        isNotEmpty: _thisify(methods.isNotEmpty),
        cycleN: _thisify(methods.cycleN),
    };
});

/**
 * Returns the empty value for the type of value.
 *
 * A monoid should obey the law for all values a: _.concat(_.empty(a), a) is equal to _.concat(a, _.empty(a)) is equal to a
 *
 * @sig Monoid m => m -> m
 * @since 0.4.0
 * @param {Monoid} value
 * @returns {Monoid} the empty value for the type
 * @example
 *
 *      _.empty([1,2,3]); // []
 */
Monoid.empty = _curryN(1, typeclass.forward('empty', monoidForModule));

/**
 * Returns true if the value is equal to the empty value for the type
 *
 * @sig Monoid m => m -> Boolean
 * @since 0.4.0
 * @param {Monoid} value the monoid being checked
 * @returns {Boolean}
 * @example
 *
 *      _.isEmpty([]);      // true
 *      _.isEmpty([1,2,3]); // false
 *      _.isEmpty('');      // true
 *      _.isEmpty('abc');   // false
 */
Monoid.isEmpty = _curryN(1, typeclass.forward('isEmpty', monoidForModule));

/**
 * Returns true if the value is not equal to the empty value for the type
 *
 * @sig Monoid m => m -> Boolean
 * @since 0.4.0
 * @param {Monoid} value the monoid being checked
 * @returns {Boolean}
 * @example
 *
 *      _.isNotEmpty([]);      // false
 *      _.isNotEmpty([1,2,3]); // true
 *      _.isNotEmpty('');      // false
 *      _.isNotEmpty('abc');   // true
 */
Monoid.isNotEmpty = _curryN(1, typeclass.forward('isNotEmpty', monoidForModule));

/**
 * Concats a monoid to itself a specified number of times
 *
 * @sig Monoid m => Number -> m -> m
 * @since 0.5.0
 * @param {Number} n the number of times to repeat the monoid
 * @param {Monoid} monoid the monoid being repeatedly concatenated
 * @returns {Monoid} monoid repeated n number of times
 * @example
 *
 *      _.cycleN(4, [1,2]);    // [1,2,1,2,1,2,1,2]
 *      _.cycleN(3, 'ABC');    // 'ABCABCABC'
 */
Monoid.cycleN = _curryN(2, typeclass.forward('cycleN', monoidForModule));

Monoid.concat = Semigroup.concat;
Monoid.concatAll = Semigroup.concatAll;

module.exports = typeclass(Monoid, {
    deriveFn: monoidForModule,
    deriveProtoFn: monoidForModulePrototype,
    required: ['empty'],
    superTypes: [Semigroup],
});
