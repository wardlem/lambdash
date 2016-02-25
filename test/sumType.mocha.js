var assert = require('assert');

var _ = require('../src/lambdash');

var sumType = _.Type.sum;

var assertEqual = function(left, right){
    if (!_.eq(left,right)){
        assert.fail(left, right, undefined, 'eq');
    }
};

describe('#sumType', function(){
    var Test = sumType('Test', {
        A: {a:_.Any},
        B: {b:_.Int},
        C: {}
    });

    var A = Test.A,
        B = Test.B,
        C = Test.C

    it('should create a type that can be one of several product types', function(){
        assert(typeof Test === 'function');
        assert(typeof Test.A === 'function');
        assert(typeof Test.B === 'function');
        assert(typeof Test.C === 'object');
        assert.equal(Test.C.length, 0);

        assert(A('whatever') instanceof Test);
        assert(A('whatever') instanceof A);
        assert(B(1) instanceof Test);
        assert(B(1) instanceof B);
        assert(C instanceof Test);

        assert(typeof Test.isA === 'function');
        assert.equal(Test.isA(A('whatever')), true);
        assert.equal(Test.isA(B(1)),false);
        assert.equal(Test.isA(C),false);

        assert(typeof Test.isB === 'function');
        assert.equal(Test.isB(A('whatever')), false);
        assert.equal(Test.isB(B(1)),true);
        assert.equal(Test.isB(C),false);

        assert(typeof Test.isC === 'function');
        assert.equal(Test.isC(A('whatever')), false);
        assert.equal(Test.isC(B(1)),false);
        assert.equal(Test.isC(C),true);

        assert.equal(_.Type.moduleFor(A('ok')), Test);
        assert.equal(_.Type.moduleFor(B(1)), Test);
        assert.equal(_.Type.moduleFor(C), Test);

    });

    describe('#match', function(){
        it('should match against its instances by name', function(){
            var a = A('whatever');
            var b = B(1);

            var _case = Test.case({
                A: function(v){assert(arguments.length === 1); assert(v === 'whatever'); return '_A_';},
                B: function(v){assert(arguments.length === 1); assert(v === 1); return '_B_'},
                C: function(){assert(arguments.length === 0); return '_C_'}
            });

            assert.equal(_case(a), '_A_');
            assert.equal(_case(b), '_B_');
            assert.equal(_case(C), '_C_');

            _case = Test.case({
                _: function(){return 'ok'}
            });

            assert.equal(_case(a),'ok');
            assert.equal(_case(b),'ok');
            assert.equal(_case(C),'ok');

            _case = Test.case({
                A: '_A_',
                _: 'ok'
            });

            assert.equal(_case(a),'_A_');
            assert.equal(_case(b), 'ok');
            assert.equal(_case(C), 'ok');
        });

        it('should throw an exception if a case is missing', function(){
            var _case = Test.case({
                A: 'ok',
                C: 'ok'
            });

            try {
                _case(B(1));
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });

        it('should throw an exception if the given value is not a member of the type', function(){
            var _case = Test.case({
                A: 'ok',
                B: 'ok',
                C: 'ok'
            });

            try {
                _case({});
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#eq', function(){
        it('should return true if two values are structurally equal', function(){
            assert.equal(Test.eq(A(1),A('whatever')), false);
            assert.equal(Test.eq(A(1),A(1)), true);
            assert.equal(Test.eq(A(1),B(1)),false);
            assert.equal(Test.eq(C,C),true);
            assert.equal(Test.eq(B(2),B(1)),false);
            assert.equal(Test.eq(B(1),B(1)),true);
        });

        it('should throw an exception if the right or left value is not a member of the type', function(){
            try {
                Test.eq(1, A('whatever'));
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }

            try {
                Test.eq(B(1), {});
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#unapply', function(){
        it('should forward to the instances unapply function', function(){
            var a = A('ok');
            var b = B(1);

            var ranA = false;
            var ranB = false;
            var ranC = false;

            Test.unapply(function(v){assert(v === 'ok'); ranA = true},a);
            Test.unapply(function(v){assert(v === 1); ranB = true}, b);
            Test.unapply(function(){ranC = true}, C);

            assert(ranA);
            assert(ranB);
            assert(ranC);
        });
    });

    describe('#set', function(){
        it('should forward to the instances set method', function(){
            var a = A('ok');
            var b = B(1);

            var a2 = Test.set('a', 'changed',a);
            assertEqual(a2, A('changed'));

            var b2 = Test.set('b', 3, b);
            assertEqual(b2, B(3));

            var c2 = Test.set('notreal', 'whatever', C);
            assert(c2 === C);
        });
    });

    describe('#patch', function(){
        it('should forward to the instances patch method', function(){
            var a = A('ok');
            var b = B(1);

            var a2 = Test.patch({a:'changed'}, a);
            assertEqual(a2, A('changed'));

            var b2 = Test.patch({b: 4}, b);
            assertEqual(b2, B(4));

            var c2 = Test.patch({c:'whatever'},C);
            assert(c2 === C);
        });
    });

    describe('#toJSON', function(){
        it('should convert a sum value to JSON and mark the type', function(){
            var a = A('ok');
            var b = B(1);

            var aJSON = Test.toJSON(a);
            var bJSON = Test.toJSON(b);
            var cJSON = Test.toJSON(C);

            assert.equal(aJSON instanceof Test, false);
            assert.equal(bJSON instanceof Test, false);
            assert.equal(cJSON instanceof Test, false);

            assertEqual(aJSON, {__tag__: 'A', data: {a:'ok'}});
            assertEqual(bJSON, {__tag__: 'B', data: {b: 1}});
            assertEqual(cJSON, {__tag__: 'C', data: {}});
        });
    });

    describe('#fromJSON', function(){
        it('should create a sum value frorm a plain old javascript object', function(){
            var aJSON = {__tag__: 'A', data: {a:'ok'}};
            var bJSON = {__tag__: 'B', data: {b: 1}};
            var cJSON = {__tag__: 'C', data: {}};
            var dJSON = {__tag__: 'D', data: {}};

            var a = Test.fromJSON(aJSON);
            var b = Test.fromJSON(bJSON);
            var c = Test.fromJSON(cJSON);

            assertEqual(a, A('ok'));
            assertEqual(b, B(1));
            assertEqual(c, C);

            try {
                var d = Test.fromJSON(dJSON);
                assert(false)
            } catch (e) {
                assert(e instanceof TypeError);
            }

            try {
                var d = Test.fromJSON({});
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#show', function(){
        it('should create a string representation of a sum', function(){
            var a = A('ok');
            var b = B(1);

            assert.equal(Test.show(a), 'Test.A("ok")');
            assert.equal(Test.show(b), 'Test.B(1)');
            assert.equal(Test.show(C), 'Test.C');
        });
    });
});
