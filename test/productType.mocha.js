var assert = require('assert');

var _ = require('../src/lambdash');

var productType = _.Type.product;

var assertEqual = function(left, right) {
    if (!_.eq(left,right)) {
        assert.fail(left, right, undefined, 'eq');
    }
};

describe('productType', function() {
    var Test = productType('Test', {i: _.Int, a: _.Any});
    it('should create a new type from a definition', function() {

        assert.equal(typeof Test, 'function');
        assert.equal(Test.name, 'Test');

        var t = Test(1,'ok');
        assert(t instanceof Test);
        assert.equal(t.i, 1);
        assert.equal(t.a, 'ok');
        assert.equal(t[0], 1);
        assert.equal(t[1], 'ok');
        assert.equal(t.length, 2);

        try {
            var t = Test('bad', 'ok');
            assert(false);
        } catch (e) {
            assert(e instanceof TypeError);
        }
    });

    describe('#unapply', function() {
        it('should apply a product type as an array to a function', function() {
            var t = Test(1,'ok');
            Test.unapply(function(i,a) {
                assert.equal(arguments.length, 2);
                assert.equal(i,1);
                assert.equal(a,'ok');
            });
        });
    });

    describe('#eq', function() {
        it('should return true if two product types are equal, false otherwise', function() {
            var t1 = Test(1,'ok');
            var t2 = Test(1, 'ok');
            var t3 = Test(2, 'ok');
            var t4 = Test(1, 'nope');

            assert(t1 !== t2);
            assert.equal(_.eq(t1,t2), true);
            assert.equal(_.eq(t1,t3), false);
            assert.equal(_.eq(t1,t4), false);
            assert.equal(_.eq(t3,t4), false);
        });
    });

    describe('#fromObject, #fromJSON', function() {
        it('should create a product type from a plain old javascript object', function() {
            var obj = {
                i: 4,
                a: 'ok',
                q: 'whatever',
            };

            var t = Test.fromObject(obj);
            assertEqual(t, Test(4,'ok'));
            assert.equal(t instanceof Test, true);
            t = Test.fromJSON(obj);
            assertEqual(t, Test(4,'ok'));
            assert.equal(t instanceof Test, true);
        });
    });

    describe('#toObject, #toJSON', function() {
        it('should convert a product to plain old javascript object', function() {
            var t = Test(1,'ok');

            var obj = Test.toObject(t);

            assert.equal(obj instanceof Test, false);
            assertEqual(obj, {i:1,a:'ok'});

            obj = Test.toJSON(t);

            assert.equal(obj instanceof Test, false);
            assertEqual(obj, {i:1,a:'ok'});

            t = Test(1, Test(2,'ok'));
            obj = Test.toJSON(t);

            assertEqual(obj, {i:1,a:{i:2,a:'ok'}});
        });
    });

    describe('#set', function() {
        it('should update a single tag in a product type', function() {
            var t1 = Test(1,'ok');

            var t2 = Test.set('i',2,t1);
            assert(t1 !== t2);
            assert(t2 instanceof Test);
            assertEqual(t2, Test(2,'ok'));
        });

        it('should also attach individual setters to the product type', function() {
            assert(typeof Test.setI === 'function');
            assert(typeof Test.setA === 'function');

            var t1 = Test(1,'ok');
            var t2 = Test.setI(2,t1);
            var t3 = Test.setA('changed',t1);

            assertEqual(t2, Test(2,'ok'));
            assertEqual(t3, Test(1,'changed'));
        });
    });

    describe('#patch', function() {
        it('should update multiple tag values at the same time', function() {
            var t1 = Test(1,'ok');
            var t2 = Test.patch({i:2},t1);
            var t3 = Test.patch({a:'changed'},t1);
            var t4 = Test.patch({i:3,a:'different'},t1);


            assert(t2 instanceof Test);
            assert(t3 instanceof Test);
            assert(t4 instanceof Test);
            assert(t2 !== t1);
            assert(t3 !== t1);
            assert(t4 !== t1);

            assertEqual(t2, Test(2,'ok'));
            assertEqual(t3, Test(1,'changed'));
            assertEqual(t4, Test(3,'different'));
        });
    });

    describe('#show',function() {
        it('should return a string representation of a product type value', function() {
            var t = Test(1,'abacus');
            assert.equal(Test.show(t), 'Test(1,"abacus")');
        });
    });

    describe('#member', function() {
        it('should return true if a value is an instance of a product type, false otherwise', function() {
            assert.equal(Test.member(Test(1,'ok')),true);
            assert.equal(Test.member(Test(2034,'whatever')), true);
            assert.equal(Test.member(1),false);
            assert.equal(Test.member(null),false);
            assert.equal(Test.member(undefined),false);
            assert.equal(Test.member({}),false);
        });
    });
});
