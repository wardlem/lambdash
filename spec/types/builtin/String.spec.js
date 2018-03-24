const {expect} = require('code');
require('../../../src/types/builtin/String');


const Type = require('../../../src/types/Type');
const Eq = require('../../../src/protocols/Eq');
const Semigroup = require('../../../src/protocols/Semigroup');
const Monoid = require('../../../src/protocols/Monoid');
const Ord = require('../../../src/protocols/Ord');
const Numeric = require('../../../src/protocols/Numeric');
const Enumerable = require('../../../src/protocols/Enumerable');
const Iterable = require('../../../src/protocols/Iterable');
const Functor = require('../../../src/protocols/Functor');
const Foldable = require('../../../src/protocols/Foldable');
const Sequential = require('../../../src/protocols/Sequential');
const Case = require('../../../src/protocols/Case');
const Show = require('../../../src/protocols/Show');
const Logical = require('../../../src/protocols/Logical');
const Clone = require('../../../src/protocols/Clone');
const Of = require('../../../src/protocols/Of');

describe('String', () => {
    describe('[Type.has]', () => {
        it('returns true for a string', () => {
            expect(String[Type.has]('')).to.be.true();
            expect(String[Type.has]('abcd')).to.be.true();
        });
        it('returns true for string objects', () => {
            expect(String[Type.has](new String(''))).to.be.true();
        });
        it('returns false for other things', () => {
            expect(String[Type.has]({})).to.be.false();
            expect(String[Type.has](null)).to.be.false();
            expect(String[Type.has](undefined)).to.be.false();
            expect(String[Type.has](false)).to.be.false();
        });
    });
    describe('#[Ord.lte]', () => {
        it('returns true if a string is less than the other', () =>{
            expect('abcd'[Ord.lte]('abce')).to.be.true();
            expect('abcd'[Ord.lte]('abcde')).to.be.true();
            expect('\u{1F984}'[Ord.lte]('\u{1F985}')).to.be.true();
            expect('a'[Ord.lte]('\u{1F985}')).to.be.true();
        });
        it('returns false if a string is less than the other', () =>{
            expect('abce'[Ord.lte]('abcd')).to.be.false();
            expect('abcde'[Ord.lte]('abcd')).to.be.false();
            expect('\u{1F985}'[Ord.lte]('\u{1F984}')).to.be.false();
            expect('\u{1F985}'[Ord.lte]('a')).to.be.false();
        });
        it('returns true if a string is equal to the other', () =>{
            expect('abcd'[Ord.lte]('abcd')).to.be.true();
            expect('\u{1F984}'[Ord.lte]('\u{1F984}')).to.be.true();
        });
    });

    describe('#[Numeric.toNumber]', () => {
        it('converts an ascii character to its numeric value', () => {
            expect('a'[Numeric.toNumber]()).to.equal(97);
        });
        it('converts a unicode character to its numeric value', () => {
            expect('\u{1F984}'[Numeric.toNumber]()).to.equal(129412);
        });
        it('throws a RangeError if it is not a single character', () => {
            expect(() => {
                'ab'[Numeric.toNumber]();
            }).to.throw(RangeError);

            expect(() => {
                '\u{1F984}\u{1F984}'[Numeric.toNumber]();
            }).to.throw(RangeError);
        });
    });

    describe('#[Numeric.fromNumber]', () => {
        it('converts an ascii code point to a string', () => {
            expect(''[Numeric.fromNumber](97)).to.equal('a');
        });
        it('converts a unicode code point to a string', () => {
            expect(''[Numeric.fromNumber](129412)).to.equal('\u{1F984}');
        });
    });

    describe('#[Enumerable.prev]', () => {
        it('gets the previous ascii value', () => {
            expect('b'[Enumerable.prev]()).to.equal('a');
        });
        it('gets the previous unicode value', () => {
            expect('\u{1F984}'[Enumerable.prev]()).to.equal('\u{1F983}');
        });
    });

    describe('#[Enumerable.next]', () => {
        it('gets the next ascii value', () => {
            expect('a'[Enumerable.next]()).to.equal('b');
        });
        it('gets the next unicode value', () => {
            expect('\u{1F984}'[Enumerable.next]()).to.equal('\u{1F985}');
        });
    });

    describe('#[Functor.map]', () => {
        it('transforms each codepoint of the string', () => {
            require('../../../src/types/builtin/Array');

            expect('a\u{1F984}'[Functor.map]((c) => c + c[Enumerable.next]())).to.equal('ab\u{1F984}\u{1F985}');
        });
    });

    describe('#[Monoid.concat]', () => {
        it('joins two strings together', () => {
            expect('abc'[Monoid.concat]('rst')).to.equal('abcrst');
        });
    });

    describe('#[Monoid.empty]', () => {
        it('returns and empty string', () => {
            expect('abc'[Monoid.empty]()).to.equal('');
        });
    });

    describe('#[Foldable.foldl]', () => {
        it('combines the values of the string from the left', () => {
            expect('abc'[Foldable.foldl]((accum, char) => {
                return char + ' ' + accum;
            }, 'x')).to.equal('c b a x');
        });
    });

    describe('#[Foldable.foldr]', () => {
        it('combines the values of the string from the right', () => {
            expect('abc'[Foldable.foldr]((char, accum) => {
                return char + ' ' + accum;
            }, 'x')).to.equal('a b c x');
        });
    });

    describe('#[Foldable.count]', () => {
        it('returns the number of codepoints in a string', () => {
            expect('abc'[Foldable.count]()).to.equal(3);
            expect('\u{1F984}'[Foldable.count]()).to.equal(1);
        });
    });

    describe('#[Foldable.toArray]', () => {
        it('returns the codepoints in the array', () => {
            expect('abc\u{1F984}'[Foldable.toArray]()).to.equal(['a', 'b', 'c', '\u{1F984}']);
        });
    });

    describe('#[Sequential.of]', () => {
        it('returns the value as a string', () => {
            expect(''[Sequential.of]('test')).to.equal('test');
            expect(''[Sequential.of](12)).to.equal('12');
        });
    });

    describe('#[Sequential.at]', () => {
        it('gets the code point at a given index', () => {
            expect('abc\u{1F984}def\u{1F985}'[Sequential.at](0)).to.equal('a');
            expect('abc\u{1F984}def\u{1F985}'[Sequential.at](3)).to.equal('\u{1F984}');
            expect('abc\u{1F984}def\u{1F985}'[Sequential.at](4)).to.equal('d');
            expect('abc\u{1F984}def\u{1F985}'[Sequential.at](7)).to.equal('\u{1F985}');
        });

        it('throws a RangeError if the index is negative', () => {
            expect(() => {
                'a'[Sequential.at](-1);
            }).to.throw(RangeError);
        });

        it('throws a RangeError if the index is greater than the count', () => {
            expect(() => {
                'a'[Sequential.at](1);
            }).to.throw(RangeError);
        });
    });

    describe('#[Sequential.reverse]', () => {
        it('reverses the string', () => {
            expect('abc\u{1F984}def'[Sequential.reverse]()).to.equal('fed\u{1F984}cba');
        });
    });

    describe('#[Sequential.slice]', () => {
        it('gets a substring', () => {
            expect('abc\u{1F984}def'[Sequential.slice](0,7)).to.equal('abc\u{1F984}def');
            expect('abc\u{1F984}def'[Sequential.slice](1,5)).to.equal('bc\u{1F984}d');
        });
    });

    describe('#[Logical.toFalse]', () => {
        it('returns an empty string', () => {
            expect('abc'[Logical.toFalse]()).to.equal('');
        });
    });

    describe('#[Case.case]', () => {
        it('returns the matching string', () => {
            expect('abc'[Case.case]({
                abc: 'yup',
            })).to.equal('yup');
        });

        it('throws an exception when no match found', () => {
            expect(() => {
                expect('abc'[Case.case]({
                    abd: 'yup',
                })).to.equal('yup');
            }).to.throw();
        });
    });

    describe('#[Show.show]', () => {
        it('returns an escaped string', () => {
            expect('abc\u{1F984}def\n'[Show.show]()).to.equal('"abc\u{1F984}def\\n"');
        });
    });

    describe('implements', () => {
        [
            Case,
            Clone,
            Enumerable,
            Eq,
            Foldable,
            Functor,
            Iterable,
            Logical,
            Monoid,
            Numeric,
            Of,
            Ord,
            Semigroup,
            Sequential,
            Show,
        ].forEach((Prot) => {
            it(`implements ${Prot.name}`, () => {
                expect(Prot[Type.has]('')).to.be.true();
            });
        });
    });
});
