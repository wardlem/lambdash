var _isObject = require('./internal/_isObject');
var _isFunction = require('./internal/_isFunction');
var _makeFunction = require('./internal/_makeFunction');
var _isDefined = require('./internal/_isDefined');
var _curry = require('./internal/_curry');
var _ucfirst = require('./internal/_ucfirst');
var productType = require('./productType');


function sumType(name, definition) {
    if (!_isObject(definition)) {
        throw new TypeError('The second parameter to sumType must be an object');
    }

    var names = Object.keys(definition);

    var Sum = _isFunction(name) ? name : _makeFunction(name, function(){});
    name = Sum.name;

    Sum.member = function member(value) {
        return value instanceof Sum;
    };

    Sum.assert = function assert(value) {
        if (Sum.member(value)) {
            return value;
        }

        throw new TypeError('Invalid value for ' + name);
    };

    names.forEach(function(name) {
        var def = definition[name];
        if (!_isObject(def)) {
            def = [];
        }

        var Product = productType(name, def);

        Product.prototype = Object.create(Sum.prototype);
        Product.prototype.constructor = Product;

        require('./internal/_subModule')(Sum, Product);


        Sum[name] = Object.keys(def).length ? Product : Product();

        Sum['is'+_ucfirst(name)] = Product.member;

    });

    Sum.case = _curry(function(cases, value) {
        if (!Sum.member(value)) {
            throw new TypeError("Could not match value as " + name + " since it isn't of the right type");
        }

        function doMatch(fn, value) {
            if (typeof fn === 'function') {
                return value.constructor.unapply(fn, value);
            }

            return fn;
        }

        function doDefaultMatch(fn, value) {
            if (typeof fn === 'function') {
                return fn(value);
            }

            return fn;
        }

        var c = value.constructor.name;
        if (_isDefined(cases[c])) {
            return doMatch(cases[c], value);
        } else if (_isDefined(cases['_'])) {
            return doDefaultMatch(cases['_'], value);
        }

        throw new TypeError("Non exhaustive case expression for " + name + ". " + c + " not handled.");
    });

    Sum.eq = _curry(function(left, right) {
        if (!Sum.member(left) || !Sum.member(right)) {
            throw new TypeError(name + '#eq only accepts instances of ' + name);
        }

        if (left.constructor !== right.constructor) {
            return false;
        }

        return left.constructor.eq(left, right);
    });

    Sum.unapply = _curry(function(fn, instance) {
        return instance.constructor.unapply(fn, instance);
    });

    Sum.set = _curry(function(key,value,instance){
        return instance.length === 0 ? instance : instance.constructor.set(key,value,instance);
    });

    Sum.patch = _curry(function(patches,instance){
        return instance.length === 0 ? instance : instance.constructor.patch(patches,instance);
    });

    Sum.toJSON = _curry(function(instance) {
        return {
            __tag__: instance.constructor.name,
            data: instance.constructor.toJSON(instance)
        }
    })

    Sum.fromJSON = _curry(function(obj) {
        var t = obj.__tag__;
        if (typeof t !== 'string') {
            throw new TypeError('Could not create ' + name + ' from object, missing type.');
        }

        if (typeof Sum[t] === 'function') {
            return Sum[t].fromJSON(obj.data);
        }

        if (typeof Sum[t] === 'object') {
            return Sum[t];
        }

        throw new TypeError('Could not create ' + name + ' from object, invalid type.');
    });

    Sum.show = _curry(function(instance){
        return instance.length === 0
            ? name + '.' + instance.constructor.name
            : name + '.' + instance.constructor.show(instance);
    });

    require('./internal/_module')(Sum);

    return Sum;

}

module.exports = sumType;
