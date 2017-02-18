var assert = require('assert');

var productType = require('../src/productType');
var sumType = require('../src/sumType');

var Bool = require('../src/Boolean');
var Num = require('../src/Number');
var Str = require('../src/String');
var Obj = require('../src/Object');
var Arr = require('../src/Array');

var Eq = require('../src/Eq');

describe('Eq', function() {
    describe('#eq', function() {
        it('should return whether or not two booleans are equal', function() {
            assert.equal(Eq.eq(false, false), true);
            assert.equal(Eq.eq(false, true), false);
            assert.equal(Eq.eq(true, false), false);
            assert.equal(Eq.eq(true, true), true);
        });

        it('should return whether or not two numbers are equal', function() {
            assert.equal(Eq.eq(92,92), true);
            assert.equal(Eq.eq(92.3,92.3), true);
            assert.equal(Eq.eq(97, 45), false);
            assert.equal(Eq.eq(97.5, 45.2), false);
            assert.equal(Eq.eq(-125, 125), false);
        });

        it('should return whether or not two strings are equal', function() {
            assert.equal(Eq.eq('', ''), true);
            assert.equal(Eq.eq('abacus', 'abacus'), true);
            assert.equal(Eq.eq('abc', '123'), false);
        });

        it('should return whether or not two arrays are structurally equal', function() {
            assert.equal(Eq.eq([], []), true);
            assert.equal(Eq.eq([], [1]), false);
            assert.equal(Eq.eq([1,2,3], [1,2,3]), true);
            assert.equal(Eq.eq([1,2,3], [1,2,4]), false);
            assert.equal(Eq.eq([2,2,3], [1,2,3]), false);
            assert.equal(Eq.eq([3,2,1], [1,2,3]), false);
            assert.equal(Eq.eq([[1,2,3],[4,5,6]], [[1,2,3], [4,5,6]]), true);
            assert.equal(Eq.eq([[1,2,3],[4,5,6]], [[1,2,3], [4,5,7]]), false);
        });

        it('should return whether two objects are structurally equal', function() {
            assert.equal(Eq.eq({}, {}), true);
            assert.equal(Eq.eq({a:1}, {}), false);
            assert.equal(Eq.eq({a:1}, {a:1}), true);
            assert.equal(Eq.eq({a:1}, {a:2}), false);
            assert.equal(Eq.eq({a:[1]}, {a:[1]}), true);
            assert.equal(Eq.eq({a:[1]}, {a:[2]}), false);
            assert.equal(Eq.eq({a:1}, {b:1}), false);
            assert.equal(Eq.eq({a:1, b:2, c:3}, {a:1, b:2, c:3}), true);
        });

        it('should return whether or not two product types are considered equal', function() {
            var Point = productType('Point', {x: Num, y: Num});

            assert.equal(Eq.eq(Point(1,2), Point(1,2)), true);
            assert.equal(Eq.eq(Point(1,2), Point(1,3)), false);
        });

        it('should return whether or not two sum types are considered equal', function() {
            var Test = sumType('Test', {CaseA: {val: Num}, CaseB: {val: Num}});
            var CaseA = Test.CaseA;
            var CaseB = Test.CaseB;

            assert.equal(Eq.eq(CaseA(1), CaseA(1)), true);
            assert.equal(Eq.eq(CaseB(1), CaseB(1)), true);

            assert.equal(Eq.eq(CaseA(1), CaseA(2)), false);
            assert.equal(Eq.eq(CaseB(2), CaseB(1)), false);
            assert.equal(Eq.eq(CaseA(1), CaseB(1)), false);

            Test.eq = function(left, right) {
                return left.val === right.val;
            };

            assert.equal(Eq.eq(CaseA(1), CaseA(1)), true);
            assert.equal(Eq.eq(CaseB(1), CaseB(1)), true);

            assert.equal(Eq.eq(CaseA(1), CaseA(2)), false);
            assert.equal(Eq.eq(CaseB(2), CaseB(1)), false);
            assert.equal(Eq.eq(CaseA(1), CaseB(1)), true);
        });
    });

    describe('#neq', function() {
        it('should return the inverse of eq', function() {
            assert(Eq.neq(1,2));
            assert(Eq.neq('a', 'b'));
            assert(!Eq.neq('a', 'a'));
        });
    });

    describe('#member', function() {
        it('should return true if a value is a member of Eq, false otherwise', function() {
            assert(Eq.member(1));
            assert(Eq.member([]));
            assert(Eq.member({}));
            assert(!Eq.member(function() {}));
        });
    });

});
