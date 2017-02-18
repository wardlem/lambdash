const _curry = require('./internal/_curry');
const _compose = require('./internal/_compose');

const Ordering = require('./Ordering');
const _Number = require('./Integer');

/**
 * _Date is the module for javascript's built-in Date type.
 *
 * @module
 * @implements Eq
 * @implements Ord
 * @implements Numeric
 * @implements Show
 * @implements Serializable
 * @implements Hashable
 */
const _Date = require('./internal/_primitives').Date;


module.exports = _Date;

_Date.eq = _curry(function(left, right) {
    return +left === +right;
});

_Date.compare = _curry(function(left, right) {
    return Ordering.fromNum(left - right);
});

_Date.toNum = _curry(function(_Date) {
    return +_Date;
});

_Date.fromNum = _curry(function(num) {
    return new Date(num);
});

_Date.show = _curry(function(_Date) {
    return "Date('" + _Date.toUTCString() + "')";
});


_Date.serializeBE = _compose(_Number.serializeBE, _Date.toNum);

_Date.serializeLE = _compose(_Number.serializeLE, _Date.toNum);

_Date.deserializeByteLength = _Number.deserializeByteLength;

_Date.deserializeBE = _compose(_Date.fromNum, _Number.deserializeBE);

_Date.deserializeLE = _compose(_Date.fromNum, _Number.deserializeLE);

_Date.deserializeByteLengthBE = _Number.deserializeByteLengthBE;

_Date.deserializeByteLengthLE = _Number.deserializeByteLengthLE;
