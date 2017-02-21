const _isFunction = require('./internal/_isFunction');
const _curry = require('./internal/_curry');
const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');
const Int = require('./internal/_primitives').Integer;

const Enum = {name: 'Enum'};

const enumForModule = _typecached((M) => {
    if (!Enum.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Enum`);
    }

    const _Enum = {};

    _Enum.toInt = M.toInt;
    _Enum.fromInt = M.fromInt;

    _Enum.prev = _isFunction(M.prev)
        ? M.prev
        : _curry((v) => _Enum.fromInt(_Enum.toInt(v) - 1))
    ;

    _Enum.next = _isFunction(M.next)
        ? M.next
        : _curry((v) => _Enum.fromInt(_Enum.toInt(v) + 1))
    ;

    const _makeEnumeration = function(withLast, step, fromVal, toVal) {
        const res = [];

        const _fromInt = _Enum.fromInt;

        while (fromVal != toVal) {
            res.push(_fromInt(fromVal));
            fromVal = step(fromVal);
        }
        if (withLast) {
            res.push(_fromInt(fromVal));
        }

        return res;
    };

    const _enumerate = _curry(function(withLast, from, to) {
        const fromVal = _Enum.toInt(from);
        const toVal = _Enum.toInt(to);

        const step = toVal < fromVal ? Int.add(-1) : Int.add(1);

        return _makeEnumeration(withLast, step, fromVal, toVal);
    });

    _Enum.enumTo = _isFunction(M.enumTo)
        ? M.enumTo
        : _enumerate(true)
    ;

    _Enum.enumUntil = _isFunction(M.enumUntil)
        ? M.enumUntil
        : _enumerate(false)
    ;

    _Enum.enumFrom = _isFunction(M.enumFrom)
        ? M.enumFrom
        : _curry((count, from) => {
            if (!Int.member(count)) {
                throw new TypeError('enumFrom must have an integer for the count parameter');
            }

            const fromVal = _Enum.toInt(from);
            const toVal = fromVal + count;

            const step = toVal < fromVal ? Int.add(-1)  : Int.add(1);

            return _makeEnumeration(false, step, fromVal, toVal);
        })
    ;

    return _Enum;
});

const enumForModulePrototype = _typecached(M => {
    const methods = enumForModule(M);

    return {
        toInt: _thisify(methods.toInt),
        prev: _thisify(methods.prev),
        next: _thisify(methods.next),
        enumTo: _thisify(methods.enumTo),
        enumUntil: _thisify(methods.enumUntil),
        enumFrom: _thisify(methods.enumFrom),
    };
});

/**
 * Converts a value to its representation as an integer.
 *
 * This function must be implemented for the value.
 *
 * @sig Enum e => e -> Integer
 * @since 0.4.0
 * @param {Enum} value
 * @returns {Number}
 * @example
 *
 *      _.toInt(true);  // 1
 *      _.toInt(_.LT);  // -1
 *      _.toInt('A');   // 65, the char code value
 */
Enum.toInt = _curryN(1, typeclass.forward('toInt', enumForModule));

/**
 * Returns the previous value of the one given.
 *
 * @sig Enum e => e -> e
 * @since 0.4.0
 * @param {Enum} value
 * @returns {Enum}
 * @example
 *
 *      _.prev(true); // false
 *      _.prev('B');  // 'A'
 *
 */
Enum.prev = _curryN(1, typeclass.forward('prev', enumForModule));

/**
 * Returns the next value of the one given.
 *
 * @sig Enum e => e -> e
 * @since 0.4.0
 * @param {Enum} value
 * @returns {Enum}
 * @example
 *
 *      _.next(false); // true
 *      _.prev('B');  // 'C'
 *
 */
Enum.next = _curryN(1, typeclass.forward('next', enumForModule));

/**
 * Creates a range of values from the starting value up to and including the ending value.
 *
 * If the starting value is greater than the ending value according to its integral representation,
 * the range will increment negatively.  Otherwise it will increment positively.
 *
 * @sig Enum e => e -> e -> Array e
 * @since 0.4.0
 * @param {Enum} from the starting value
 * @param {Enum} to the ending value
 * @return {Array}
 * @example
 *
 *      _.enumTo('A','D'); // ['A','B','C','D']
 *      _.enumTo(6,2);     // [6,5,4,3,2]
 *
 */
Enum.enumTo = _curryN(2, typeclass.forward('enumTo', enumForModule));

/**
 * Creates a range of values from the starting value up to but not including the ending value.
 *
 * If the starting value is greater than the ending value according to its integral representation,
 * the range will increment negatively.  Otherwise it will increment positively.
 *
 * @sig Enum e => e -> e -> Array e
 * @since 0.4.0
 * @param {Enum} from the starting value
 * @param {Enum} to the ending value
 * @return {Array}
 * @example
 *
 *      _.enumTo('A','D'); // ['A','B','C']
 *      _.enumTo(6,2);     // [6,5,4,3]
 *
 */
Enum.enumUntil = _curryN(2, typeclass.forward('enumUntil', enumForModule));

/**
 * Creates a range of values from the starting value with a specified number of elements
 *
 * If count is less than one, the range will step downward, otherwise it will step upward.
 *
 * @sig Enum e => Integer -> e -> Array e
 * @since 0.4.0
 * @param {Number} count the starting value
 * @param {Enum} from the starting value
 * @return {Array}
 * @example
 *
 *      _.enumFrom(3, 'A');    // ['A','B','C']
 *      _.enumFrom(-4, 6);     // [6,5,4,3]
 *
 */
Enum.enumFrom = _curryN(2, typeclass.forward('enumFrom', enumForModule));

module.exports = typeclass(Enum, {
    deriveFn: enumForModule,
    deriveProtoFn: enumForModulePrototype,
    required: ['toInt', 'fromInt'],
    superTypes: [],
});
