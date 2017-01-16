var assert = require('assert');

var _moduleFor = require('../src/internal/_moduleFor');
var _slice = require('../src/internal/_slice');
var productType = require('../src/productType');
var sumType = require('../src/sumType');

describe('_moduleFor', function(){
    it('should return the right module for builtin types', function(){
        var bool = false;
        var num = 1;
        var arr = [];
        var str = "ok";
        var obj = {};
        var fun = function(){};

        var B = _moduleFor(bool);
        assert.equal(typeof B, 'function');
        assert.equal(B.name, '_Boolean');

        var N = _moduleFor(num);
        assert.equal(typeof N, 'function');
        assert.equal(N.name, '_Number');

        var A = _moduleFor(arr);
        assert.equal(typeof A, 'function');
        assert.equal(A.name, '_Array');

        var S = _moduleFor(str);
        assert.equal(typeof S, 'function');
        assert.equal(S.name, '_String');

        var O = _moduleFor(obj);
        assert.equal(typeof O, 'function');
        assert.equal(O.name, '_Object');

        var F = _moduleFor(fun);
        assert.equal(typeof F, 'function');
        assert.equal(F.name, '_Function');
    });

    it('should return the product constructor for a product value', function(){
        var Point = productType('Point', {x: null, y: null});

        var p = Point(1,2);

        var P = _moduleFor(p);
        assert.equal(P, Point);
    });

    it('should return the sum constructor for a sum value', function() {
        var Sum = sumType('Sum', {A: {x: null, y: null}, B: []});

        var a = Sum.A(1,2);
        var b = Sum.B;

        assert(Sum.member(a));
        assert(Sum.A.member(a));
        assert(Sum.member(b));

        var sliced = _slice(a);
        assert(Array.isArray(sliced));
        assert.equal(sliced[0], 1);
        assert.equal(sliced[1], 2);

        assert.equal(_moduleFor(a), Sum);
        assert.equal(_moduleFor(b), Sum);
    })
});
