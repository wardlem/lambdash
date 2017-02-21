const _moduleFor = require('./internal/_moduleFor');
const _isFunction = require('./internal/_isFunction');
const _compose = require('./internal/_compose');
const _arrReverse = require('./internal/_reverse');
const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');

const Applicative = require('./Applicative');
const Functor = require('./Functor');

const Monad = {name: 'Monad'};

const monadForModule = _typecached((M) => {

    if (!Monad.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Monad`);
    }

    const _Monad = {};

    _Monad.flatten = M.flatten;

    _Monad.chain = _isFunction(M.chain)
        ? M.chain
        : _compose(_Monad.flatten, Functor.map)
    ;

    return _Monad;
});

const monadForModulePrototype = _typecached(M => {
    const methods = monadForModule(M);

    return {
        flatten: _thisify(methods.flatten),
        chain: _thisify(methods.chain),
    };
});

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
Monad.flatten = _curryN(1, typeclass.forward('flatten', monadForModule));

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
Monad.chain = _curryN(2, typeclass.forward('chain', monadForModule));

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
Monad.composeM = function(...args) {
    // _checkCompose(arguments);
    let argsInd = 0;
    const argsM = [];
    while (argsInd < args.length) {
        argsM[argsInd] = Monad.chain(args[argsInd]);
        argsInd += 1;
    }
    return _compose.apply(this, argsM);
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
Monad.pipeM = function(...args) {
    // _checkPipe(arguments);
    return Monad.composeM(..._arrReverse(args));
};

Monad.map = Functor.map;

module.exports = typeclass(Monad, {
    deriveFn: monadForModule,
    deriveProtoFn: monadForModulePrototype,
    required: ['flatten'],
    superTypes: [Applicative],
});
