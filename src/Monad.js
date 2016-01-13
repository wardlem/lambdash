var _moduleFor = require('./internal/_moduleFor');
var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _compose = require('./internal/_compose');
var _arrReverse = require('./internal/_reverse');

var Functor = require('./Functor');
var Applicative = require('./Applicative');

var Monad = module.exports;

Monad.map = Functor.map;

/**
 * Flattens a monadic structure.
 *
 * @sig Monad m => m (m a) -> m a
 * @since 0.4.0
 * @param {Monad} monad a structure containing instances of itself
 * @return {Monad}
 * @example
 *
 *      _.flatten([[1,2,3],[4,5,6],[7,8,9]]); [1,2,3,4,5,6,7,8,9]
 */
Monad.flatten = _curry(function(monad) {
    var M = _moduleFor(monad);
    if (_isFunction(M.flatten)) {
        return M.flatten(monad);
    }

    throw new TypeError('Monad#flatten called on a value that does not implement Monad');
});


/**
 * Flat maps a monadic value with a function.
 *
 * This allows Monadic computations to be chained together.
 *
 * @sig Monad m => (a -> m b) -> m a -> m b
 * @since 0.4.0
 * @param {Function} fn the function mapping over the monad which must return an instance of the monad
 * @param {Monad} monad the structure being mapped over
 * @example
 *
 *      _.chain(n => [n + 1], [1,2,3]);  // [2,3,4]
 */
Monad.chain = _compose(Monad.flatten, Functor.map);

/**
 * Composes functions using the chain function.
 *
 * _.composeM(fn1, fn2) is equivalent to _.compose(_.chain(fn1), _.chain(fn2));
 * In this example fn1 will map over the output of fn2.
 * As such, in the signature the b of fn1 is the a of fn2.
 *
 * @sig Monad m => ...(a -> m b) -> (m a -> m b)
 * @since 0.5.0
 * @returns {Function}
 * @example
 *
 *      fn1 = x => [x + 1]
 *      fn2 = x => [x * 2]
 *
 *      _.composeM(fn1, fn2)([1,2,3]);  // [3,5,7]
 *      _.composeM(fn2, fn1)([1,2,3]);  // [4,6,8]
 */
Monad.composeM = function() {
    //_checkCompose(arguments);
    var argsInd = 0;
    var args = [];
    while (argsInd < arguments.length) {
        args[argsInd] = Monad.chain(arguments[argsInd]);
        argsInd += 1;
    }
    return _compose.apply(this, args);
};

/**
 * Composes functions using the chain function.
 *
 * _.pipeM(fn1, fn2) is equivalent to _.pipe(_.chain(fn1), _.chain(fn2));
 * In this example fn2 will map over the output of fn1.
 * As such, in the signature the b of fn2 is the a of fn1.
 *
 * This function is the same as composeM, but with the order of execution reversed.
 *
 * @sig Monad m => ...(a -> m b) -> (m a -> m b)
 * @since 0.5.0
 * @returns {Function}
 * @example
 *
 *      fn1 = x => [x + 1]
 *      fn2 = x => [x * 2]
 *
 *      _.pipeM(fn1, fn2)([1,2,3]);  // [4,6,8]
 *      _.pipeM(fn2, fn1)([1,2,3]);  // [3,5,7]
 */
Monad.pipeM = function() {
    //_checkPipe(arguments);
    return Monad.composeM.apply(this, _arrReverse(arguments));
};

Monad.member = function(value) {
    return Applicative.member(value) && _isFunction(_moduleFor(value).flatten);
};
