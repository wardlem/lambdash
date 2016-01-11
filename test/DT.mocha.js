var assert = require('assert');

var _ = require('../src/lambdash');
var DT = _.DT;

describe('DT', function(){
    describe('#member', function(){
        it('should return true only for a datetime object', function(){
            assert(DT.member(new Date()));
            assert(!DT.member({}));
            assert(!DT.member([]));
            assert(!DT.member(null));
            assert(!DT.member(undefined));
            assert(!DT.member(true));
            assert(!DT.member("April 3, 2015"));
        });
    });

    describe('#eq', function(){
        it('should return true only if two datetimes represent the same millisecond', function(){
            assert(DT.eq(DT.fromNum(1), DT.fromNum(1)));
            assert(!DT.eq(DT.fromNum(2), DT.fromNum(1)));
        });
    });

    describe('#compare', function(){
        it('should return _.LT if the left is less than the right', function(){
            assert.equal(DT.compare(DT.fromNum(1), DT.fromNum(2)), _.LT);
        });

        it('should return _.GT if the left is greater than the right', function(){
            assert.equal(DT.compare(DT.fromNum(3), DT.fromNum(2)), _.GT);
        });

        it('should return _.EQ if the left is greater than the right', function(){
            assert.equal(DT.compare(DT.fromNum(3), DT.fromNum(3)), _.EQ);
        });
    });

    describe('#toNum', function(){
        it('should return the integer representation of the date', function(){
            assert.equal(DT.toNum(DT.fromNum(1)),1);
        });
    });

    describe('#fromNum', function(){
        it('should return a date from an integer', function(){
            assert.equal(DT.fromNum(819195840000).toDateString(), "Sun Dec 17 1995");
        });
    });

    describe('#show', function(){
        it('should return a string representation', function(){
            var d = new Date('December 17, 1995 GMT-0000 03:24:00');
            assert.equal(DT.show(d), "Date('Sun, 17 Dec 1995 03:24:00 GMT')");
        });
    });

    describe('@implements', function(){
        it('should implement Eq', function(){
            assert(_.Eq.member(new Date()));
        });

        it('should implement Ord', function(){
            assert(_.Ord.member(new Date()));
        });

        it('should implement Numeric', function(){
            assert(_.Numeric.member(new Date()));
        });

        it('should implement Show', function(){
            assert(_.Show.member(new Date()));
        });
    });


});