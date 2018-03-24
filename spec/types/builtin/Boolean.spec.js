const {expect} = require('code');
require('../../../src/types/builtin/Boolean');
const Type = require('../../../src/types/Type');
const Eq = require('../../../src/protocols/Eq');
const Ord = require('../../../src/protocols/Ord');
const Bounded = require('../../../src/protocols/Bounded');
const Numeric = require('../../../src/protocols/Numeric');
const Enumerable = require('../../../src/protocols/Enumerable');
const Case = require('../../../src/protocols/Case');
const Logical = require('../../../src/protocols/Logical');
const Clone = require('../../../src/protocols/Clone');
const Show = require('../../../src/protocols/Show');

describe('Boolean', () => {
    describe('[Type.has]', () => {
        it('returns true for true', () => {
            expect(Boolean[Type.has](true)).to.be.true();
        });
        it('returns true for false', () => {
            expect(Boolean[Type.has](false)).to.be.true();
        });
        it('returns true for a boolean object', () => {
            expect(Boolean[Type.has](new Boolean(false))).to.be.true();
            expect(Boolean[Type.has](new Boolean(true))).to.be.true();
        });
        it('returns false for other things', () => {
            expect(Boolean[Type.has]({})).to.be.false();
            expect(Boolean[Type.has](null)).to.be.false();
            expect(Boolean[Type.has](undefined)).to.be.false();
            expect(Boolean[Type.has]('')).to.be.false();
        });
    });

    describe('#[Eq.equals]', () => {
        it('return true if the values are the same', () => {
            expect(true[Eq.equals](true)).to.be.true();
            expect(false[Eq.equals](false)).to.be.true();
        });

        it('returns flase if the the values are not the same', () => {
            expect(true[Eq.equals](false)).to.be.false();
            expect(false[Eq.equals](true)).to.be.false();
        });
    });
    describe('#[Ord.lte]', () => {
        it('returns true if the value is less than or equal to another value', () => {
            expect(true[Ord.lte](true)).to.be.true();
            expect(false[Ord.lte](false)).to.be.true();
            expect(false[Ord.lte](true)).to.be.true();
        });

        it('returns false if the value is greater than the other', () => {
            expect(true[Ord.lte](false)).to.be.false();
        });
    });

    describe('#[Bounded.minBound]', () => {
        it('returns false', () => {
            expect(false[Bounded.minBound]()).to.be.false();            expect(false[Bounded.minBound]()).to.be.false();
            expect(true[Bounded.minBound]()).to.be.false();
        });
    });

    describe('#[Bounded.maxBound]', () => {
        it('returns false', () => {
            expect(false[Bounded.maxBound]()).to.be.true();            expect(false[Bounded.minBound]()).to.be.false();
            expect(true[Bounded.maxBound]()).to.be.true();
        });
    });

    describe('#[Numeric.toNumber]', () => {
        it('returns 1 for true and 0 for false', () => {
            expect(false[Numeric.toNumber]()).to.equal(0);
            expect(true[Numeric.toNumber]()).to.equal(1);
        });
    });

    describe('#[Numeric.fromNumber]', () => {
        it('returns false for 0 and true for any other number', () => {
            expect(false[Numeric.fromNumber](0)).to.be.false();
            expect(true[Numeric.fromNumber](0)).to.be.false();
            expect(false[Numeric.fromNumber](1)).to.be.true();
            expect(true[Numeric.fromNumber](1)).to.be.true();
            expect(false[Numeric.fromNumber](-5345)).to.be.true();
            expect(true[Numeric.fromNumber](323423)).to.be.true();
        });
    });

    describe('#[Enumerable.prev]', () => {
        it('returns false for true', () => {
            expect(true[Enumerable.prev]()).to.be.false();
        });

        it('throws a RangeError for false', () => {
            expect(() => {
                false[Enumerable.prev]();
            }).to.throw(RangeError);
        });
    });

    describe('#[Enumerable.next]', () => {
        it('returns true for false', () => {
            expect(false[Enumerable.next]()).to.be.true();
        });

        it('throws a RangeError for true', () => {
            expect(() => {
                true[Enumerable.next]();
            }).to.throw(RangeError);
        });
    });
    describe('#[Case.case]', () => {
        it('matches the boolean and returns a matching value', () => {
            expect(true[Case.case]({
                'true': 'yes',
                'false': 'no',
            })).to.equal('yes');

            expect(false[Case.case]({
                'true': 'yes',
                'false': 'no',
            })).to.equal('no');
        });

        it('matches the boolean and executes a matching function', () => {
            expect(true[Case.case]({
                'true': () => 'yes',
                'false': () => 'no',
            })).to.equal('yes');

            expect(false[Case.case]({
                'true': () => 'yes',
                'false': () => 'no',
            })).to.equal('no');
        });

        it('matches a default', () => {
            expect(true[Case.case]({
                [Case.default]: () => 'the default',
            })).to.equal('the default');
        });

        it('throws a TypeError on fallthrough', () => {
            expect(() => {
                false[Case.case]({
                    'true': () => 'yes',
                });
            }).to.throw(TypeError);
        });
    });

    describe('#[Logical.toBoolean]', () => {
        it('returns the primitive value of the boolean', () => {
            expect(true[Logical.toBoolean]()).to.be.true();
            expect(false[Logical.toBoolean]()).to.be.false();
        });
    });

    describe('#[Clone.clone]', () => {
        it('returns the primitive value of the boolean', () => {
            expect(true[Clone.clone]()).to.be.true();
            expect(false[Clone.clone]()).to.be.false();
        });
    });

    describe('implements', () => {
        [
            Bounded,
            Case,
            Clone,
            Enumerable,
            Eq,
            Logical,
            Numeric,
            Ord,
            Show,
        ].forEach((Prot) => {
            it(`implements ${Prot.name}`, () => {
                expect(Prot[Type.has](false)).to.be.true();
            });
        });
    });
});
