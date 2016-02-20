var assert = require('assert');

var _ = require('../src/lambdash');
var Str = _.Str;

var assertEqual = function(left, right){
    if (!_.eq(left,right)){
        assert.fail(left, right, undefined, 'eq');
    }
};

describe('Str', function(){
    describe('#eq', function(){
        it('should return true if two strings are equal, false otherwise', function(){
            assert.equal(Str.eq('',''), true);
            assert.equal(Str.eq('abcd','abcd'), true);
            assert.equal(Str.eq('abcd','abce'), false);
            assert.equal(Str.eq('abcd','abcde'), false);
        });
    });

    describe('#compare', function(){
        it('should return an ordering based on the values of the string', function(){
            assert.equal(Str.compare('',''), _.EQ);
            assert.equal(Str.compare('a','a'), _.EQ);
            assert.equal(Str.compare('abcd','abcd'), _.EQ);
            assert.equal(Str.compare('ab','a'), _.GT);
            assert.equal(Str.compare('ab','abc'), _.LT);
            assert.equal(Str.compare('ab','ac'), _.LT);
            assert.equal(Str.compare('ad','ac'), _.GT);
            assert.equal(Str.compare('abccd','abcdd'), _.LT);
            assert.equal(Str.compare('abced','abcdd'), _.GT);
        });
    });

    describe('#toInt', function(){
        it('should return the ord value of the first character in the string', function(){
            assert.equal(Str.toInt('a'), 97);
        });

        it('should throw an exception if the string is empty', function(){
            try {
                Str.toInt('');
                assert(false);
            } catch (e) {
                assert(e instanceof TypeError);
            }
        });
    });

    describe('#fromInt', function(){
        it('should return a character from a char code', function(){
            assert.equal(Str.fromInt(97), 'a');
        });
    });

    describe('#map', function(){
        it('should map over the characters of a string', function(){
            var fn = _.compose(Str.fromInt, _.add(1), Str.toInt);
            assert.equal(Str.map(fn, 'abc'), 'bcd');
        });
    });

    describe('#concat', function(){
        it('should join two strings together', function(){
            assert.equal(Str.concat('',''),'');
            assert.equal(Str.concat('','abc'),'abc');
            assert.equal(Str.concat('abc',''),'abc');
            assert.equal(Str.concat('abc','def'),'abcdef');
        });
    });

    describe('#empty', function(){
        it('should return an empty string', function(){
            assert.equal(Str.empty(), '');
        });
    });

    describe('#foldl', function(){
        it('should fold a strings characters from left to right', function(){
            var fn = function(accum, ch) {
                return accum + Str.toInt(ch) - 96;
            }

            assert.equal(Str.foldl(fn, 3, 'abc'), 9);

            fn = function(accum, ch) {
                return accum + ch;
            }

            assert.equal(Str.foldl(fn, 'z', 'abc'), 'zabc');

        });
    });

    describe('#foldr', function(){
        it('should fold a strings characters from left to right', function(){
            var fn = function(accum, ch) {
                return accum + Str.toInt(ch) - 96;
            }

            assert.equal(Str.foldr(fn, 3, 'abc'), 9);

            fn = function(accum, ch) {
                return accum + ch;
            }

            assert.equal(Str.foldr(fn, 'z', 'abc'), 'zcba');
        });
    });

    describe('#len', function(){
        it('should return the length of a string', function(){
            assert.equal(Str.len(''),0);
            assert.equal(Str.len('abcdefg'),7);
        });
    });

    describe('#nth', function(){
        it('should return the character at the index given', function(){
            assert.equal(Str.nth(0)("abc"), "a");
            assert.equal(Str.nth(1)("abc"), "b");
            assert.equal(Str.nth(-2)("abc"), "b");
            assert.equal(Str.nth(2)("abc"), "c");
            assert.equal(Str.nth(-1)("abc"), "c");
        });

        it('should throw an exception if the index is greater than or equal to the length of the string', function(){
            try {
                assert.equal(Str.nth(0)(''));
                assert(false);
            } catch(e) {
                assert(e instanceof RangeError);
            }
        });

        it('should throw an exception if the index is out of bounds in the negative direction', function(){
            try {
                assert.equal(Str.nth(-1)(''));
                assert(false);
            } catch(e) {
                assert(e instanceof RangeError);
            }
        });
    });

    describe('#append', function(){
        it('should add a string at the end of another', function(){
            assert.equal(Str.append('ab','cd'),'cdab');
        });
    });

    describe('#prepend', function(){
        it('should add a string at the end of another', function(){
            assert.equal(Str.prepend('ab','cd'),'abcd');
        });
    });

    describe('#split', function(){
        it('should split a string at a delimeter', function(){
            assertEqual(Str.split(',','a,b,c,d'), ['a', 'b', 'c', 'd']);
        });
    });

    describe('#lines', function(){
        it('should split a string by newline character', function(){
            assertEqual(Str.lines("abc\ndef\n\nghi"), ["abc","def","","ghi"]);
        });
    });

    describe('#words', function(){
        it('should split a string by whitespace character', function(){
            assertEqual(Str.words("abc\ndef  ghi\tjkl"), ["abc","def","ghi","jkl"]);
        });
    });

    describe('#unlines', function(){
        it('should join a string by newline character', function(){
            assertEqual(Str.unlines(["abc","def","","ghi"]), "abc\ndef\n\nghi");
        });
    });

    describe('#unwords', function(){
        it('should join a string by a space character', function(){
            assertEqual(Str.unwords(["abc","def","ghi","jkl"]), "abc def ghi jkl");
        });
    });

    describe('#show', function(){
        it('should return the string wrapped in quotes', function(){
            assert.equal(Str.show("abcd"), '"abcd"');
            assert.equal(Str.show("a\"b\"cd"), '"a\\"b\\"cd"');
        });
    });
});