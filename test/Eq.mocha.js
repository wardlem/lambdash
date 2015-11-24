var assert = require('assert');

var productType = require('../src/productType');
var sumType = require('../src/sumType');

var Bool = require('../src/Bool');
var Num = require('../src/Num');
var Str = require('../src/Str');
var Obj = require('../src/Obj');
var Arr = require('../src/Arr');

var Eq = require('../src/Eq');

describe('Eq', function() {
    it('should return whether or not two booleans are equal', function() {
        assert.equal(Eq.equal(false, false), true);
        assert.equal(Eq.equal(false, true), false);
        assert.equal(Eq.equal(true, false), false);
        assert.equal(Eq.equal(true, true), true);
    });

    it('should return whether or not two numbers are equal', function() {
        assert.equal(Eq.equal(92,92), true);
        assert.equal(Eq.equal(92.3,92.3), true);
        assert.equal(Eq.equal(97, 45), false);
        assert.equal(Eq.equal(97.5, 45.2), false);
        assert.equal(Eq.equal(-125, 125), false);
    });

    it('should return whether or not two strings are equal', function() {
        assert.equal(Eq.equal('', ''), true);
        assert.equal(Eq.equal('abacus', 'abacus'), true);
        assert.equal(Eq.equal('abc', '123'), false);
    });

    it('should return whether or not two arrays are structurally equal', function() {
        assert.equal(Eq.equal([], []), true);
        assert.equal(Eq.equal([], [1]), false);
        assert.equal(Eq.equal([1,2,3], [1,2,3]), true);
        assert.equal(Eq.equal([1,2,3], [1,2,4]), false);
        assert.equal(Eq.equal([2,2,3], [1,2,3]), false);
        assert.equal(Eq.equal([3,2,1], [1,2,3]), false);
        assert.equal(Eq.equal([[1,2,3],[4,5,6]], [[1,2,3], [4,5,6]]), true);
        assert.equal(Eq.equal([[1,2,3],[4,5,6]], [[1,2,3], [4,5,7]]), false);
    });

    it('should return whether two objects are structurally equal', function() {
        assert.equal(Eq.equal({}, {}), true);
        assert.equal(Eq.equal({a:1}, {}), false);
        assert.equal(Eq.equal({a:1}, {a:1}), true);
        assert.equal(Eq.equal({a:1}, {a:2}), false);
        assert.equal(Eq.equal({a:[1]}, {a:[1]}), true);
        assert.equal(Eq.equal({a:[1]}, {a:[2]}), false);
        assert.equal(Eq.equal({a:1}, {b:1}), false);
        assert.equal(Eq.equal({a:1, b:2, c:3}, {a:1, b:2, c:3}), true);
    });

    it('should return whether or not two product types are considered equal', function() {
        var Point = productType('Point', {x: Num, y: Num});

        assert.equal(Eq.equal(Point(1,2), Point(1,2)), true);
        assert.equal(Eq.equal(Point(1,2), Point(1,3)), false);
    });

    it('should return whether or not two sum types are considered equal', function() {
        var Test = sumType('Test', {CaseA: {val: Num}, CaseB: {val: Num}});
        var CaseA = Test.CaseA;
        var CaseB = Test.CaseB;

        assert.equal(Eq.equal(CaseA(1), CaseA(1)), true);
        assert.equal(Eq.equal(CaseB(1), CaseB(1)), true);

        assert.equal(Eq.equal(CaseA(1), CaseA(2)), false);
        assert.equal(Eq.equal(CaseB(2), CaseB(1)), false);
        assert.equal(Eq.equal(CaseA(1), CaseB(1)), false);

        Test.equal = function(left, right) {
            return left.val === right.val;
        };

        assert.equal(Eq.equal(CaseA(1), CaseA(1)), true);
        assert.equal(Eq.equal(CaseB(1), CaseB(1)), true);

        assert.equal(Eq.equal(CaseA(1), CaseA(2)), false);
        assert.equal(Eq.equal(CaseB(2), CaseB(1)), false);
        assert.equal(Eq.equal(CaseA(1), CaseB(1)), true);
    });
});