const {expect} = require('code');
require('../../../src/types/builtin/Number');
const Type = require('../../../src/types/Type');
const Eq = require('../../../src/protocols/Eq');
const Ord = require('../../../src/protocols/Ord');
const Numeric = require('../../../src/protocols/Numeric');
const Enumerable = require('../../../src/protocols/Enumerable');
const Case = require('../../../src/protocols/Case');
const Show = require('../../../src/protocols/Show');
const Logical = require('../../../src/protocols/Logical');
const Clone = require('../../../src/protocols/Clone');

describe('Number', () => {
    describe('[Type.has]', () => {
        it('returns true for a number', () => {
            expect(Number[Type.has](1)).to.be.true();
            expect(Number[Type.has](0)).to.be.true();
        });
        it('returns true for a number object', () => {
            expect(Number[Type.has](new Number(198))).to.be.true();
        });
        it('returns true for NaN', () => {
            expect(Number[Type.has](NaN)).to.be.true();
        });
        it('returns false for other inputs', () => {
            expect(Number[Type.has]({})).to.be.false();
            expect(Number[Type.has](null)).to.be.false();
            expect(Number[Type.has](undefined)).to.be.false();
            expect(Number[Type.has]('')).to.be.false();
        });
    });

    describe('#[Ord.compare]', () => {
        it('returns LT if the value is less than the other', () => {
            expect(3[Ord.compare](4).isLT()).to.equal(true);
        });
        it('returns GT if the value is greater than the other', () => {
            expect(3[Ord.compare](2).isGT()).to.equal(true);
        });
        it('returns EQ if the value is equal to the other', () => {
            expect(3[Ord.compare](3).isEQ()).to.equal(true);
        });
    });

    describe('#[Ord.lte]', () => {
        it('returns true if a value is less than or equal to the other', () => {
            expect(2[Ord.lte](3)).to.be.true();
            expect(2[Ord.lte](2)).to.be.true();
        });

        it('returns false if a value is more than the other', () => {
            expect(2[Ord.lte](1)).to.be.false();
        });
    });

    describe('#[Ord.gte]', () => {
        it('returns true if a value is greater than or equal to the other', () => {
            expect(3[Ord.gte](2)).to.be.true();
            expect(2[Ord.gte](2)).to.be.true();
        });

        it('returns false if a value is less than the other', () => {
            expect(2[Ord.gte](3)).to.be.false();
        });
    });

    describe('#[Ord.lt]', () => {
        it('returns true if a value is less than the other', () => {
            expect(2[Ord.lt](3)).to.be.true();
        });

        it('returns false if a value is greater than or equal to the other', () => {
            expect(2[Ord.lt](1)).to.be.false();
            expect(2[Ord.lt](2)).to.be.false();
        });
    });

    describe('#[Ord.gte]', () => {
        it('returns true if a value is greater than the other', () => {
            expect(3[Ord.gt](2)).to.be.true();
        });

        it('returns false if a value is less than or equal to the other', () => {
            expect(2[Ord.gt](3)).to.be.false();
            expect(2[Ord.gt](2)).to.be.false();
        });
    });

    describe('#[Eq.equals]', () => {
        it('returns true if two values are equal', () => {
            expect(2[Eq.equals](2)).to.be.true();
        });

        it('returns false if two values are not equal', () => {
            expect(2[Eq.equals](1)).to.be.false();
        });
    });

    describe('#[Enumerable.prev]', () => {
        it('returns the next integer', () => {
            expect(2[Enumerable.prev]()).to.equal(1);
            expect(5.25[Enumerable.prev]()).to.equal(4);
        });
    });

    describe('#[Enumerable.next]', () => {
        it('returns the next integer', () => {
            expect(2[Enumerable.next]()).to.equal(3);
            expect(5.25[Enumerable.next]()).to.equal(6);
        });
    });

    describe('#[Numeric.toNumber]', () => {
        it('returns then number', () => {
            expect(2[Numeric.toNumber]()).to.equal(2);
            expect(new Number(2)[Numeric.toNumber]()).to.equal(2);
        });
    });

    describe('#[Numeric.fromNumber]', () => {
        it('returns the provided number', () => {
            expect(2[Numeric.fromNumber](5)).to.equal(5);
        });
    });

    describe('#[Numeric.plus]', () => {
        it('adds two numbers', () => {
            expect(5[Numeric.plus](3)).to.equal(8);
        });
    });

    describe('#[Numeric.minus]', () => {
        it('subtracts two numbers', () => {
            expect(5[Numeric.minus](3)).to.equal(2);
        });
    });

    describe('#[Numeric.times]', () => {
        it('multiplies two numbers', () => {
            expect(5[Numeric.times](3)).to.equal(15);
        });
    });

    describe('#[Numeric.divide]', () => {
        it('divides two numbers', () => {
            expect(5[Numeric.divide](2)).to.equal(2.5);
        });
    });

    describe('#[Numeric.modules]', () => {
        it('gets the remainder', () => {
            expect(5[Numeric.modulus](2)).to.equal(1);
        });
    });

    describe('#[Numeric.pow]', () => {
        it('raises the value to a given power', () => {
            expect(2[Numeric.pow](4)).to.equal(16);
        });
    });

    describe('#[Numeric.abs]', () => {
        it('gets the absolute value of a number', () => {
            expect(2[Numeric.abs]()).to.equal(2);
            expect((-2)[Numeric.abs]()).to.equal(2);
        });
    });

    describe('#[Numeric.sign]', () => {
        it('gets the sign of a number', () => {
            expect(73728[Numeric.sign]()).to.equal(1);
            expect((-567)[Numeric.sign]()).to.equal(-1);
        });
    });

    describe('#[Numeric.negate]', () => {
        it('gets the negative of a number', () => {
            expect(73728[Numeric.negate]()).to.equal(-73728);
            expect((-567)[Numeric.negate]()).to.equal(567);
        });
    });

    describe('#[Numeric.reciprocoal]', () => {
        it('calculates the reciprocal', () => {
            expect((0.25)[Numeric.reciprocal]()).to.equal(4);
            expect(4[Numeric.reciprocal]()).to.equal(0.25);
        });
    });

    describe('#[Numeric.round]', () => {
        it('rounds the value', () => {
            expect((0.567)[Numeric.round]()).to.equal(1);
            expect((124.467)[Numeric.round]()).to.equal(124);
            expect((-0.567)[Numeric.round]()).to.equal(-1);
            expect((-124.467)[Numeric.round]()).to.equal(-124);
        });
    });

    describe('#[Numeric.ceil]', () => {
        it('truncates the value toward infinity', () => {
            expect((0.567)[Numeric.ceil]()).to.equal(1);
            expect((124.467)[Numeric.ceil]()).to.equal(125);
            expect((-0.567)[Numeric.ceil]()).to.equal(-0);
            expect((-124.467)[Numeric.ceil]()).to.equal(-124);
        });
    });

    describe('#[Numeric.floor]', () => {
        it('truncates the value toward -infinity', () => {
            expect((0.567)[Numeric.floor]()).to.equal(0);
            expect((124.467)[Numeric.floor]()).to.equal(124);
            expect((-0.567)[Numeric.floor]()).to.equal(-1);
            expect((-124.467)[Numeric.floor]()).to.equal(-125);
        });
    });

    describe('#[Numeric.trunc]', () => {
        it('truncates the value towards 0', () => {
            expect((0.567)[Numeric.trunc]()).to.equal(0);
            expect((124.467)[Numeric.trunc]()).to.equal(124);
            expect((-0.567)[Numeric.trunc]()).to.equal(-0);
            expect((-124.467)[Numeric.trunc]()).to.equal(-124);
        });
    });

    describe('#[Case.case]', () => {
        it('matches against the value', () => {
            expect(5[Case.case]({
                5: 'FIVE!',
            })).to.equal('FIVE!');
        });

        it('executes a function if provided', () => {
            expect(5[Case.case]({
                5: () => 'FIVE!',
            })).to.equal('FIVE!');
        });

        it('throws if it does not match', () => {
            expect(() => {
                5[Case.case]({
                    4: 'FOUR!',
                });
            }).to.throw();
        });

        it('allows for an equality operator', () => {
            expect(5[Case.case]({
                '=5': 'FIVE!',
            })).to.equal('FIVE!');
        });

        it('matches a greater than', () => {
            expect(5[Case.case]({
                '>4': 'FIVE!',
            })).to.equal('FIVE!');

            expect(5[Case.case]({
                '>=4': 'FIVE!',
            })).to.equal('FIVE!');

            expect(5[Case.case]({
                '>=5': 'FIVE!',
            })).to.equal('FIVE!');
        });

        it('matches a less than', () => {
            expect(5[Case.case]({
                '<6': 'FIVE!',
            })).to.equal('FIVE!');

            expect(5[Case.case]({
                '<=6': 'FIVE!',
            })).to.equal('FIVE!');

            expect(5[Case.case]({
                '<=5': 'FIVE!',
            })).to.equal('FIVE!');
        });

        it('uses a default if given', () => {
            expect(5[Case.case]({
                4: 'FOUR!',
                [Case.default]: 'DEFAULT',
            })).to.equal('DEFAULT');
        });
    });

    describe('#[Show.show]', () => {
        it('returns the number as a string', () => {
            expect((5.25)[Show.show]()).to.equal('5.25');
        });
    });

    describe('#[Logical.toFalse]', () => {
        it('returns 0', () => {
            expect(123124[Logical.toFalse]()).to.equal(0);
        });
    });

    describe('#[Clone.clone]', () => {
        it('returns the value', () => {
            expect(5[Clone.clone]()).to.equal(5);
        });
    });

    describe('implements', () => {
        [
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
                expect(Prot[Type.has](1)).to.be.true();
            });
        });
    });
});
