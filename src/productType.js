var _makeFunction = require('./internal/_makeFunction');
var _curry = require('./internal/_curry');
var _curryN = require('./internal/_curryN');
var _isDefined = require('./internal/_isDefined');
var _isArray = require('./internal/_isArray');
var _isFunction = require('./internal/_isFunction');
var _slice = require('./internal/_slice');
var _arrayEqual = require('./internal/_arrayEqual');

var Eq = require('./Eq');

var productType = module.exports = function productType(name, definition) {

    var tags = Object.keys(definition);

    var constraints = tags.map(function(tag) {
        var c = definition[tag];
        return c != null && _isFunction(c.member) ? c.member
            :  _isFunction(c) ? c
            :  _isDefined;
    });

    if (_isArray(definition)) {
        tags = tags.map(function(tag) {
            return "_" + tag;
        });
    }

    var makeProduct = _curryN(tags.length, function() {
        var args = arguments;
        if (arguments.length !== tags.length) {
            throw new TypeError('Invalid number of parameters for product type ' + name);
        }
        var descriptors = tags.reduce(function(accum, tag, ind) {
            if (!constraints[ind](args[ind])) {
                throw new TypeError('Invalid value for tag ' + tag + ' in ' + name);
            }

            accum[tag] = {
                configurable: false,
                enumerable: true,
                writable: false,
                value: args[ind]
            };

            accum[ind] = {
                configurable: false,
                enumerable: false,
                writable: false,
                value: args[ind]
            };

            return accum;
        }, {
            length: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: tags.length
            }
        });

        return Object.freeze(Object.create(Product.prototype, descriptors));
    });

    var Product = _makeFunction(name, makeProduct);

    Product.unapply = _curry(function unapply(fn, instance) {
        return fn.apply(null, _slice(instance));
    });

    Product.eq = _curry(function equal(left, right) {
        if (!Product.member(left) || !Product.member(right)) {
            throw new TypeError(name + '#equal only accepts instances of ' + name);
        }

        if (left === right) {
            // short circuit
            return true;
        }

        return _arrayEqual(left, right);
    });



    Product.member = function(value) {
        return value instanceof Product;
    };

    require('./internal/_module')(Product);

    return Product;
};

module.exports = productType;