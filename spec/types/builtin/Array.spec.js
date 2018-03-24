const {expect} = require('code');
require('../../../src/types/builtin/Array');


const Type = require('../../../src/types/Type');
const Eq = require('../../../src/protocols/Eq');
const Semigroup = require('../../../src/protocols/Semigroup');
const Monoid = require('../../../src/protocols/Monoid');
const Ord = require('../../../src/protocols/Ord');
const Iterable = require('../../../src/protocols/Iterable');
const Functor = require('../../../src/protocols/Functor');
const Foldable = require('../../../src/protocols/Foldable');
const Sequential = require('../../../src/protocols/Sequential');
const Show = require('../../../src/protocols/Show');
const Clone = require('../../../src/protocols/Clone');
const Of = require('../../../src/protocols/Of');
const Applicative = require('../../../src/protocols/Applicative');
const SetKind = require('../../../src/protocols/SetKind');
const Monad = require('../../../src/protocols/Monad');
const SetLike = require('../../../src/protocols/SetLike');
const Keyed = require('../../../src/protocols/Keyed');
const Apply = require('../../../src/protocols/Apply');

describe('Array', () => {
    describe('[Type.has]', () => {
        it('returns true for an array', () => {
            expect(Array[Type.has]([])).to.be.true();
        });
        it('returns false for other things', () => {
            expect(Array[Type.has]({})).to.be.false();
            expect(Array[Type.has](null)).to.be.false();
            expect(Array[Type.has](undefined)).to.be.false();
            expect(Array[Type.has](false)).to.be.false();
        });
    });
    describe('#[Ord.compare]', () => {
        it('structurally compares two arrays', () => {
            expect([][Ord.compare]([]).isEQ()).to.be.true();
            expect([1,2,3][Ord.compare]([1,2,3]).isEQ()).to.be.true();
            expect([1,2,4][Ord.compare]([1,2,3]).isGT()).to.be.true();
            expect([1,2,2][Ord.compare]([1,2,3]).isLT()).to.be.true();
            expect([1,2,3,4][Ord.compare]([1,2,3]).isGT()).to.be.true();
            expect([1,2,3][Ord.compare]([1,2,3,4]).isLT()).to.be.true();
        });
    });
    describe('#[Functor.map]', () => {
        it('maps the items in an array', () => {
            expect([1,2,3][Functor.map](v => v * 3)).to.equal([3,6,9]);
        });
    });
    describe('#[Foldable.foldl]', () => {
        it('reduces a value from left to right', () => {
            expect([12,8,1][Foldable.foldl]((a,v) => v / a, 3)).to.equal(0.5);
        });
    });
    describe('#[Foldable.foldr]', () => {
        it('reduces a value from right to left', () => {
            expect([1,8,12][Foldable.foldr]((v,a) => v / a, 3)).to.equal(0.5);
        });
    });
    describe('#[Foldable.count]', () => {
        it('returns the length of the array', () => {
            expect([123,15,125][Foldable.count]()).to.equal(3);
        });
    });
    describe('#[Monoid.concat]', () => {
        it('concatenates two arrays', () => {
            expect(['a', 'b', 'c'][Monoid.concat]([1,2,3])).to.equal(['a','b','c',1,2,3]);
        });
    });
    describe('#[Monoid.empty]', () => {
        it('returns an empty array', () => {
            expect([1,2,3][Monoid.empty]()).to.equal([]);
        });
    });
    describe('#[Applicative.ap]', () => {
        it('applies the functions in one array to the values in another', () => {
            const arr1 = [(v) => v + 2, (v) => v * 3];
            expect(arr1[Applicative.ap]([2,5,7])).to.equal([4,7,9,6,15,21]);
        });
    });
    describe('#[Of.of]', () => {
        it('creates an array with the item as the only value', () => {
            expect([][Applicative.of](156)).to.equal([156]);
        });
    });
    describe('#[Monad.flatten]', () => {
        it('flattens an array', () => {
            expect([[1,5,6],[7,3,4],[45]][Monad.flatten]()).to.equal([1,5,6,7,3,4,45]);
        });
    });
    describe('#[Sequential.at]', () => {
        it('returns the value at an index', () => {
            expect([56,123,512][Sequential.at](1)).to.equal(123);
        });
    });
    describe('#[SetKind.union]', () => {
        it('includes all unique values in either of two arrays', () => {
            expect([1,2,2,4,5][SetKind.union]([1,4,4,5,6,6])).to.equal([1,2,4,5,6]);
        });
    });
    describe('#[SetKind.difference]', () => {
        it('includes all unique values not in the other array', () => {
            expect([1,2,2,4,5,7][SetKind.difference]([1,4,4,5,6,6])).to.equal([2,7]);
        });
    });
    describe('#[SetKind.union]', () => {
        it('includes all unique values in both of two arrays', () => {
            expect([1,2,2,4,5][SetKind.intersection]([1,4,4,5,6,6])).to.equal([1,4,5]);
        });
    });

    describe('#[SetKind.has]', () => {
        it('returns true if the value is in the array', () => {
            expect([1,4,6][SetKind.has](4)).to.be.true();
        });
        it('returns false if the value is not in the array', () => {
            expect([1,4,6][SetKind.has](5)).to.be.false();
        });
        it('uses structural equality', () => {
            expect([[1,4],[6]][SetKind.has]([1,4])).to.be.true();
            expect([[1,4],[6]][SetKind.has]([1,5])).to.be.false();
        });
    });

    describe('#[SetKind.delete]', () => {
        it('removes all instances of a value from the array', () => {
            expect([1,2,2,4,5,7][SetKind.delete](2)).to.equal([1,4,5,7]);
        });
    });

    describe('#[SetKind.size]', () => {
        it('returns the number of unique values an array has', () => {
            expect([1,2,2,4,5,7][SetKind.size]()).to.equal(5);
        });
    });

    describe('#[SetKind.insert]', () => {
        it('appends a value to an array if it is not in the array', () => {
            expect([1,4,5,6][SetKind.insert](7)).to.equal([1,4,5,6,7]);
        });
        it('does nothing if the value is not in the array', () => {
            expect([1,4,5,6][SetKind.insert](6)).to.equal([1,4,5,6]);
        });
    });

    describe('#[Show.show]', () => {
        require('../../../src/types/builtin/Set');
        it('returns a string representation of the array', () => {
            expect([1,5,7,3][Show.show]()).to.equal('[1,5,7,3]');
        });
    });

    describe('#[Clone.clone]', () => {
        it('copies the array', () => {
            const arr = [1,4,6,8];
            const clone = arr[Clone.clone]();

            expect(arr).to.equal(clone);
            expect(arr).to.not.shallow.equal(clone);
        });
    });

    describe('implements', () => {
        [
            Applicative,
            Apply,
            Clone,
            Eq,
            Foldable,
            Functor,
            Iterable,
            Keyed,
            Monad,
            Monoid,
            Of,
            Ord,
            Semigroup,
            Sequential,
            SetKind,
            SetLike,
            Show,
        ].forEach((Prot) => {
            it(`implements ${Prot.name}`, () => {
                expect(Prot[Type.has]([])).to.be.true();
            });
        });
    });
});
