var assert = require('assert');

var _arrEqual = require('../src/internal/_arrayEqual');

var Eq = require('../src/Eq');
var Bounded = require('../src/Bounded');
var Enum = require('../src/Enum');
var Ord = require('../src/Ord');
var Ordering = require('../src/Ordering');

var enumeratedType = require('../src/enumeratedType');

var DAYS = enumeratedType("DAYS", [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
]);

describe('enumeratedType', function(){

    it('should accept a function as the first parameter', function(){
        var Constr = function Constr(int) {
            return Constr.fromInt(int);
        };

        var Constr2 = enumeratedType(Constr, ["A", "B", "C"]);

        assert(Constr === Constr2);
        assert(Constr.A);
        assert(Constr.B);
        assert(Constr.C);
    });

    it('should throw an exception if called without an array as the second parameter', function(){
        try {
            var ENUM = enumeratedType("ENUM", {});
            assert(false);
        } catch (e) {
            assert(e instanceof TypeError);
        }
    });

    it('should create a sum type that is convertible to and from an integer value', function(){
        assert.equal(DAYS.toInt(DAYS.TUESDAY), 2);
        assert.equal(DAYS.fromInt(5), DAYS.FRIDAY);
    });

    it('should create a sum type that implements Eq', function() {
        assert(Eq.member(DAYS.SUNDAY));
        assert.equal(Eq.eq(DAYS.SUNDAY, DAYS.SUNDAY), true);
        assert.equal(Eq.eq(DAYS.SUNDAY, DAYS.MONDAY), false);
    });

    it('should create a sum type that implements Bounded', function() {
        assert(Bounded.member(DAYS.SUNDAY));
        assert.equal(Bounded.isMin(DAYS.SUNDAY), true);
        assert.equal(Bounded.isMax(DAYS.SUNDAY), false);
        assert.equal(Bounded.isMin(DAYS.WEDNESDAY), false);
        assert.equal(Bounded.isMax(DAYS.WEDNESDAY), false);
        assert.equal(Bounded.isMin(DAYS.SATURDAY), false);
        assert.equal(Bounded.isMax(DAYS.SATURDAY), true);
    });

    it('should create a sum type that implements Ord', function() {
        assert(Ord.member(DAYS.SUNDAY));

        assert(Ordering.isEQ(Ord.compare(DAYS.SUNDAY, DAYS.SUNDAY)));
        assert(Ordering.isLT(Ord.compare(DAYS.SUNDAY, DAYS.WEDNESDAY)));
        assert(Ordering.isGT(Ord.compare(DAYS.FRIDAY, DAYS.SUNDAY)));
    });

    it('should create a sum type that implements Enum', function() {
        assert(Enum.member(DAYS.SUNDAY));

        assert(_arrEqual(Enum.enumTo(DAYS.TUESDAY, DAYS.FRIDAY), [DAYS.TUESDAY, DAYS.WEDNESDAY, DAYS.THURSDAY, DAYS.FRIDAY]));
        assert(_arrEqual(Enum.enumUntil(DAYS.THURSDAY, DAYS.MONDAY), [DAYS.THURSDAY, DAYS.WEDNESDAY, DAYS.TUESDAY]));
    });

});