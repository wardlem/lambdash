var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _moduleFor = require('./internal/_moduleFor');
var _flip = require('./internal/_flip');

var Num = require('./Num');

var Numeric = module.exports;

var _binOp = _curry(function(op, a, b) {
    if (a == null || b == null) {
        throw new TypeError('Numeric#' + op + ' can not operate on null or undefined values');
    }

    var M = _moduleFor(a);
    if (_isFunction(M[op])) {
        return M[op](a, b);
    }

    return M.fromNum(Num[op](M.toNum(a), M.toNum(b)));
});

var _unaryOp = _curry(function(op, a) {
    if (a == null) {
        throw new TypeError('Numeric#' + op + ' can not operate on null or undefined values');
    }

    var M = _moduleFor(a);
    if (_isFunction(M[op])) {
        return M[op](a);
    }

    return M.fromNum(Num[op](M.toNum(a)));
});

/**
 * Converts a numeric value to a plain old javascript number
 *
 * This function along with fromNum must be provided by the type to implement the Numeric interface.
 *
 * @sig Numeric n => n -> Number
 * @since 0.4.0
 * @param numeric the value being converted to a number
 * @return {Number}
 */
Numeric.toNum = _unaryOp('toNum');

/**
 * Sums two numeric values together
 *
 * This function can be derived, though it is recommended that the type provides an optimized version.
 *
 * @sig Numeric n => n -> n -> n
 * @since 0.4.0
 * @param first one of the values being summed
 * @param second the other value being summed
 * @return {Numeric}
 * @example
 *
 *      _.add(1,2);  // 3
 *      _.add(1)(2); // 3
 *
 */
Numeric.add = _binOp('add');

/**
 * Returns the difference between two numbers
 *
 * This function can be derived, though it is recommended that the type provides an optimized version.
 *
 * @sig Numeric n => n -> n -> n
 * @since 0.4.0
 * @param first the value the difference is taken from
 * @param second the value taken away from first
 * @return {Numeric}
 * @example
 *
 *      _.sub(1,2);  // -1
 *      _.sub(1)(2); // -1
 *
 */
Numeric.sub = _binOp('sub');

/**
 * Returns the difference between two numbers
 *
 * This is the same Numeric.sub, but with the arguments flipped.
 *
 * @sig Numeric n => n -> n -> n
 * @since 0.4.0
 * @param first the value taken away from second
 * @param second the value the difference is taken from
 * @return {Numeric}
 * @example
 *
 *      _.subBy(1,2);  // 1
 *      _.subBy(1)(2); // 1
 *
 */
Numeric.subBy = _flip(Numeric.sub);

/**
 * Returns the product of two numeric values.
 *
 * This function can be derived, though it is recommended that the type provides an optimized version.
 *
 * @sig Numeric n => n -> n -> n
 * @since 0.4.0
 * @param first one of the values being multiplied
 * @param second the other value being multiplied
 * @return {Numeric}
 * @example
 *
 *      _.mul(1,2);  // 2
 *      _.mul(1)(2); // 2
 *
 */
Numeric.mul = _binOp('mul');

/**
 * Returns the quotient of two values
 *
 * This function can be derived, though it is recommended that the type provides an optimized version.
 *
 * @sig Numeric n => n -> n -> n
 * @since 0.4.0
 * @param first the numerator
 * @param second the denominator
 * @return {Numeric}
 * @example
 *
 *      _.div(1,2);  // 0.5
 *      _.div(1)(2); // 0.5
 *
 */
Numeric.div = _binOp('div');

/**
 * Returns the quotient of two values
 *
 * It is the same as div but with the arguments flipped.
 *
 * @sig Numeric n => n -> n -> n
 * @since 0.4.0
 * @param first the denominator
 * @param second the numerator
 * @return {Numeric}
 * @example
 *
 *      _.div(1,2);  // 2
 *      _.div(1)(2); // 2
 *
 */
Numeric.divBy = _flip(Numeric.div);

/**
 * Returns the modulus or remainder of the division of two numeric values.
 *
 * This function can be derived, though it is recommended that the type provide an optimized version.
 *
 * @sig Numeric n => n -> n -> n
 * @since 0.4.0
 * @param first the denominator
 * @param second the numerator
 * @return {Numeric}
 * @example
 *
 *      _.mod(13,3);  // 1
 *      _.mod(13)(3); // 1
 */
Numeric.mod = _binOp('mod');

/**
 * Returns the modulus or remainder of the division of two numeric values.
 *
 * This is the same as Numeric.mod but with the arguments flipped.
 *
 * @sig Numeric n => n -> n -> n
 * @since 0.4.0
 * @param first the denominator
 * @param second the numerator
 * @return {Numeric}
 * @example
 *
 *      _.modBy(3,13);  // 1
 *      _.modBy(3)(13); // 1
 */
Numeric.modBy = _flip(Numeric.mod);

/**
 * Returns the absolute value of a numeric value.
 *
 * This function can be derived, though it is recommended that the type provide an optimized version.
 *
 * The following law should be satisfied for all n: _.mul(_.abs(n), _.sign(n)) is equal to n
 *
 * @sig Numeric n => n -> n
 * @since 0.4.0
 * @param numeric the value being converted to its absolute value
 * @return {Numeric}
 * @example
 *
 *      _.abs(3);  // 3
 *      _.abs(-3); // 3
 */
Numeric.abs = _unaryOp('abs');

/**
 * Returns the sign of a numeric value.
 *
 * This function can be derived, though it is recommended that the type provide an optimized version.
 *
 * The following law should be satisfied for all n: _.mul(_.abs(n), _.sign(n)) is equal to n
 *
 * For every type T that implements numeric, the function must return the equivalent of either T.fromInt(1) or T.fromInt(-1)
 *
 * @sig Numeric n => n -> n
 * @since 0.4.0
 * @param numeric the value being converted to its absolute value
 * @return {Numeric}
 * @example
 *
 *      _.sign(3);  // 1
 *      _.sign(-3); // -1
 */
Numeric.sign = _unaryOp('sign');

/**
 * Returns the negation of a numeric value.
 *
 * This function can be derived, though it is recommended that the type provide an optimized version.
 *
 * The following law should be satisfied for all n: _.negate(_.negate(n)) is equal to n
 *
 * @sig Numeric n => n -> n
 * @since 0.4.0
 * @param numeric the value being converted to its sign
 * @return {Numeric}
 * @example
 *
 *      _.negate(3);  // -3
 *      _.negate(-3); // 3
 */
Numeric.negate = _unaryOp('negate');

/**
 * Returns the reciprocal of a numeric value
 *
 * This function can be derived, though it is recommended that the type provide an optimized version.
 *
 * The following law should be satisfied for all n != 0: _.reciprocal(_.reciprocal(n)) is equal to n.
 *
 * Taking the reciprocal of a representation 0 is undefined behavior.
 *
 * @sig Numeric n => n -> n
 * @since 0.4.0
 * @param numeric the value being converted to its reciprocal
 * @return {Numeric}
 * @example
 *
 *      _.reciprocal(0.25);  // 4
 *      _.reciprocal(4);     // 0.25
 */
Numeric.reciprocal = _unaryOp('reciprocal');

/**
 * Returns the exponentiation of a value by another
 *
 * This function can be derived, though it is recommended that the type provide an optimized version.
 *
 * @sig Numeric n => n -> n -> n
 * @since 0.4.0
 * @param base the value being raised to the exponent
 * @param exponent the exponent
 * @return {Numeric}
 * @example
 *
 *      _.pow(2,3);  // 8
 *      _.pow(2)(3); // 8
 */
Numeric.pow = _binOp('pow');

/**
 * Returns the exponentiation of a value by another
 *
 * This function is the same as Numeric.pow but with the arguments reversed.
 *
 * @sig Numeric n => n -> n -> n
 * @since 0.4.0
 * @param exponent the exponent
 * @param base the value being raised to the exponent
 * @return {Numeric}
 * @example
 *
 *      _.powBy(2,3);  // 9
 *      _.powBy(2)(3); // 9
 */
Numeric.powBy = _flip(Numeric.pow);

