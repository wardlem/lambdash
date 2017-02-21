const _arrFold = require('./internal/_arrFold');
const _isArray = require('./internal/_isArray');
const _isFunction = require('./internal/_isFunction');
const _curry = require('./internal/_curry');
const _is = require('./internal/_is');

const sumType = require('./sumType');
const Ordering = require('./Ordering');

const enumeratedType = function(name, definition, proto = null) {

    const Constructor = name;
    if (_isFunction(name)) {
        name = name.name;
    }

    if (!_isArray(definition) || definition.length === 0) {
        throw new TypeError('enumeratedType requires an array definition that is not empty');
    }

    let maxValue = 0;
    const sumDef = {};
    const intValues = _arrFold(function(accum, name) {
        accum[name] = maxValue;
        sumDef[name] = [];
        maxValue += 1;
        return accum;
    }, {}, definition);

    maxValue -= 1;

    const Enumeration = sumType(Constructor, sumDef, proto);

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
