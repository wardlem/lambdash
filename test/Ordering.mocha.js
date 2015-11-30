var assert = require('assert');

var Ordering = require('../src/Ordering');
var _always = require('../src/internal/_always');

describe('Ordering', function() {
    describe('#isLessThan', function() {
        it('should return true only if the value is Ordering.LT', function() {
            assert.equal(Ordering.isLessThan(Ordering.LT), true);
            assert.equal(Ordering.isLessThan(Ordering.EQ), false);
            assert.equal(Ordering.isLessThan(Ordering.GT), false);
        });
    });

    describe('#isEqual', function() {
        it('should return true only if the value is Ordering.LT', function() {
            assert.equal(Ordering.isEqual(Ordering.LT), false);
            assert.equal(Ordering.isEqual(Ordering.EQ), true);
            assert.equal(Ordering.isEqual(Ordering.GT), false);
        });
    });

    describe('#isGreaterThan', function() {
        it('should return true only if the value is Ordering.LT', function() {
            assert.equal(Ordering.isGreaterThan(Ordering.LT), false);
            assert.equal(Ordering.isGreaterThan(Ordering.EQ), false);
            assert.equal(Ordering.isGreaterThan(Ordering.GT), true);
        });
    });

    describe('.LT', function() {
        it('its methods should return the proper values', function() {
            assert.equal(Ordering.LT.isLessThan(), true);
            assert.equal(Ordering.LT.isEqual(), false);
            assert.equal(Ordering.LT.isGreaterThan(), false);
        });
    });

    describe('.EQ', function() {
        it('its methods should return the proper values', function() {
            assert.equal(Ordering.EQ.isLessThan(), false);
            assert.equal(Ordering.EQ.isEqual(), true);
            assert.equal(Ordering.EQ.isGreaterThan(), false);
        });
    });

    describe('.GT', function() {
        it('its methods should return the proper values', function() {
            assert.equal(Ordering.GT.isLessThan(), false);
            assert.equal(Ordering.GT.isEqual(), false);
            assert.equal(Ordering.GT.isGreaterThan(), true);
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

    describe('#toInteger', function() {
        it('should return the correct integer', function() {
            assert.equal(Ordering.toInteger(Ordering.LT), -1);
            assert.equal(Ordering.toInteger(Ordering.EQ), 0);
            assert.equal(Ordering.toInteger(Ordering.GT), 1);
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