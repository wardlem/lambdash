var _curry = require('./internal/_curry');

var Ordering = require('./Ordering');

var DT = require('./internal/_primitives').DT;

module.exports = DT;

DT.eq = _curry(function(left, right) {
    return +left === +right;
});

DT.compare = _curry(function(left, right){
    return Ordering.fromNum(left - right);
});

DT.toNum = _curry(function(dt){
    return +dt;
});

DT.fromNum = _curry(function(num){
    return new Date(num);
});

DT.show = _curry(function(dt){
    return "Date('" + dt.toUTCString() + "')";
});