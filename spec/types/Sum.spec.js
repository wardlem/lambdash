const {expect} = require('code');
const Type = require('../../src/types/Type');
const Sum = require('../../src/types/Sum');
const Case = require('../../src/protocols/Case');

describe('Sum', () => {
    describe('.define', () => {
        it('returns a function', () => {
            expect(Sum.define('Test', {A: [], B: []})).to.be.a.function();
        });

        it('names the function', () => {
            expect(Sum.define('Test', {A: [], B: []}).name).to.equal('Test');
        });

        it('creates subtypes which are functions', () => {
            const Test = Sum.define('Test', {A: [null], B: [null]});
            expect(Test.A).to.be.a.function();
            expect(Test.B).to.be.a.function();
        });

        it('creates a unique instance if the subtypes are empty', () => {
            const Test = Sum.define('Test', {A: [], B: []});
            expect(Test.A).to.be.an.object();
            expect(Test.B).to.be.an.object();
        });

        it('creates subtypes whose instances are instances of the sum type', () => {
            const Test = Sum.define('Test', {A: [null], B: []});

            expect(Test.A(1)).to.be.instanceof(Test.A);
            expect(Test.A(1)).to.be.instanceof(Test);
            expect(Test.B).to.be.instanceof(Test);
        });

        it('allows the subtype definition to be a function', () => {
            const Test = Sum.define('Test', {A: (v) => typeof v === 'number'});
            expect(Test.A).to.be.a.function();
            expect(Test.A.length).to.equal(1);
        });

        it('allows the subtype definition to be null', () => {
            const Test = Sum.define('Test', {A: null});
            expect(Test.A).to.be.an.object();
        });

        it('throws a TypeError if a subtype definition is not valid', () => {
            expect(() => {
                Sum.define('Test', {A: 12});
            }).to.throw(TypeError);
        });

        it('allows the first paramater to be a function', () => {
            function Test() {}

            expect(Sum.define(Test, {A: null})).to.equal(Test);
        });

        it('makes subtypes immutable by default', () => {
            const Test = Sum.define('Test', {A: [null]});
            const test = Test.A(1);

            expect(() => test[0] = 12).to.throw(TypeError);
        });

        it('allows for all sub types to be mutable', () => {
            const Test = Sum.define('Test', {A: [null], B: [null]}, {
                writable: true,
            });

            const test1 = Test.A(1);
            test1[0] = 2;
            expect(test1[0]).to.equal(2);
            const test2 = Test.B(3);
            test2[0] = 12;
            expect(test2[0]).to.equal(12);
        });

        it('allows for certain sub types to be mutable', () => {
            const Test = Sum.define('Test', {A: [null], B: [null]}, {
                writable: ['B'],
            });

            const test1 = Test.A(1);
            expect(() => test1[0] = 12).to.throw(TypeError);
            const test2 = Test.B(3);
            test2[0] = 12;
            expect(test2[0]).to.equal(12);
        });

        it('allows for only certain properties to be mutable', () => {
            const Test = Sum.define('Test', {A: {v1: null, v2: null}}, {
                writable: ['A.v2'],
            });

            const test = Test.A(1,2);
            expect(() => test[0] = 12).to.throw(TypeError);
            test[1] = 96;
            expect(test[1]).to.equal(96);
        });

        it('creates a default function that throws a type error if called', () => {
            const Test = Sum.define('Test', {A: null});
            expect(() => Test()).to.throw(TypeError);
        });
    });

    describe('<defined>', () => {
        describe('[Type.has]', () => {
            it('returns true if a value is an instance of the sum', () => {
                const Test = Sum.define('Test', {A: [null]});
                expect(Test[Type.has](Test.A(1))).to.be.true();
            });

            it('returns false if a value is not an instance of the sum', () => {
                const Test = Sum.define('Test', {A: [null]});
                expect(Test[Type.has]({})).to.be.false();
            });
        });

        describe('#[Case.case]', () => {
            it('matches the subtype of the value', () => {
                const Test = Sum.define('Test', {A: [null], B: [null]});

                expect(Test.A(1)[Case.case]({
                    A: 4,
                    B: 6,
                })).to.equal(4);

                expect(Test.B(1)[Case.case]({
                    A: 4,
                    B: 6,
                })).to.equal(6);
            });

            it('executes a function with the inner values if the case is a function', () => {
                const Test = Sum.define('Test', {A: [null], B: [null, null]});

                expect(Test.A(1)[Case.case]({
                    A: (v) => v + 2,
                    B: 13,
                })).to.equal(3);

                expect(Test.B(6,9)[Case.case]({
                    A: (v) => v + 2,
                    B: (v1, v2) => v1 + v2 + 8,
                })).to.equal(23);
            });

            it('allows for a default to be provided', () => {
                const Test = Sum.define('Test', {A: [null], B: [null]});

                expect(Test.A(1)[Case.case]({
                    A: 2,
                    [Case.default]: 13,
                })).to.equal(2);

                expect(Test.B(1)[Case.case]({
                    A: 2,
                    [Case.default]: 13,
                })).to.equal(13);
            });

            it('executes the default case with the original value if it is a function', () => {
                const Test = Sum.define('Test', {A: [null], B: [null]});

                expect(Test.B(1)[Case.case]({
                    A: 2,
                    [Case.default]: (v) => v[0],
                })).to.equal(1);
            });

            it('throws a TypeError if the function falls through', () => {
                const Test = Sum.define('Test', {A: [null], B: [null]});

                expect(() => {
                    Test.B(1)[Case.case]({
                        A: 2,
                    });
                }).to.throw(TypeError);
            });
        });
    });
});
