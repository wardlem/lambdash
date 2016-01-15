var assert = require('assert');

var Ordering = require('../src/Ordering');
var _always = require('../src/internal/_always');

describe('Ordering', function() {
    describe('#compare', function(){
        it('should return a comparison of two comparison', function(){
            assert.equal(Ordering.compare(Ordering.LT, Ordering.LT), Ordering.EQ);
            assert.equal(Ordering.compare(Ordering.LT, Ordering.EQ), Ordering.LT);
            assert.equal(Ordering.compare(Ordering.LT, Ordering.GT), Ordering.LT);
            assert.equal(Ordering.compare(Ordering.EQ, Ordering.EQ), Ordering.EQ);
            assert.equal(Ordering.compare(Ordering.EQ, Ordering.LT), Ordering.GT);
            assert.equal(Ordering.compare(Ordering.EQ, Ordering.GT), Ordering.LT);
            assert.equal(Ordering.compare(Ordering.GT, Ordering.GT), Ordering.EQ);
            assert.equal(Ordering.compare(Ordering.GT, Ordering.LT), Ordering.GT);
            assert.equal(Ordering.compare(Ordering.GT, Ordering.EQ), Ordering.GT);
        });
    });
    describe('#isLT', function() {
        it('should return true only if the value is Ordering.LT', function() {
            assert.equal(Ordering.isLT(Ordering.LT), true);
            assert.equal(Ordering.isLT(Ordering.EQ), false);
            assert.equal(Ordering.isLT(Ordering.GT), false);
        });
    });

    describe('#isEQ', function() {
        it('should return true only if the value is Ordering.LT', function() {
            assert.equal(Ordering.isEQ(Ordering.LT), false);
            assert.equal(Ordering.isEQ(Ordering.EQ), true);
            assert.equal(Ordering.isEQ(Ordering.GT), false);
        });
    });

    describe('#isGT', function() {
        it('should return true only if the value is Ordering.LT', function() {
            assert.equal(Ordering.isGT(Ordering.LT), false);
            assert.equal(Ordering.isGT(Ordering.EQ), false);
            assert.equal(Ordering.isGT(Ordering.GT), true);
        });
    });


    describe('#fromNumber', function() {
        it('should return the proper value based on the number', function() {
            assert.equal(Ordering.fromNum(0), Ordering.EQ);
            assert.equal(Ordering.fromNum(-1), Ordering.LT);
            assert.equal(Ordering.fromNum(1), Ordering.GT);
            assert.equal(Ordering.fromNum(-Infinity), Ordering.LT);
            assert.equal(Ordering.fromNum(Infinity), Ordering.GT);
        });
    });

    describe('#toInt', function() {
        it('should return the correct integer', function() {
            assert.equal(Ordering.toInt(Ordering.LT), -1);
            assert.equal(Ordering.toInt(Ordering.EQ), 0);
            assert.equal(Ordering.toInt(Ordering.GT), 1);
        });
    });

    describe('#case', function() {
        it('should execute a function based on the value', function(){
            var caseFn = Ordering.case({
                "LT": _always('less'),
                "EQ": _always('equal'),
                "GT": _always('greater')
            });

            assert.equal(caseFn(Ordering.LT), 'less');
            assert.equal(caseFn(Ordering.EQ), 'equal');
            assert.equal(caseFn(Ordering.GT), 'greater');
        });
    });

});