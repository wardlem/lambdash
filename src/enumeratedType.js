var _arrFold = require('./internal/_arrFold');
var _isArray = require('./internal/_isArray');
var _isFunction = require('./internal/_isFunction');
var _curry = require('./internal/_curry');
var _is = require('./internal/_is');

var sumType = require('./sumType');
var Ordering = require('./Ordering');

var enumeratedType = function(name, definition) {

    var Constructor = name;
    if (_isFunction(name)) {
        name = name.name;
    }

    if (!_isArray(definition) || definition.length === 0) {
        throw new TypeError('enumeratedType requires an array definition that is not empty');
    }

    var maxValue = 0;
    var sumDef = {};
    var intValues = _arrFold(function(accum, name) {
        accum[name] = maxValue;
        sumDef[name] = [];
        maxValue += 1;
        return accum;
    }, {}, definition);

    maxValue -= 1;

    var Enumeration = sumType(Constructor, sumDef);

    Enumeration.toInt = Enumeration.case(intValues);

    Enumeration.compare = _curry(function(left, right) {
        return Ordering.fromInt(Enumeration.toInt(left) - Enumeration.toInt(right));
    });

    Enumeration.fromInt = function(e) {
        if (e < 0 || e > maxValue) {
            throw new RangeError(name + '#fromInt called with value out of range');
        }

        return Enumeration[definition[e]];
    };

    Enumeration.minBound = function() {
        return Enumeration[definition[0]];
    };

    Enumeration.maxBound = function() {
        return Enumeration[definition[maxValue]];
    };

    Enumeration.is = _is;
    return Enumeration;
};

module.exports = enumeratedType;
