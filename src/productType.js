var _makeFunction = require('./internal/_makeFunction');
var _curry = require('./internal/_curry');
var _curryN = require('./internal/_curryN');
var _isDefined = require('./internal/_isDefined');
var _isArray = require('./internal/_isArray');
var _isFunction = require('./internal/_isFunction');
var _slice = require('./internal/_slice');
var _arrayEqual = require('./internal/_arrayEqual');
var _compose = require('./internal/_compose');
var _ucfirst = require('./internal/_ucfirst');
var _moduleFor = require('./internal/_moduleFor');

var Eq = require('./Eq');
var Show = require('./Show');
var Obj = require('./internal/_primitives').Object;

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

    Product.fromObject = _curry(function(obj){
        var values = tags.map(function(tag){
            return obj[tag];
        });
        return Product.apply(this, values);
    });

    Product.toObject = _curry(function(product){
        var obj = {};
        tags.map(function(tag){
            obj[tag] = product[tag];
        });
        return obj;
    });

    Product.toJSON = _curry(function(product){
        var obj = {};
        tags.map(function(tag){
            var M = _moduleFor(product[tag]);
            if (_isFunction(M.toJSON)) {
                obj[tag] = M.toJSON(product[tag]);
            } else {
                obj[tag] = product[tag];
            }
        });
        return obj;
    });
    Product.fromJSON = Product.fromObject;

    Product.set = _curry(function(tag,value,product){
        var obj = Product.toObject(product);
        obj[tag] = value;
        return Product.fromObject(obj);
    });

    tags.forEach(function(tag){
        var fnName = 'set' + _ucfirst(tag);
        Product[fnName] = Product.set(tag);
    });

    Product.patch = _curry(function(patches,product){
        return Product.fromObject(Obj.concat(product,patches));
    });

    Product.show = _curry(function(value){
        var values = Array.prototype.map.call(value,function(v){
            return Show.show(v);
        }).join(',')
        return name + '('+ values +')';
    });

    Product.member = function(value) {
        return value instanceof Product;
    };



    require('./internal/_module')(Product);

    return Product;
};

module.exports = productType;
