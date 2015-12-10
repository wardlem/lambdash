var _moduleFor = require('./internal/_moduleFor');
var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _compose = require('./internal/_compose');
var _arrReverse = require('./internal/_reverse');

var Functor = require('./Functor');

var Monad = module.exports;


Monad.map = Functor.map;

Monad.flatten = _curry(function(monad) {
    if (monad == null) {
        throw new TypeError('Monad#flatten can not be called on an undefined or null value');
    }
    if (_isFunction(monad.flatten)) {
        return monad.flatten();
    }

    var M = _moduleFor(monad);
    if (_isFunction(M.flatten)) {
        return M.flatten(monad);
    }

    console.log(monad);
    throw new TypeError('Monad#flatten called on a value that does not implement Monad');
});


/**
 * @sig Monad m => (a -> m b) -> m a -> m b
 */
Monad.chain = _compose(Monad.flatten, Monad.map);

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

Monad.pipeM = function() {
    //_checkPipe(arguments);
    return Monad.composeM.apply(this, _arrReverse(arguments));
};

Monad.member = function(value) {
    return Applicative.member(value) && _isFunction(_moduleFor(value).flatten);
};
