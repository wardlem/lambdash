const _makeFunction = require('./internal/_makeFunction');
const _curry = require('./internal/_curry');
const _curryN = require('./internal/_curryN');
const _isDefined = require('./internal/_isDefined');
const _isArray = require('./internal/_isArray');
const _isFunction = require('./internal/_isFunction');
const _slice = require('./internal/_slice');
const _arrayEqual = require('./internal/_arrayEqual');
const _ucfirst = require('./internal/_ucfirst');
const _moduleFor = require('./internal/_moduleFor');
const _thisify = require('./internal/_thisify');
const _flip = require('./internal/_flip');

const Show = require('./Show');
const Obj = require('./internal/_primitives').Object;

const productType = module.exports = function productType(name, definition, proto = null) {

    let tags = Object.keys(definition);

    const constraints = tags.map(function(tag) {
        const c = definition[tag];
        return c != null && _isFunction(c.member) ? c.member
            :  _isFunction(c) ? (v) => v instanceof c
            :  _isDefined;
    });

    if (_isArray(definition)) {
        tags = tags.map(function(tag) {
            return '_' + tag;
        });
    }

    const makeProduct = _curryN(tags.length, function(...args) {
        const descriptors = tags.reduce(function(accum, tag, ind) {
            if (!constraints[ind](args[ind])) {
                throw new TypeError('Invalid value for tag ' + tag + ' in ' + name);
            }

            accum[tag] = {
                configurable: false,
                enumerable: true,
                writable: false,
                value: args[ind],
            };

            accum[ind] = {
                configurable: false,
                enumerable: false,
                writable: false,
                value: args[ind],
            };

            return accum;
        }, {
            length: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: tags.length,
            },
        });

        return Object.freeze(Object.create(Product.prototype, descriptors));
    });

    const Product = _makeFunction(name, makeProduct);

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

    Product.fromObject = _curry(function(obj) {
        const values = tags.map(function(tag) {
            return obj[tag];
        });
        return Product.apply(this, values);
    });

    Product.toObject = _curry(function(product) {
        const obj = {};
        tags.map(function(tag) {
            obj[tag] = product[tag];
        });
        return obj;
    });

    Product.toJSON = _curry(function(product) {
        const obj = {};
        tags.map(function(tag) {
            const M = _moduleFor(product[tag]);
            if (_isFunction(M.toJSON)) {
                obj[tag] = M.toJSON(product[tag]);
            } else {
                obj[tag] = product[tag];
            }
        });
        return obj;
    });
    Product.fromJSON = Product.fromObject;

    Product.set = _curry(function(tag,value,product) {
        const obj = Product.toObject(product);
        obj[tag] = value;
        return Product.fromObject(obj);
    });

    tags.forEach(function(tag) {
        const fnName = 'set' + _ucfirst(tag);
        Product[fnName] = Product.set(tag);
    });

    Product.patch = _curry(function(patches,product) {
        return Product.fromObject(Obj.concat(product,patches));
    });

    Product.show = _curry(function(value) {
        const values = Array.prototype.map.call(value,function(v) {
            return Show.show(v);
        }).join(',');
        return name + '(' + values + ')';
    });

    Product.member = function(value) {
        return value instanceof Product;
    };

    Product.prototype = Object.create(proto);
    Product.prototype.constructor = Product;

    Object.assign(Product.prototype, {
        unapply: _thisify(Product.apply),
        eq: _thisify(_flip(Product.eq)),
        toString: () => {
            let [...values] = this;
            return `${name}(${values.join(',')})`;
        },
        [Symbol.iterator]: function* () {
            for (let tag of tags) {
                yield this[tag];
            }
        },
        patch: _thisify(Product.patch),
    });

    require('./internal/_module')(Product);

    return Product;
};

module.exports = productType;
