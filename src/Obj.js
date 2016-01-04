var _curry = require('./internal/_curry');
var _arrSort = require('./internal/_arrSort');
var _arrEqual = require('./internal/_arrayEqual');
var _equal = require('./internal/_equal');
var _show

var Obj = require('./internal/_primitives').Obj;

// implementation for Eq
Obj.eq = _curry(function(left, right) {
    if (left === right) {
        return true;
    }

    var lKeys = _arrSort(Object.keys(left));
    var rKeys = _arrSort(Object.keys(right));

    if (!_arrEqual(lKeys, rKeys)) {
        return false;
    }

    var keyInd = 0;
    while(keyInd < lKeys.length) {
        var key = lKeys[keyInd];
        if (!_equal(left[key], right[key])) {
            return false;
        }
        keyInd += 1;
    }

    return true;
});

Obj.show = _curry(function(obj){
    var keys = Object.keys(obj);
    var items = keys.map(function(key){
        return key + ": " + _show(obj[key]);
    });

    return "{" + items.join(', ') + "}";
});