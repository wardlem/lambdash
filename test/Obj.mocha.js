var assert = require('assert');

var _ = require('../src/lambdash');

var Obj = _.Obj;

var assertEqual = function(left, right){
    if (!_.eq(left,right)){
        assert.fail(left, right, undefined, 'eq');
    }
};

describe('Obj', function(){
    describe('#eq', function(){
        it('should return true if two objects have all the same keys and values, false otherwise', function(){
            assert.equal(Obj.eq({},{}),true);
            assert.equal(Obj.eq({a:1,b:2},{a:1,b:2}),true);
            assert.equal(Obj.eq({a:1,b:2},{b:2,a:1}),true);
            assert.equal(Obj.eq({a:1,b:[1,2]},{b:[1,2],a:1}),true);

            assert.equal(Obj.eq({},{a:1}),false);
            assert.equal(Obj.eq({a:1},{}),false);
            assert.equal(Obj.eq({a:1},{a:2}),false);
            assert.equal(Obj.eq({a:1},{b:1}),false);
            assert.equal(Obj.eq({a:1,b:2},{a:1,b:3}),false);
            assert.equal(Obj.eq({a:1,b:[1,2]},{b:[1,3],a:1}),false);
        });
    });

    describe('#compare', function(){
        it('should return an ordering based on the keys and values in the object', function(){
            assert.equal(Obj.compare({},{}), _.EQ);
            assert.equal(Obj.compare({a:1,b:2},{a:1,b:2}), _.EQ);
            assert.equal(Obj.compare({a:1,b:2},{b:2,a:1}), _.EQ);
            assert.equal(Obj.compare({a:1,b:[1,2]},{b:[1,2],a:1}), _.EQ);

            assert.equal(Obj.compare({},{a:1}), _.LT);
            assert.equal(Obj.compare({a:1},{}), _.GT);
            assert.equal(Obj.compare({a:1},{a:2}), _.LT);
            assert.equal(Obj.compare({a:2},{a:1}), _.GT);
            assert.equal(Obj.compare({a:1},{b:1}), _.LT);
            assert.equal(Obj.compare({b:1},{a:1}), _.GT);
            assert.equal(Obj.compare({a:1,b:2},{a:1,b:3}), _.LT);
            assert.equal(Obj.compare({a:1,b:4},{a:1,b:3}), _.GT);
            assert.equal(Obj.compare({a:1,b:[1,2]},{b:[1,3],a:1}), _.LT);
            assert.equal(Obj.compare({a:1,b:[1,4]},{b:[1,3],a:1}), _.GT);
        });
    });

    describe('#map', function(){
        it('should map the own values of an object', function(){
            var obj = {a:1, b:3};

            var fn = function(v){
                return v * 3;
            };

            assert(Obj.eq(Obj.map(fn, obj), {a:3, b:9}));
        });
    });

    describe('#mapAssoc', function(){
        it('should map the own values of an object with the keys', function(){
            var obj = {a:1, b:3};

            var fn = function(v, k){
                return k + ':' + v * 3;
            };

            assert(Obj.eq(Obj.mapAssoc(fn, obj), {a:'a:3', b:'b:9'}));
        });
    });

    describe('#concat', function(){
        it('should join two objects together with a right value bias', function(){
            assert.equal(Obj.eq(Obj.concat({a:1},{b:2}), {a:1,b:2}), true)
            assert.equal(Obj.eq(Obj.concat({a:1},{a:2}), {a:2}), true)
            assert.equal(Obj.eq(Obj.concat({a:1,b:2,c:3},{c:4,d:5}), {a:1,b:2,c:4,d:5}), true)
        });
    });

    describe('#empty', function(){
        it('should always return an empty object', function(){
            assertEqual(Obj.empty(), {});
        });
    });

    describe('#union', function(){
        it('should join two objects together with a left value bias', function(){
            assert.equal(Obj.eq(Obj.union({a:1},{b:2}), {a:1,b:2}), true);
            assert.equal(Obj.eq(Obj.union({a:1},{a:2}), {a:1}), true);
            assert.equal(Obj.eq(Obj.union({a:1,b:2,c:3},{c:4,d:5}), {a:1,b:2,c:3,d:5}), true)
        });
    });

    describe('#difference', function(){
        it('should return an object with all keys removed from the left that do not exist in the right', function(){
            assertEqual(Obj.difference({a:1,b:2},{c:3}), {a:1,b:2});
            assertEqual(Obj.difference({a:1,b:2},{b:3,d:4}), {a:1});
            assertEqual(Obj.difference({a:1,b:2},{b:3,a:4}), {});
        });
    });

    describe('#intersection', function(){
        it('should return an object with all keys in both the left and right and values of the left', function(){
            assertEqual(Obj.intersection({a:1,b:2},{c:3}), {});
            assertEqual(Obj.intersection({a:1,b:2},{b:3,d:4}), {b:2});
            assertEqual(Obj.intersection({a:1,b:2},{b:3,a:4}), {a:1, b:2});
        });
    });

    describe('#symmetricDifference', function(){
        it('should return an object with all keys that exist in one but not both of left and right', function(){
            assertEqual(Obj.symmetricDifference({a:1,b:2},{c:3}), {a:1,b:2,c:3});
            assertEqual(Obj.symmetricDifference({a:1,b:2},{b:3,d:4}), {a:1,d:4});
            assertEqual(Obj.symmetricDifference({a:1,b:2},{b:3,a:4}), {});
        });
    });

    describe('#foldl', function(){
        it('should fold an object with keys sorted', function(){
            var obj = {c: 'C', a: 'A', b: 'B'};

            var res = Obj.foldl(function(accum, v){
                return accum + v;
            }, 'Z', obj);

            assert.equal(typeof res, 'string');
            assert.equal(res, 'ZABC');
        });
    });

    describe('#foldr', function(){
        it('should fold an object with keys sorted', function(){
            var obj = {c: 'C', a: 'A', b: 'B'};

            var res = Obj.foldr(function(accum, v){
                return accum + v;
            }, 'Z', obj);

            assert.equal(typeof res, 'string');
            assert.equal(res, 'ZCBA');
        });
    });

    describe('#foldlAssoc', function(){
        it('should fold an object with keys sorted', function(){
            var obj = {c: 'C', a: 'A', b: 'B'};

            var res = Obj.foldlAssoc(function(accum, v, k){
                return accum + v + k;
            }, 'Z', obj);

            assert.equal(typeof res, 'string');
            assert.equal(res, 'ZAaBbCc');
        });
    });

    describe('#foldr', function(){
        it('should fold an object with keys sorted', function(){
            var obj = {c: 'C', a: 'A', b: 'B'};

            var res = Obj.foldrAssoc(function(accum, v, k){
                return accum + v + k;
            }, 'Z', obj);

            assert.equal(typeof res, 'string');
            assert.equal(res, 'ZCcBbAa');
        });
    });

    describe('#copy', function(){
        it('should create a new object identical to another', function(){
            var obj = {a:1, b:2, c:3};

            var res = Obj.copy(obj);

            assert(obj !== res);
            assertEqual(obj, res);
        });
    });

    describe('#assoc', function(){
        it('should create a new object with a value updated', function(){
            var obj = {a:1, b:2, c:3};

            var res1 = Obj.assoc('d', 4)(obj);

            assert(obj !== res1);
            assertEqual(obj, {a:1,b:2,c:3});
            assertEqual(res1, {a:1,b:2,c:3,d:4});

            var res2 = Obj.assoc('c', 5)(obj);

            assert(obj !== res2);
            assertEqual(obj, {a:1,b:2,c:3});
            assertEqual(res2, {a:1,b:2,c:5});
        });
    });

    describe('#dissoc', function(){
        it('should create a new object with a value updated', function(){
            var obj = {a:1, b:2, c:3};

            var res1 = Obj.dissoc('d')(obj);

            assert(obj !== res1);
            assertEqual(obj, {a:1,b:2,c:3});
            assertEqual(res1, {a:1,b:2,c:3});

            var res2 = Obj.dissoc('c')(obj);

            assert(obj !== res2);
            assertEqual(obj, {a:1,b:2,c:3});
            assertEqual(res2, {a:1,b:2});
        });
    });

    describe('#propExists', function(){
        it('should return whether or not an object has a value', function(){
            function C(a){
                this.a = a;
            }

            C.prototype.b = 2;

            var obj = new C(1);

            assert.equal(Obj.propExists('a')(obj), true);
            assert.equal(Obj.propExists('b')(obj), true);
        });

    });

    describe('#ownPropExists', function(){
        it('should return whether or not an object has an own value', function(){
            function C(a){
                this.a = a;
            }

            C.prototype.b = 2;

            var obj = new C(1);

            assert.equal(Obj.ownPropExists('a')(obj), true);
            assert.equal(Obj.ownPropExists('b')(obj), false);
        });
    });

    describe('#prop', function(){
        it('should return the given property of an object', function(){
            var obj = {a:1};

            assert.equal(Obj.prop('a')(obj),1);
            assert.equal(Obj.prop('b')(obj),undefined);
        });
    });

    describe('#propOr', function(){
        it('should return the given property of an object or a default value if it does not exist', function(){
            var obj = {a:1};

            assert.equal(Obj.propOr(5, 'a')(obj),1);
            assert.equal(Obj.propOr(5, 'b')(obj),5);
        });
    });

    describe('#props', function(){
        it('should return an array of properties if given an array', function(){
            var obj = {a:1, c:3};

            var p = Obj.props(['a', 'b', 'c'])(obj);

            assertEqual(p, [1, undefined, 3]);

            p = Obj.props('abc')(obj);
            assertEqual(p, '13');
        });
    });

    describe('#propNames', function(){
        it('should return all the keys of an object in sorted order', function(){
            function C(a){
                this.a = a;
            }

            C.prototype.b = 2;

            var obj = new C(1);

            assertEqual(Obj.propNames(obj), ['a', 'b']);
        });
    });

    describe('#ownKeys', function(){
        it('should return all the own keys of an object in sorted order', function(){
            function C(a){
                this.a = a;
            }

            C.prototype.b = 2;

            var obj = new C(1);

            assertEqual(Obj.ownPropNames(obj), ['a']);
        });
    });

    describe('#values', function(){
        it('should return all the enumerable values of an object', function(){
            function C(a){
                this.a = a;
            }

            C.prototype.b = 2;

            var obj = new C(1);

            assertEqual(Obj.values(obj), [1, 2]);
        });
    });

    describe('#ownValues', function(){
        it('should return all the enumerable own values of an object', function(){
            function C(a){
                this.a = a;
            }

            C.prototype.b = 2;

            var obj = new C(1);

            assertEqual(Obj.ownValues(obj), [1]);
        });
    });

    describe('#pairs', function(){
        it('should return an array of arrays of key value pairs', function(){
            function C(a){
                this.a = a;
            }

            C.prototype.b = 2;

            var obj = new C(1);

            assertEqual(Obj.pairs(obj), [['a', 1], ['b', 2]]);
        })
    });

    describe('#ownPairs', function(){
        it('should return an array of arrays of key value pairs', function(){
            function C(a){
                this.a = a;
            }

            C.prototype.b = 2;

            var obj = new C(1);

            assertEqual(Obj.ownPairs(obj), [['a', 1]]);
        });
    });

    describe('#fromPairs', function(){
        it('should create an object from pairs', function(){
            assertEqual(Obj.fromPairs([['a', 1],['b', 2]]), {a:1,b:2});
        });

    });

    describe('#zip', function(){
        it('should create an object from a list of keys and a list of values', function(){
            assertEqual(Obj.zip(['a','b','c'], [1,2,3]), {a:1,b:2,c:3});
        });
    });

    describe('#filter', function(){
        it('should filter all keys from an object whose values do not pass a predicate', function(){
            var obj = {
                a: 1,
                b: 2,
                c: 0,
                d: 4,
                e: 5
            };

            var res = Obj.filter(_.gt(_,2), obj);

            assertEqual(obj, {
                a: 1,
                b: 2,
                c: 0,
                d: 4,
                e: 5
            });
            assertEqual(res, {d:4,e:5});
        });
    });

    describe('#filterAssoc', function(){
        it('should filter all keys from an object whose values do not pass a predicate', function(){
            var obj = {
                a: 1,
                b: 2,
                c: 0,
                d: 4,
                e: 5
            };

            var res = Obj.filterAssoc(function(v,k){
                return _.gt(v,2) || _.eq(k, 'a');
            }, obj);

            assertEqual(obj, {
                a: 1,
                b: 2,
                c: 0,
                d: 4,
                e: 5
            });
            assertEqual(res, {d:4,e:5,a:1});
        });
    });

    describe('#show', function(){
        it('should return a string representation of an object', function(){
            var obj = {a:1, b:'B', c: []};

            assertEqual(Obj.show(obj), '{"a": 1, "b": "B", "c": []}');
        });
    });
});
