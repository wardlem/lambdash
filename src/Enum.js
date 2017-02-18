var _moduleFor = require('./internal/_moduleFor');
var _isFunction = require('./internal/_isFunction');
var _curry = require('./internal/_curry');
var Int = require('./internal/_primitives').Integer;

var Enum = module.exports;

var fromInt = _curry(function fromInt(M, value) {
    if (!_isFunction(M.fromInt)) {
        throw new TypeError('Type can not be converted from Int');
    }

    return M.fromInt(value);
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
Enum.toInt = _curry(function toInt(value) {
    var M = _moduleFor(value);
    if (_isFunction(M.toInt)) {
        return M.toInt(value);
    }

    throw new TypeError('Enum#toInt called on a value that does not implement Enum');
});

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
Enum.prev = _curry(function(value) {
    return fromInt(_moduleFor(value), Enum.toInt(value) - 1);
});

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
Enum.next = _curry(function(value) {
    return fromInt(_moduleFor(value), Enum.toInt(value) + 1);
});


var _makeEnum = function(withLast, M, step, fromVal, toVal) {
    var res = [];

    var _fromInt = fromInt(M);

    while (fromVal != toVal) {
        res.push(_fromInt(fromVal));
        fromVal = step(fromVal);
    }
    if (withLast) {
        res.push(_fromInt(fromVal));
    }

    return res;
};

var _enum = _curry(function(withLast, from, to) {
    var fromVal = Enum.toInt(from);
    var toVal = Enum.toInt(to);

    var step = toVal < fromVal ? Int.add(-1)  : Int.add(1);

    return _makeEnum(withLast, _moduleFor(from), step, fromVal, toVal);
});

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
Enum.enumTo = _enum(true);

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
Enum.enumUntil = _enum(false);

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
Enum.enumFrom = _curry(function(count, from) {

    if (!Int.member(count)) {
        throw new TypeError('Enum#enumFrom must have an integer for the count parameter');
    }

    var fromVal = Enum.toInt(from);
    var toVal = fromVal + count;

    var step = toVal < fromVal ? Int.add(-1)  : Int.add(1);

    return _makeEnum(false, _moduleFor(from), step, fromVal, toVal);
});

Enum.member = function(value) {
    var M = _moduleFor(value);
    return _isFunction(M.toInt) && _isFunction(M.fromInt);
};
