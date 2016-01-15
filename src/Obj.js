var _curry = require('./internal/_curry');
var _arrSort = require('./internal/_arrSort');
var _arrEqual = require('./internal/_arrayEqual');
var _equal = require('./internal/_equal');
var _show = require('./internal/_show');
var _flip = require('./internal/_flip');
var _compose = require('./internal/_compose');
var __ = require('./internal/_blank');

var Functor = require('./Functor');
var Foldable = require('./Foldable');

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
        if (!(key in right) || !_equal(left[key], right[key])) {
            return false;
        }
        keyInd += 1;
    }

    return true;
});

Obj.map = _curry(function(fn, obj) {
    return Foldable.foldl(function(accum, key){
        accum[key] = fn(obj[key]);
        return accum;
    }, {}, Obj.ownKeys(obj));
});

Obj.mapAssoc = _curry(function(fn, obj) {
    return Foldable.foldl(function(accum, key){
        accum[key] = fn(obj[key], key);
        return accum;
    }, {}, Obj.ownKeys(obj));
});

Obj.concat = _curry(function(left, right){
    var result = Obj.copy(left);
    for (var k in right){
        result[k] = right[k];
    }
    return result;
});

Obj.empty = function(){
    return {};
};

Obj.union = _flip(Obj.concat);

Obj.difference = _curry(function(left, right){
    var result = {};
    for (var k in left){
        if(!(k in right)){
            result[k] = left[k];
        }
    }

    return result;
});

Obj.intersection = _curry(function(left, right){
    var result = {};
    for (var k in left){
        if(k in right){
            result[k] = left[k];
        }
    }

    return result;
});

Obj.symettricDifference = _curry(function(left, right){
    var result = {};
    var k;
    for (k in left){
        if(!(k in right)){
            result[k] = left[k];
        }
    }

    for (k in right){
        if(!(k in left)){
            result[k] = right[k];
        }
    }

    return result;
});

Obj.foldl = _curry(function(fn, init, obj){
    var keys = _arrSort(Object.keys(obj));

    return Foldable.foldl(function(accum, key){
        return fn(accum, obj[key]);
    }, init, keys);
});

Obj.foldr = _curry(function(fn, init, obj){
    var keys = _arrSort(Object.keys(obj));

    return Foldable.foldr(function(accum, key){
        return fn(accum, obj[key]);
    }, init, keys);
});


Obj.foldlAssoc = _curry(function(fn, init, obj){
    var keys = _arrSort(Object.keys(obj));

    return Foldable.foldl(function(accum, key){
        return fn(accum, obj[key], key);
    }, init, keys);
});

Obj.foldrAssoc = _curry(function(fn, init, obj){
    var keys = _arrSort(Object.keys(obj));

    return Foldable.foldr(function(accum, key){
        return fn(accum, obj[key], key);
    }, init, keys);
});

Obj.copy = _curry(function(obj){
    var res = {};
    for (var k in obj) {
        res[k] = obj[k];
    }
    return res;
});

Obj.assoc = _curry(function(key, value, obj){
    var res = Obj.copy(obj);

    res[key] = value;
    return res;
});

Obj.dissoc = _curry(function(key, obj){
    var res = {};
    for (var k in obj) {
        if (k !== key) {
            res[k] = obj[k];
        }
    }

    return res;
});

Obj.has = _curry(function(key, obj){
    return key in obj;
});

Obj.hasOwn = _curry(function(key, obj){
    return Object.prototype.hasOwnProperty.call(obj, key);
});

Obj.prop = _curry(function(key, obj){
    return obj[key];
});

Obj.propOr = _curry(function(def, key, obj){
    return Obj.has(key, obj) ? obj[key] : def;
});

Obj.props = _curry(function(props, obj){
    return Functor.map(Obj.prop(__, obj), props);
});

Obj.keys = _curry(function(obj){
    return _arrSort(Object.keys(Obj.copy(obj)));
});

Obj.ownKeys = _curry(function(obj){
    return _arrSort(Object.keys(obj).filter(Obj.hasOwn(__, obj)));
});

Obj.values = _curry(function(obj){
    return Obj.props(Obj.keys(obj), obj);
});

Obj.ownValues = _curry(function(obj){
    return Obj.props(Obj.ownKeys(obj), obj);
});

Obj.pairs = _curry(function(obj){
    return Functor.map(function(key){
        return [key, obj[key]];
    }, Obj.keys(obj))
});

Obj.ownPairs = _curry(function(obj){
    return Functor.map(function(key){
        return [key, obj[key]];
    }, Obj.ownKeys(obj));
});

Obj.filter = _curry(function(fn, obj){
    return Obj.foldlAssoc(function(accum, value, key){
        if (fn(value)){
            accum[key] = value;
        }
        return accum;
    }, {}, obj);
});

Obj.filterAssoc = _curry(function(fn, obj){
    return Obj.foldlAssoc(function(accum, value, key){
        if (fn(value, key)){
            accum[key] = value;
        }
        return accum;
    }, {}, obj);
});



Obj.show = _curry(function(obj){
    var keys = _arrSort(Object.keys(obj));
    var items = keys.map(function(key){
        return '"' + key + '"' + ": " + _show(obj[key]);
    });

    return "{" + items.join(', ') + "}";
});

module.exports = Obj;