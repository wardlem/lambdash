var _is = require('./internal/_is');
var _curry = require('./internal/_curry');
var _identity = require('./internal/_identity');
var _flip = require('./internal/_flip');

var Ordering = require('./Ordering');
var Foldable = require('./Foldable');

var Str = require('./internal/_primitives').Str;

// Implementation for Eq

/**
 * Returns true if two strings are the same.
 *
 * @sig String -> String -> Boolean
 * @since 0.5.0
 */
Str.eq = _is;


// Implementation for Ord

/**
 * Compares two strings and returns an Ordering.
 *
 * @sig String -> String -> Ordering
 * @since 0.5.0
 */
Str.compare = _curry(function(left, right) {
    return left < right ? Ordering.LT
        : left > right ? Ordering.GT
        : Ordering.EQ
});


// Implementation for Enum

/**
 * Returns the char code for the first index of a string.
 *
 * Throws an exception if the string is empty.
 *
 * @sig String -> Number
 * @since 0.5.0
 */
Str.toInt = _curry(function(value) {
    if (value.length === 0) {
        throw new TypeError('Can not convert empty string to integer');
    }

    return value.charCodeAt(0);
});

/**
 * Returns a string from a char code.
 *
 * @sig Number -> String
 * @since 0.5.0
 */
Str.fromInt = _curry(String.fromCharCode);


// Implementation for Functor

/**
 * Maps over the characters of a string.
 *
 * @sig (String -> String) -> String -> String
 * @since 0.5.0
 */
Str.map = _curry(function(fn, str) {
    return str.split('').map(fn).join('');
});


// Implementation for Semigroup

/**
 * Concatenates two strings together.
 *
 * @sig String -> String -> String
 * @since 0.5.0
 */
Str.concat = _curry(function(left, right) {
    return String(left) + String(right);
});


// Implementation for Monoid

/**
 * Returns an empty string.
 *
 * @sig () -> String
 * @since 0.5.0
 */
Str.empty = function() {
    return '';
};


// Implementation for Foldable

/**
 * Folds the characters of a string from left to right.
 *
 * @sig (b -> String -> b) -> b -> String
 * @since 0.5.0
 */
Str.foldl = _curry(function(fn, init, string) {
    return string.split('').reduce(fn, init);
});

/**
 * Folds the characters of a string from right to left.
 *
 * @sig (b -> String -> b) -> b -> String
 * @since 0.5.0
 */
Str.foldr = _curry(function(fn, init, string) {
    return string.split('').reduceRight(fn, init);
});


// Implementation for Sequential

/**
 * Returns the length of a string.
 *
 * @sig String -> Number
 * @since 0.6.0
 */
Str.len = _curry(function(str){
    return str.length;
});

/**
 * Returns the character at a given index in a string.
 *
 * Accepts negative indexes which index from the end of the string.
 *
 * @sig Number -> String -> String
 * @since 0.6.0
 */
Str.nth = _curry(function(ind, str) {
    if (ind < 0) {
        ind = str.length + ind;
    }

    if (ind < 0 || ind >= str.length) {
        throw new RangeError('String index out of bounds');
    }

    return str[ind];
});

/**
 * Appends a string to another.
 *
 * Same as Str.concat but with the arguments flipped.
 *
 * @sig String -> String -> String
 * @since 0.6.0
 */
Str.append = _flip(Str.concat);

/**
 * Prepends a string to another.
 *
 * Same as Str.concat.
 *
 * @sig String -> String -> String
 * @since 0.6.0
 */
Str.prepend = Str.concat;


// String functions

/**
 * Splits a string at a delimeter into an array of strings.
 *
 * @sig String|RegExp -> String -> [String]
 * @since 0.6.0
 */
Str.split = _curry(function(delim, string) {
    return String.prototype.split.call(string, delim);
});

/**
 * Works like the built-in String.prototype.match function except that it
 * returns an array if no matches are found.
 *
 * @sig RegExp -> String -> [String]
 * @since 0.6.0
 */
Str.match = _curry(function(regex, str){
    return String.prototype.match.call(str, reqex) || [];
});

/**
 * Replaces all of a substring or regular expression match with a given string.
 *
 * Behaves identically to String.prototype.replace.
 *
 * @sig String|RegExp -> String -> String -> String
 * @since 0.6.0
 */
Str.replace = _curry(function(find, replace, str){
    return String.prototype.replace.call(str, find, replace);
});

/**
 * Coerces a string to lower case.
 *
 * Behaves identically to String.prototype.toLowerCase.
 *
 * @sig String -> String
 * @since 0.6.0
 */
Str.toLower = _curry(function(str){
    return String.prototype.toLowerCase.call(str);
});

/**
 * Coerces a string to upper case.
 *
 * Behaves identically to String.prototype.toUpperCase.
 *
 * @sig String -> String
 * @since 0.6.0
 */
Str.toUpper = _curry(function(str){
    return String.prototype.toUpperCase.call(str);
});

/**
 * Removes whitespace from both ends of a string.
 *
 * Behaves identically to String.prototype.trim.
 *
 * @sig String -> String
 * @since 0.6.0
 */
Str.trim = _curry(function(str){
    return String.prototype.trim.call(str);
});

/**
 * Splits a string into an array of lines.
 *
 * @sig String -> [String]
 * @since 0.6.0
 */
Str.lines = Str.split('\n');

/**
 * Splits a string by whitespace.
 *
 * @sig String -> [String]
 * @since 0.6.0
 */
Str.words = Str.split(/\s+/);

/**
 * Joins a foldable of strings with a newline character.
 *
 * @sig Foldable f => f String -> String
 * @since 0.6.0
 */
Str.unlines = Foldable.joinWithDef('', '\n');

/**
 * Joins a foldable of strings with a space character.
 *
 * @sig Foldable f => f String -> String
 * @since 0.6.0
 */
Str.unwords = Foldable.joinWithDef('', ' ');

/**
 * Returns an evaluatable representation of a string.
 *
 * @sig String -> String
 * @since 0.5.0
 */
Str.show = _curry(function(str){
    return '"' + String.prototype.replace.call(str, /"/g, "\\\"") + '"';
});

module.exports = Str;
