const Type = require('../../src/types/Type');
const Product = require('../../src/types/Product');
const Show = require('../../src/protocols/Show');
const Iterable = require('../../src/protocols/Iterable');
const Eq = require('../../src/protocols/Eq');
const {expect} = require('code');

describe('Product', () => {
    describe('.define', () => {
        it('returns a function', () => {
            expect(Product.define('Test', [])).to.be.a.function();
        });

        it('names the function', () => {
            expect(Product.define('Test', []).name).to.equal('Test');
        });

        it('creates a constructor', () => {
            const Test = Product.define('Test', []);
            expect(Test()).to.be.an.instanceof(Test);
        });

        it('enforces constraints given as a function', () => {
            const Test = Product.define('Test', [(v) => typeof v === 'number']);
            expect(Test(12)._0).to.equal(12);

            expect(() => Test('a')).to.throw(TypeError, 'Invalid value for property _0 when creating a new Test instance');
        });

        it('enforces constraints given as a pseudo-constructor', () => {
            const Test = Product.define('Test', [{[Type.has]: (v) => typeof v === 'number'}]);
            expect(Test(12)._0).to.equal(12);

            expect(() => Test('a')).to.throw(TypeError, 'Invalid value for property _0 when creating a new Test instance');
        });

        it('enforces a value to be defined by default', () => {
            const Test = Product.define('Test', [null]);

            expect(Test(12)._0).to.equal(12);
            expect(() => Test(undefined)).to.throw(TypeError);
        });

        it('allows properties to be specified with an object', () => {
            const Test = Product.define('Test', {
                color: null,
                size: null,
            });

            expect(Test('blue', 12).color).to.equal('blue');
            expect(Test('blue', 12).size).to.equal(12);
        });

        it('creates instances that are indexable', () => {
            const Test = Product.define('Test', {
                color: null,
                size: null,
            });

            expect(Test('blue', 12)[0]).to.equal('blue');
            expect(Test('blue', 12)[1]).to.equal(12);
        });

        it('creates immutable properties by default', () => {
            const Test = Product.define('Test', {
                color: null,
                size: null,
            });

            let test = Test('blue', 12);
            expect(() => test.color = 'red').to.throw(TypeError);
            expect(() => test.size = 100).to.throw(TypeError);
        });

        it('allows for all properties to be mutable', () => {
            const Test = Product.define('Test', {
                color: null,
                size: null,
            }, {
                writable: true,
            });

            let test = Test('blue', 12);
            test.color = 'red';
            test.size = 100;

            expect(test.color).to.equal('red');
            expect(test.size).to.equal(100);
        });

        it('allows for only certain properties to be mutable', () => {
            const Test = Product.define('Test', {
                color: null,
                size: null,
            }, {
                writable: ['color'],
            });

            let test = Test('blue', 12);
            test.color = 'red';

            expect(test.color).to.equal('red');
            expect(() => test.size = 100).to.throw(TypeError);
        });

        it('enforces type constraints when properties are written', () => {
            const Test = Product.define('Test', {
                color: (v) => typeof v === 'string',
                size: null,
            }, {
                writable: ['color'],
            });

            let test = Test('blue', 12);
            test.color = 'red';

            expect(test.color).to.equal('red');

            expect(() => test.color = 156).to.throw(TypeError);
        });

        it('allows mutation by index', () => {
            const Test = Product.define('Test', {
                color: null,
                size: null,
            }, {
                writable: ['color'],
            });

            let test = Test('blue', 12);
            test[0] = 'red';

            expect(test.color).to.equal('red');
            expect(test[0]).to.equal('red');
        });

        it('allows a supertype to be specified', () => {
            const Integer = Product.define('Integer', [Number.isInteger], {supertype: Number});

            expect(Integer(1)).to.be.an.instanceof(Integer);
            expect(Integer(1)).to.be.an.instanceof(Number);
        });

        it('creates a length property', () => {
            const Test = Product.define('Test', [null, null, null]);
            expect(Test(1,2,5).length).to.equal(3);
        });

        it('does not create a length function if it exists already', () => {
            const Test = Product.define('Test', {length: null});
            expect(Test(15).length).to.equal(15);
        });
    });

    describe('<defined>', () => {
        describe('[Type.has]', () => {
            it('returns true if the value is an instance of the product type', () => {
                const Test = Product.define('Test', []);
                expect(Test[Type.has](Test())).to.be.true();
            });

            it('returns false if the value is not an instance of the product type', () => {
                const Test = Product.define('Test', []);
                expect(Test[Type.has]({})).to.be.false();
            });
        });
        describe('.from', () => {
            it('allows an instance to be created from an object', () => {
                const Test = Product.define('Test', {
                    color: null,
                    size: null,
                });

                expect(Test.from({color: 'blue', size: 100}).color).to.equal('blue');
                expect(Test.from({color: 'blue', size: 100}).size).to.equal(100);
            });

            it('allows an instance to be created from an array', () => {
                const Test = Product.define('Test', {
                    color: null,
                    size: null,
                });

                expect(Test.from(['blue', 100]).color).to.equal('blue');
                expect(Test.from(['blue', 100]).size).to.equal(100);
            });
        });
        describe('#[Eq.equals]', () => {
            it('returns true if the two items are the same instance', () => {
                const Test = Product.define('Test', [null, null]);
                let t = Test(1,2);
                expect(t[Eq.equals](t)).to.be.true();
            });

            it('uses structural equality', () => {
                const Test = Product.define('Test', [null, null]);
                expect(Test(1,2)[Eq.equals](Test(1,2))).to.equal(true);
                expect(Test(1,2)[Eq.equals](Test(1,3))).to.equal(false);
            });

            it('returns false if the two items are not of the same type', () => {
                const Test1 = Product.define('Test', [null, null]);
                const Test2 = Product.define('Test', [null, null]);
                expect(Test1(1,2)[Eq.equals](Test2(1,2))).to.equal(false);
            });

            it('uses the [Eq.equals] method of its item if available', () => {
                const Test1 = Product.define('Test', [null]);
                const Test2 = Product.define('Test', [null]);

                expect(Test1(Test2(2))[Eq.equals](Test1(Test2(2)))).to.be.true();
                expect(Test1(Test2(2))[Eq.equals](Test1(Test2(3)))).to.be.false();
            });
        });
        describe('#[Iterable.iterator]', () => {
            it('returns an iterator over the values in the object', () => {
                const Test = Product.define('Test', {
                    color: null,
                    size: null,
                });

                const test = Test('blue', 12);
                const iter = test[Iterable.iterator]();

                let next = iter.next();
                expect(next.value).to.equal('blue');
                expect(next.done).to.equal(false);

                next = iter.next();

                expect(next.value).to.equal(12);
                expect(next.done).to.equal(false);

                next = iter.next();
                expect(next.done).to.equal(true);
            });
        });
        describe('#[Show.show]', () => {
            it('returns a string representation of the product', () => {
                const Test = Product.define('Test', {
                    color: null,
                    size: null,
                });

                expect(Test(true, 15)[Show.show]()).to.equal('Test(true, 15)');
            });

            it('uses its property show method if it exists', () => {
                const Test1 = Product.define('Test1', [null]);
                const Test2 = Product.define('Test2', [null]);

                expect(Test1(Test2(198))[Show.show]()).to.equal('Test1(Test2(198))');
            });
        });
    });
});
