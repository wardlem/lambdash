var assert = require('assert');

var _curry = require('../src/internal/_curry');

var Numeric = require('../src/Numeric');
var Int = require('../src/Integer');
var Num = require('../src/Number');

var productType = require('../src/productType');

var Ratio = productType('Ratio', {numerator: Int, denominator: Int});

Ratio.toNum = function(ratio) {
    return ratio.numerator / ratio.denominator;
};

Ratio.toInt = function(ratio) {
    return Ratio.toNum(ratio) << 0;
};

Ratio.fromInt = function(value) {
    return Ratio(value, 1);
};

Ratio.fromNum = function(a) {
    // there has to be a better way to do this

    var exp = 1;

    while ((a * exp) << 0 != (a * exp) && exp < 1000000) {
        exp *= 10;
    }

    return Ratio((a * exp) << 0, exp);
};

Ratio.add = _curry(function(a, b) {
    var num = (a.numerator * b.denominator + b.numerator * a.denominator);
    var den = b.denominator * a.denominator;

    return Ratio(num, den);
});

Ratio.sub = _curry(function(a, b) {
    var num = (a.numerator * b.denominator - b.numerator * a.denominator);
    var den = b.denominator * a.denominator;

    return Ratio(num, den);
});

Ratio.mul = _curry(function(a, b) {
    return Ratio(a.numerator * b.numerator, a.denominator * b.denominator);
});

Ratio.div = _curry(function(a, b) {
    return Ratio.mul(a, Ratio.reciprocal(b));
});

Ratio.mod = _curry(function(a, b) {
    // there must be a better way...
    var div = Ratio.fromInt(Ratio.toInt(Ratio.div(a, b)));
    return Ratio.sub(a, Ratio.mul(div, b));
});


Ratio.reciprocal = function(a) {
    return Ratio(a.denominator, a.numerator);
};

Ratio.sign = function(a) {
    return Ratio.fromInt(Numeric.sign(a.numerator) * Numeric.sign(a.denominator));
};

describe('Numeric', function() {
    describe('#add',function(){
        it('should add two implementing values together', function(){
            assert.equal(Numeric.add(1,2), 3);
            assert.equal(Numeric.add(1)(2), 3);

            var ratio = Numeric.add(Ratio(1,2), Ratio(1,4));
            assert.equal(ratio.numerator / ratio.denominator, 0.75);
            assert.equal(Ratio.toNum(ratio), 0.75);
        });
    });

    describe('#sub',function(){
        it('should subtract two implementing values together', function(){
            assert.equal(Numeric.sub(1,2), -1);
            assert.equal(Numeric.sub(1)(2), -1);

            var ratio = Numeric.sub(Ratio(1,2), Ratio(1,4));
            assert.equal(ratio.numerator / ratio.denominator, 0.25);
            assert.equal(Ratio.toNum(ratio), 0.25);
        });


    });

    describe('#subBy',function(){
        it('should subtract two implementing values together with reversed arguments', function(){
            assert.equal(Numeric.subBy(1,2), 1);
            assert.equal(Numeric.subBy(1)(2), 1);

            var ratio = Numeric.subBy(Ratio(1,2), Ratio(1,4));
            assert.equal(ratio.numerator / ratio.denominator, -0.25);
            assert.equal(Ratio.toNum(ratio), -0.25);
        });
    });

    describe('#mul', function() {
        it('should multiply two implementing values together', function(){
            assert.equal(Numeric.mul(3,2), 6);
            assert.equal(Numeric.mul(-4)(2), -8);

            var ratio = Numeric.mul(Ratio(1,2), Ratio(1,4));
            assert.equal(ratio.numerator / ratio.denominator, 0.125);
            assert.equal(Ratio.toNum(ratio), 0.125);
        });
    });

    describe('#div', function() {
        it('should divide two implementing values', function(){
            assert.equal(Numeric.div(3,2), 1.5);
            assert.equal(Numeric.div(-4)(2), -2);

            var ratio = Numeric.div(Ratio(1,2), Ratio(1,4));
            assert.equal(ratio.numerator / ratio.denominator, 2);
            assert.equal(Ratio.toNum(ratio), 2);
        });
    });

    describe('#divBy', function() {
        it('should divide two implementing values together with switched precedence', function(){
            assert.equal(Numeric.divBy(8,2), 0.25);
            assert.equal(Numeric.divBy(-4)(2), -0.5);

            var ratio = Numeric.divBy(Ratio(1,2), Ratio(1,4));
            assert.equal(ratio.numerator / ratio.denominator, 0.5);
            assert.equal(Ratio.toNum(ratio), 0.5);
        });
    });

    describe('#mod', function() {
        it('should return the modulus of two numbers', function(){
            assert.equal(Numeric.mod(3,2), 1);
            assert.equal(Numeric.mod(-7)(4), -3);

            var ratio = Numeric.mod(Ratio(-39,3), Ratio(10,2));
            assert.equal(ratio.numerator / ratio.denominator, -3);
            assert.equal(Ratio.toNum(ratio), -3);
        });
    });

    describe('#modBy', function() {
        it('should return the modulus of two numbers with parameters reversed', function(){
            assert.equal(Numeric.modBy(2,3), 1);
            assert.equal(Numeric.modBy(-4)(7), 3);

            var ratio = Numeric.modBy(Ratio(10,2), Ratio(-39,3));
            assert.equal(ratio.numerator / ratio.denominator, -3);
            assert.equal(Ratio.toNum(ratio), -3);
        });
    });

    describe('#abs', function() {
        it('should return the absolute value of an implementing value', function(){
            assert.equal(Numeric.abs(2), 2);
            assert.equal(Numeric.abs(-2), 2);
            assert.equal(Numeric.abs(-8928342), 8928342);

            var ratio = Numeric.abs(Ratio(-1, 4));
            assert.equal(Ratio.toNum(ratio), 0.25);
        });
    });

    describe('#sign', function() {
        it('should get the sign of an implementing value', function() {
            assert.equal(Numeric.sign(2), 1);
            assert.equal(Numeric.sign(-21), -1);
            assert.equal(Numeric.sign(0), 0);
            assert.equal(Numeric.sign(-0), 0);

            var plusOne = Numeric.sign(Ratio(5,2));
            var plusOne2 = Numeric.sign(Ratio(-5,-9));
            var minusOne = Numeric.sign(Ratio(-5,7));
            var minusOne2 = Numeric.sign(Ratio(5,-9));
            var zero = Numeric.sign(Ratio(0,2098));

            assert.equal(Ratio.toNum(plusOne), 1);
            assert.equal(Ratio.toNum(plusOne2), 1);
            assert.equal(Ratio.toNum(minusOne), -1);
            assert.equal(Ratio.toNum(minusOne2), -1);
            assert.equal(Ratio.toNum(zero), 0);
        });
    });

    describe('#negate', function() {
        it('should negate an implementing value', function() {
            assert.equal(Numeric.negate(1), -1);
            assert.equal(Numeric.negate(-89), 89);
            assert.equal(Numeric.negate(0), 0);

            var ratio1 = Numeric.negate(Ratio(5,4));
            var ratio2 = Numeric.negate(Ratio(-8,2));
            var ratio3 = Numeric.negate(Ratio(0, 189));

            assert.equal(Ratio.toNum(ratio1), -1.25);
            assert.equal(Ratio.toNum(ratio2), 4);
            assert.equal(Ratio.toNum(ratio3), 0);
        });
    });

    describe('#reciprocal', function() {
        it('should return the reciprocal of an implementing value', function(){
            assert.equal(Numeric.reciprocal(4), 0.25);
            assert.equal(Numeric.reciprocal(0.25), 4);

            var ratio1 = Numeric.reciprocal(Ratio(2,4));
            var ratio2 = Numeric.reciprocal(Ratio(5,7));

            assert.equal(Ratio.toNum(ratio1), 2);
            assert.equal(Ratio.toNum(ratio2), 7/5);
        });
    });

    describe('#pow', function() {
        it('should return the value raised to the power', function() {
            assert.equal(Numeric.pow(1,10), 1);
            assert.equal(Numeric.pow(2,3), 8);
            assert.equal(Numeric.pow(3,4), 81);
            assert.equal(Numeric.pow(10000,0), 1);

            var ratio1 = Numeric.pow(Ratio(1,2), Ratio(2,1));
            assert.equal(Numeric.toNum(ratio1), 0.25);

            var ratio2 = Numeric.pow(Ratio(123123,1231241), Ratio(0, 12341235));
            assert.equal(Numeric.toNum(ratio2), 1);
        });
    });

    describe('#powBy', function() {
        it('should return the value raised to power with parameters reversed', function() {
            assert.equal(Numeric.powBy(10,1), 1);
            assert.equal(Numeric.powBy(2,3), 9);
            assert.equal(Numeric.powBy(3,4), 64);

            var ratio1 = Numeric.powBy(Ratio(2,1), Ratio(9,3));
            assert.equal(Numeric.toNum(ratio1), 9);
        });
    });
});