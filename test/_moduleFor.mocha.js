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
        assert.equal(B.name, 'Bool');

        var N = _moduleFor(num);
        assert.equal(typeof N, 'function');
        assert.equal(N.name, 'Num');

        var A = _moduleFor(arr);
        assert.equal(typeof A, 'function');
        assert.equal(A.name, 'Arr');

        var S = _moduleFor(str);
        assert.equal(typeof S, 'function');
        assert.equal(S.name, 'Str');

        var O = _moduleFor(obj);
        assert.equal(typeof O, 'function');
        assert.equal(O.name, 'Obj');

        var F = _moduleFor(fun);
        assert.equal(typeof F, 'function');
        assert.equal(F.name, 'Fun');
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

        assert(Sum.valid(a));
        assert(Sum.A.valid(a));
        assert(Sum.valid(b));

        var sliced = _slice(a);
        assert(Array.isArray(sliced));
        assert.equal(sliced[0], 1);
        assert.equal(sliced[1], 2);

        assert.equal(_moduleFor(a), Sum);
        assert.equal(_moduleFor(b), Sum);
    })
});