var _moduleFor = require('./internal/_moduleFor');
var _curry = require('./internal/_curry');
var _isFunction = require('./internal/_isFunction');
var _compose = require('./internal/_compose');
var _ifArrEmpty = require('./internal/_ifArrEmpty');
var _arrMap = require('./internal/_arrMap');
var _alwaysThrow = require('./internal/_alwaysThrow');
var _applyTo = require('./internal/_applyTo');
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

var _checkCompose = _ifArrEmpty(_alwaysThrow(TypeError), "Monad#compose cannot be called without any arguments");
var _checkPipe = _ifArrEmpty(_alwaysThrow(TypeError), "Monad#pipe cannot be called without any arguments");

Monad.compose = function() {
    //_checkCompose(arguments);
    var argsInd = 0;
    var args = [];
    while (argsInd < arguments.length) {
        args[argsInd] = Monad.chain(arguments[argsInd]);
        argsInd += 1;
    }
    return _compose.apply(this, args);
};

Monad.pipe = function() {
    //_checkPipe(arguments);
    return Monad.compose.apply(this, _arrReverse(arguments));
};
//Monad.compose = _compose(_applyTo(_compose), _arrMap(Monad.chain), _checkCompose);
//Monad.pipe = _compose(_applyTo(_compose), _arrReverse, _arrMap(Monad.chain), _checkPipe);