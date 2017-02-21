var _is = require('./internal/_is');
var _curry = require('./internal/_curry');
var _flip = require('./internal/_flip');
const _identity = require('./internal/_identity');

var Ordering = require('./Ordering');
var Foldable = require('./Foldable');
const _Uint8Array = require('./internal/_primitives')._Uint8Array;

var _String = require('./internal/_primitives').String;

// Implementation for Eq

/**
 * Returns true if two strings are the same.
 *
 * @sig String -> String -> Boolean
 * @since 0.5.0
 */
_String.eq = _is;


// Implementation for Ord

/**
 * Compares two strings and returns an Ordering.
 *
 * @sig String -> String -> Ordering
 * @since 0.5.0
 */
_String.compare = _curry(function(left, right) {
    return left < right ? Ordering.LT
        : left > right ? Ordering.GT
        : Ordering.EQ;
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
_String.toInt = _curry(function(value) {
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
_String.fromInt = _curry(String.fromCharCode);


// Implementation for Functor

/**
 * Maps over the characters of a string.
 *
 * @sig (String -> String) -> String -> String
 * @since 0.5.0
 */
_String.map = _curry(function(fn, string) {
    return string.split('').map(fn).join('');
});


// Implementation for Semigroup

/**
 * Concatenates two strings together.
 *
 * @sig String -> String -> String
 * @since 0.5.0
 */
_String.concat = _curry(function(left, right) {
    return String(left) + String(right);
});


// Implementation for Monoid

/**
 * Returns an empty string.
 *
 * @sig () -> String
 * @since 0.5.0
 */
_String.empty = function() {
    return '';
};


// Implementation for Foldable

/**
 * Folds the characters of a string from left to right.
 *
 * @sig (b -> String -> b) -> b -> String
 * @since 0.5.0
 */
_String.foldl = _curry(function(fn, init, string) {
    return string.split('').reduce(fn, init);
});

/**
 * Folds the characters of a string from right to left.
 *
 * @sig (b -> String -> b) -> b -> String
 * @since 0.5.0
 */
_String.foldr = _curry(function(fn, init, string) {
    return string.split('').reduceRight(fn, init);
});


// Implementation for Sequential

/**
 * Returns the length of a string.
 *
 * @sig String -> Number
 * @since 0.6.0
 */
_String.len = _curry(function(string) {
    return string.length;
});

/**
 * Returns the character at a given index in a string.
 *
 * Accepts negative indexes which index from the end of the string.
 *
 * @sig Number -> String -> String
 * @since 0.6.0
 */
_String.nth = _curry(function(ind, string) {
    if (ind < 0) {
        ind = string.length + ind;
    }

    if (ind < 0 || ind >= string.length) {
        throw new RangeError('String index out of bounds');
    }

    return string[ind];
});

_String.of = _identity;

/**
 * Appends a string to another.
 *
 * Same as _String.concat but with the arguments flipped.
 *
 * @sig String -> String -> String
 * @since 0.6.0
 */
_String.append = _flip(_String.concat);

/**
 * Prepends a string to another.
 *
 * Same as _String.concat.
 *
 * @sig String -> String -> String
 * @since 0.6.0
 */
_String.prepend = _String.concat;


// String functions

/**
 * Splits a string at a delimeter into an array of strings.
 *
 * @sig String|RegExp -> String -> [String]
 * @since 0.6.0
 */
_String.split = _curry(function(delim, string) {
    return String.prototype.split.call(string, delim);
});

/**
 * Works like the built-in String.prototype.match function except that it
 * returns an array if no matches are found.
 *
 * @sig RegExp -> String -> [String]
 * @since 0.6.0
 */
_String.match = _curry(function(regex, string) {
    return String.prototype.match.call(string, regex) || [];
});

/**
 * Replaces all of a substring or regular expression match with a given string.
 *
 * Behaves identically to String.prototype.replace.
 *
 * @sig String|RegExp -> String -> String -> String
 * @since 0.6.0
 */
_String.replace = _curry(function(find, replace, string) {
    return String.prototype.replace.call(string, find, replace);
});

/**
 * Coerces a string to lower case.
 *
 * Behaves identically to String.prototype.toLowerCase.
 *
 * @sig String -> String
 * @since 0.6.0
 */
_String.toLower = _curry(function(string) {
    return String.prototype.toLowerCase.call(string);
});

/**
 * Coerces a string to upper case.
 *
 * Behaves identically to String.prototype.toUpperCase.
 *
 * @sig String -> String
 * @since 0.6.0
 */
_String.toUpper = _curry(function(string) {
    return String.prototype.toUpperCase.call(string);
});

/**
 * Removes whitespace from both ends of a string.
 *
 * Behaves identically to String.prototype.trim.
 *
 * @sig String -> String
 * @since 0.6.0
 */
_String.trim = _curry(function(string) {
    return String.prototype.trim.call(string);
});

/**
 * Splits a string into an array of lines.
 *
 * @sig String -> [String]
 * @since 0.6.0
 */
_String.lines = _String.split('\n');

/**
 * Splits a string by whitespace.
 *
 * @sig String -> [String]
 * @since 0.6.0
 */
_String.words = _String.split(/\s+/);

/**
 * Joins a foldable of strings with a newline character.
 *
 * @sig Foldable f => f String -> String
 * @since 0.6.0
 */
_String.unlines = Foldable.joinWithDef('', '\n');

/**
 * Joins a foldable of strings with a space character.
 *
 * @sig Foldable f => f String -> String
 * @since 0.6.0
 */
_String.unwords = Foldable.joinWithDef('', ' ');

/**
 * Hash a string with a provided seed
 *
 * @sig Integer -> String -> Integer
 * @since 0.7.0
 */
_String.hashWithSeed = _curry(function(seed, string) {
    return _Uint8Array.hashWithSeed(seed, Uint8Array.from(string.split('').map(c => c.charCodeAt(0))));
});

/**
 * Hash a string with a provided seed
 *
 * @sig String -> Integer
 * @since 0.7.0
 */
_String.hash = _curry(function(string) {
    return _Uint8Array.hash(Uint8Array.from(string.split('').map(c => c.charCodeAt(0))));
});

/**
 * Returns an evaluatable representation of a string.
 *
 * @sig String -> String
 * @since 0.5.0
 */
_String.show = _curry(function(string) {
    return '"' + String.prototype.replace.call(string, /"/g, '\\"') + '"';
});

module.exports = _String;
