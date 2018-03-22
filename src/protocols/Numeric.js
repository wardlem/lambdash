const Protocol = require('./Protocol');

function unaryOp(key) {
    return function unaryOp() {
        const _this = this[Numeric.toNumber]();
        return this.fromNumber(_this[Numeric[key]]());
    };
}

function binaryOp(key) {
    return function binaryOp(other) {
        const _this = this[Numeric.toNumber]();
        const _other = other[Number.toNumber]();
        return this.fromNumber(_this[Numeric[key]](_other));
    };
}

const Numeric = Protocol.define('Numeric', {
    toNumber: null,
    fromNumber: null,
    plus: binaryOp('plus'),
    minus: binaryOp('minus'),
    times: binaryOp('times'),
    divide: binaryOp('divide'),
    modulus: binaryOp('modulus'),
    pow: binaryOp('pow'),
    abs: unaryOp('abs'),
    sign: unaryOp('sign'),
    negate: unaryOp('negate'),
    reciprocal: unaryOp('reciprocal'),
    round: unaryOp('round'),
    ceil: unaryOp('ceil'),
    floor: unaryOp('floor'),
    trunc: unaryOp('trunc'),
});

module.exports = Numeric;
