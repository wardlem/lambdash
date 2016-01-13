var _arity = require('./internal/_arity');
var _compose = require('./internal/_compose');
var _pipe = require('./internal/_pipe');
var _curry = require('./internal/_curry');
var _curryN = require('./internal/_curryN');
var _always = require('./internal/_always');
var _alwaysThrow = require('./internal/_alwaysThrow');
var _thunk = require('./internal/_thunk');
var _identity = require('./internal/_identity.js');
var _makeFunction = require('./internal/_makeFunction');
var _thisify = require('./internal/_thisify');
var _slice = require('./internal/_slice');
var _isArray = require('./internal/_isArray');

var ap = require('./Applicative').ap;
var map = require('./Functor').map;
var foldl = require('./Foldable').foldl;


var Fun = require('./internal/_primitives').Fun;

/**
 * Combines multiple functions into one such that each function is run with the return value of the previous.
 *
 * The order of execution is from right to left.
 * The returned function will be curried and have a length of the right-most function.
 *
 * @sig (*... -> *)... -> (*... -> *)
 * @since 0.4.0
 * @example
 *
 *      var composed = _.compose(_.add(1), _.mul(2), _.sub);
 *
 *      composed(3,5); // -3
 *      composed(7,2); // 11
 */
Fun.compose = _compose;

/**
 * Combines multiple functions into one such that each function is run with the return value of the previous.
 *
 * The order of execution is from left to right.
 * The returned function will be curried and have a length of the left-most function.
 *
 * This function is the same as compose except with the arguments reversed.
 *
 * @sig (*... -> *)... -> (*... -> *)
 * @since 0.4.0
 * @example
 *
 *      var piped = _.pipe(_.sub, _.mul(2), _.add(1));
 *
 *      piped(3,5); // -3
 *      piped(7,2); // 11
 */
Fun.pipe = _pipe;

/**
 * Creates a function that always returns a given value.
 *
 * @sig a -> (() -> a)
 * @since 0.4.0
 * @example
 *
 *      var one = _.always(1);
 *      one();  // 1
 */
Fun.always = _curry(_always);

/**
 * Creates a function that always throws a value with the given parameters.
 *
 * The first argument should be a function which returns an error type.
 *
 * @sig (*... -> Error) -> *... -> (() -> ())
 * @since 0.5.0
 * @example
 *
 *      var throwTypeError = _.alwaysThrow(TypeError, "The value was invalid");
 *
 *      try {
 *          throwTypeError();
 *      } catch (e) {
 *          // e is a TypeError with a message of "The value was invalid";
 *      }
 */
Fun.alwaysThrow = _alwaysThrow;

/**
 * Takes a function and arguments to that function and returns a function that can be called without arguments.
 *
 * @sig (*... -> *) -> *... -> () -> *
 * @since 0.4.0
 * @example
 *
 *     var thunk =  _.thunk(_.add, 1, 2);
 *     thunk(); // 3
 */
Fun.thunk = _thunk;

/**
 * Always returns its argument.
 *
 * @sig a -> a
 * @since 0.4.0
 * @example
 *
 *      _.identity(1);       // 1
 *      _.identity([1,2,3]); // [1,2,3]
 */
Fun.identity = _identity;

/**
 * Curries a function.
 *
 * A curried function will return a new function if not all of its arguments have been applied.
 * A curried function will also accept a "blank" value as a parameter which signifies that the argument
 * should not be applied (it is skipped).
 * Both the lambdash object itself and it's __ property act as blanks.
 *
 * The length of the returned function will be equal to the length of the function given.
 * The length of a curried function is the number of arguments that must be provided before it is executed.
 *
 * @sig (*...-> *) -> (*... -> *)
 * @since 0.4.0
 * @example
 *
 *      var fn = function(a, b) {return a - b};
 *      curried = _.curry(fn);
 *
 *      curried.length;  // 2
 *
 *      var curried1 = curried(9);
 *      typeof curried1;  // "function"
 *      curried1.length;  // 1
 *      curried1(2);      // 7
 *
 *      var curried2 = curried(_,3);
 *      typeof curried2;  // "function"
 *      curried2.length;  // 1
 *      curred2(7);       // 4
 *
 *      curried(10,6);    // 4
 */
Fun.curry = _curry;

/**
 * Curries a function with given number of arguments to curry.
 *
 * See curry for more details.
 *
 * @sig Number -> (*... -> *) -> (*... -> *)
 * @since 0.4.0
 * @example
 *
 *      var fn = function() {
 *          return arguments[0] - arguments[1];
 *      }
 *      curried = _.curryN(2, fn);
 *
 *      curried.length;   // 2
 *
 *      var curried1 = curried(9);
 *      typeof curried1;  // "function"
 *      curried1.length;  // 1
 *      curried1(2);      // 7
 *
 *      var curried2 = curried(_,3);
 *      typeof curried2;  // "function"
 *      curried2.length;  // 1
 *      curred2(7);       // 4
 *
 *      curried(10,6);    // 4
 */
Fun.curryN = _curryN;

/**
 * Creates a function from another function with a specified length.
 *
 * This function is primarily for the internal use of the library.
 *
 * @since 0.4.0
 * @sig Number -> (*... -> *) -> (*... -> *)
 * @example
 *
 *      var fn = function(){return "whatever"}
 *      fn.length;   // 0
 *      var fn4 = _.arity(4, fn);
 *      fn4.length;  // 4
 *
 *      fn4(1,2,3,4);  // "whatever"
 *      fn4();         // "whatever"
 */
Fun.arity = _arity;

/**
 * Creates a function identical to another function but with a different name.
 *
 * This is primarily used internally for create product and sum types.
 *
 * @sig String -> (*... -> *) -> (*... -> *)
 */
Fun.make = _makeFunction;

/**
 * Creates a function from another with the last argument implicitly applied as "this".
 *
 * It assumes the function it is given is curried.
 * If it is not, the results may be unexpected.
 *
 * This function is intended to make a module function suitable for attaching to a prototype.
 *
 * @sig (*... -> *) -> (*... -> *)
 * @since 0.5.0
 * @example
 *
 *      // This may not be a good idea.
 *      // It is just here for demonstration purposes.
 *
 *      _.Arr.eq([1,2,3], [1,2,3]);   // true
 *
 *      Array.prototype.eq = _.thisify(_.Arr.eq);
 *
 *      var arr = [1,2,3];
 *
 *      arr.eq([1,2,3]);  // true
 *      arr.eq([2,3,4]);  // false
 *
 */
Fun.thisify = _thisify;

/**
 * Takes a regular function and creates a new one that will map over a specified number of arguments.
 *
 * @sig Applicative a => -> Number -> (*... -> c) -> ((a *)... -> a c)
 * @since 0.5.0
 * @example
 *
 *      var fn = function(a,b,c) { return a + b + c }
 *      var lifted = _.liftN(3, fn);
 *      lifted([1],[2],[3]);        // [6]
 *      lifted([1,2], [3,5], [7]);  // [11,13,12,14]
 */
Fun.liftN = _curry(function(n, fn) {
    // Thank you Ramda: https://github.com/ramda/ramda/blob/master/src/liftN.js
    var lifted = _curryN(n, fn);
    return _curryN(n, function() {
        return foldl(ap, map(lifted, arguments[0]), _slice(arguments, 1, n));
    });
});

/**
 * Takes a regular function and creates a new one that will map over multiple arguments.
 *
 * @sig Applicative a => -> Number -> (*... -> c) -> ((a *)... -> a c)
 * @since 0.5.0
 * @example
 *
 *      var fn = function(a,b,c) { return a + b + c }
 *      var lifted = _.lift(fn);
 *      lifted([1],[2],[3]);        // [6]
 *      lifted([1,2], [3,5], [7]);  // [11,13,12,14]
 */
Fun.lift = _curry(function(fn) {
    return Fun.liftN(fn.length, fn);
});

/**
 * Applies a collection of values to a function.
 *
 * If the collection is an array, the built in apply function is used.
 * Otherwise, the collection is folded and it is assumed the function is curried.
 * As such, if the number of elements in the collection is greater than the arity of the function,
 * unexpected results may occur.
 *
 * @sig Foldable f => f * -> (*... -> a) -> a
 * @since 0.5.0
 * @example
 *
 *      var fn1 = function(a, b) {
 *          return a + b;
 *      }
 *
 *      var fn2 = function(a, b) {
 *          return a * b;
 *      }
 *
 *      var ap = _.apply([3,6]);
 *
 *      ap(fn1);  // 9
 *      ap(fn2);  // 18
 */
Fun.apply = _curry(function(values, fn) {
    if (_isArray(values)) {
        return fn.apply(this, values);
    }

    return foldl(function(accum, value){
        return accum(value);
    }, fn, values);
});

/**
 * A function that does nothing and returns nothing.
 *
 * @since 0.6.0
 * @sig () -> ()
 */
Fun.noop = function(){};

require('./internal/_module')(Fun);

module.exports = Fun;