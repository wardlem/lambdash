const {expect} = require('code');

const Eq = require('../../../src/protocols/Eq');
const Ord = require('../../../src/protocols/Ord');
const Numeric = require('../../../src/protocols/Numeric');
const Show = require('../../../src/protocols/Show');
const Clone = require('../../../src/protocols/Clone');

const Type = require('../../../src/types/Type');

require('../../../src/types/builtin/Date');

describe('Date', () => {
    describe('[Type.has]', () => {
        it('returns true if a value is a date object', () => {
            expect(Date[Type.has](new Date())).to.be.true();
        });
        it('returns false for other things', () => {
            expect(Date[Type.has]({})).to.be.false();
            expect(Date[Type.has](null)).to.be.false();
            expect(Date[Type.has](undefined)).to.be.false();
            expect(Date[Type.has]('')).to.be.false();
        });
    });
    describe('#[Eq.equals]', () => {
        it('returns true if two values are the same date', () => {
            expect(new Date(123123)[Eq.equals](new Date(123123))).to.be.true();
        });

        it('returns false if two values are not the same date', () => {
            expect(new Date(123123)[Eq.equals](new Date(123124))).to.be.false();
        });
    });
    describe('#[Ord.lte]', () => {
        it('returns true if a date is less than another', () => {
            expect(new Date(123123)[Ord.lte](new Date(123124))).to.be.true();
        });
        it('returns false if a date is greater than another', () => {
            expect(new Date(123125)[Ord.lte](new Date(123124))).to.be.false();
        });
        it('returns true if a date is equal to another', () => {
            expect(new Date(123124)[Ord.lte](new Date(123124))).to.be.true();
        });
    });
    describe('#[Numeric.toNumber]', () => {
        it('returns the integer value of the date', () => {
            expect(new Date(123123)[Numeric.toNumber]()).to.equal(123123);
        });
    });
    describe('#[Numeric.fromNumber]', () => {
        it('returns a date object from a number', () => {
            expect(new Date()[Numeric.fromNumber](123123)).to.be.a.date();
            expect(new Date()[Numeric.fromNumber](123123).getTime()).to.equal(123123);
        });
        it('does not fail on non-integer values', () => {
            expect(new Date()[Numeric.fromNumber](123123.345).getTime()).to.equal(123123);
        });
    });
    describe('#[Show.show]', () => {
        it('returns a string representation of an object as it would be created', () => {
            const date = new Date();
            const iso = date.toISOString();
            expect(date[Show.show]()).to.equal(`new Date("${iso}")`);
        });

        it('handles invalid dates', () => {
            const date = new Date(NaN);
            expect(date[Show.show]()).to.equal('new Date("Invalid Date")');
        });
    });
    describe('#[Clone.clone]', () => {
        it('copies the date object', () => {
            const d = new Date();
            const c = d[Clone.clone]();

            expect(d).to.equal(c);
            expect(d).to.not.shallow.equal(c);
        });
    });
    describe('implements', () => {
        [
            Clone,
            Eq,
            Numeric,
            Ord,
            Show,
        ].forEach((Prot) => {
            it(`implements ${Prot.name}`, () => {
                expect(Prot[Type.has](new Date())).to.be.true();
            });
        });
    });
});
