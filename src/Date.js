var _curry = require('./internal/_curry');

var Ordering = require('./Ordering');

var _Date = require('./internal/_primitives').Date;

module.exports = _Date;

_Date.eq = _curry(function(left, right) {
    return +left === +right;
});

_Date.compare = _curry(function(left, right){
    return Ordering.fromNum(left - right);
});

_Date.toNum = _curry(function(_Date){
    return +_Date;
});

_Date.fromNum = _curry(function(num){
    return new Date(num);
});

_Date.show = _curry(function(_Date){
    return "Date('" + _Date.toUTCString() + "')";
});
