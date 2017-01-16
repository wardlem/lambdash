var assert = require('assert');

var sumType = require('../src/sumType');
var _curry = require('../src/internal/_curry');
var _equal = require('../src/internal/_equal');

var Arr = require('../src/Array');
var Foldable = require('../src/Foldable');
var Sequential = require('../src/Sequential');

var List = function List() {
    var l = List.Nil;
    var argsInd = arguments.length - 1;
    while(argsInd >= 0) {
        l = List.Cons(arguments[argsInd], l);
        argsInd -= 1;
    }
    return l;
};

List = sumType(List, {Cons: {head: null, tail: List}, Nil: []});

List.foldl = _curry(function(fn, init, l){
    return List.case({
        "Nil": init,
        "Cons": function(hd, tl) {
            return List.foldl(fn, fn(init, hd), tl)
        }
    }, l);
});

List.foldr = _curry(function(fn, init, l){
    return List.case({
        "Nil": init,
        "Cons": function(hd, tl) {
            return fn(List.foldr(fn, init, tl), hd);
        }
    }, l);
});

List.fold = List.foldl;

List.concat = _curry(function(left, right) {
    //console.log(left, right);

    if (left === List.Nil) {
        return right;
    }


    return List.Cons(left.head, List.concat(left.tail, right));
});

List.of = _curry(function(value) {
    return List.Cons(value, List.Nil);
});

List.empty = function(){return List.Nil};

List.nth = _curry(function(n, list) {
    if (list === List.Nil) {
        throw new RangeError('Index out of bounds');
    }
    if (n <= 0) {
        return list.head;
    }
    return List.nth(n-1, list.tail);
});

List.show = function(list) {
    return "List(" + Foldable.toArray(list).join(',') + ")"
};

describe('Sequential', function(){
    describe('#member', function() {
        it('should return true if a value implements the interface, false otherwise', function(){
            assert.equal(Sequential.member([]), true);
            assert.equal(Sequential.member(List()), true);
            assert.equal(Sequential.member(1), false);
            assert.equal(Sequential.member(false), false);
        });
    });

    describe('#length', function() {
        it('should return the length of a sequential value', function() {
            assert.equal(Sequential.len(List()), 0);
            assert.equal(Sequential.len(List(1,2,3,4)), 4);
            assert.equal(Sequential.len([]), 0);
            assert.equal(Sequential.len([1,2,3,4]), 4);
        })
    });



    describe('#nth', function(){
        it('should return the nth value of a sequence when positive', function(){
            var list = List(7,6,5,4,3,2,1);
            var arr = [7,6,5,4,3,2,1];

            var fifth = Sequential.nth(4);

            assert.equal(fifth(list), 3);
            assert.equal(fifth(arr), 3);

            assert.equal(Sequential.nth(3, list), 4);
            assert.equal(Sequential.nth(3, arr), 4);

        });
    });

    describe('#append', function(){
        it('should append a value to then end of the sequence', function() {
            var list = List(1,2,3);
            var list2 = Sequential.append(4, list);

            assert.equal(Sequential.len(list), 3);
            assert.equal(Sequential.len(list2), 4);
            assert.equal(_equal(list2, List(1,2,3,4)), true);
        });
    });

    describe('#prepend', function(){
        it('should append a value to then end of the sequence', function() {
            var list = List(1,2,3);
            var list2 = Sequential.prepend(4, list);

            assert.equal(Sequential.len(list), 3);
            assert.equal(Sequential.len(list2), 4);
            assert.equal(_equal(list2, List(4,1,2,3)), true);
        });
    });

    describe('#slice', function() {
        it('should returns a subsection of a sequence', function() {
            var list = List(7,6,5,4,3,2,1);
            var arr = [7,6,5,4,3,2,1];

            var subList = Sequential.slice(1,4, list);
            var subArr = Sequential.slice(1,4, arr);

            assert.equal(Sequential.len(subList), 3);
            assert.equal(_equal(List(6,5,4), subList), true);
            assert.equal(Sequential.len(subArr), 3);
            assert.equal(_equal([6,5,4], subArr), true);
        });
    });

    describe('#take', function(){
        it('should return a prefix of a sequence of the specified amount', function() {
            var list = List(1,2,3,4,5,6,7);

            assert.equal(_equal(Sequential.take(4, list), List(1,2,3,4)), true);
        })
    });

    describe('#drop', function(){
        it('should return a suffix of a sequence with the specified number of elements removed', function() {
            var list = List(1,2,3,4,5,6,7);

            assert.equal(_equal(Sequential.drop(4, list), List(5,6,7)), true);
        })
    });

    describe('#takeLast', function(){
        it('should return a suffix of a sequence of the specified amount', function() {
            var list = List(1,2,3,4,5,6,7);

            assert.equal(_equal(Sequential.takeLast(4, list), List(4,5,6,7)), true);
        })
    });

    describe('#dropLast', function(){
        it('should return a prefix of a sequence with the specified number of elements removed', function() {
            var list = List(1,2,3,4,5,6,7);
            assert.equal(_equal(Sequential.dropLast(4, list), List(1,2,3)), true);
        })
    });

    describe('#head', function(){
        it('should return the first element of a sequence', function() {
            var list = List(1,2,3,4,5,6,7);
            assert.equal(Sequential.head(list), 1);
        })
    });

    describe('#last', function(){
        it('should return the final element of a sequence', function() {
            var list = List(1,2,3,4,5,6,7);
            assert.equal(Sequential.last(list), 7);
        })
    });

    describe('#tail', function(){
        it('should return a sequence with the first item removed', function() {
            var list = List(1,2,3,4,5,6,7);
            assert.equal(_equal(Sequential.tail(list), List(2,3,4,5,6,7)), true);
        })
    });

    describe('#init', function(){
        it('should return a sequence with the last item removed', function() {
            var list = List(1,2,3,4,5,6,7);
            assert.equal(_equal(Sequential.init(list), List(1,2,3,4,5,6)), true);
        })
    });

    describe('#intersperse', function(){
        it('should return the sequence with a value interspersed', function(){
            var list = List(1,2,3,4);

            assert.equal(_equal(Sequential.intersperse(5, list), List(1,5,2,5,3,5,4)),true)
        });
    });

    describe('#reverse', function(){
        it('should return the sequence reversed', function(){
            var list = List(1,2,3,4,5);
            assert.equal(_equal(Sequential.reverse(list), List(5,4,3,2,1)),true);
        });
    });

    describe('#splitAt', function() {
        it('should return an array of a prefix and suffix of a sequence', function() {
            var list = List(1,2,3,4,5,6,7);
            var split = Sequential.splitAt(3, list);
            assert.equal(_equal(split[0], List(1,2,3)),true);
            assert.equal(_equal(split[1], List(4,5,6,7)), true);
        });
    });

    describe('#takeWhile', function() {
        it('should return a prefix up until a predicate returns false', function() {
            var list = List(1,2,3,4,5,6,7);
            var fn = function(x){return x < 4;};

            assert.equal(_equal(Sequential.takeWhile(fn, list), List(1,2,3)), true);
        });
    });

    describe('#dropWhile', function(){
        it('should return a suffix with all values removed until a predicate returns false', function(){
            var list = List(1,2,3,4,5,6,7);
            var fn = function(x){return x < 4;};

            assert.equal(_equal(Sequential.dropWhile(fn, list), List(4,5,6,7)), true);
        })
    });

    describe('#takeLastWhile', function() {
        it('should return a suffix up until a predicate returns false', function() {
            var list = List(1,2,3,4,5,6,7);
            var fn = function(x){return x > 4;};

            assert.equal(_equal(Sequential.takeLastWhile(fn, list), List(5,6,7)), true);
        });
    });

    describe('#dropLastWhile', function() {
        it('should return a suffix up until a predicate returns false', function() {
            var list = List(1,2,3,4,5,6,7);
            var fn = function(x){return x > 4;};

            assert.equal(_equal(Sequential.dropLastWhile(fn, list), List(1,2,3,4)), true);
        });
    });

    describe('#filter', function(){
        it('should return a sequence with only the values that return true for a predicate', function(){
            var list = List(6,2,4,1,8,6,7);
            var fn = function(x){return x > 4;};

            assert.equal(_equal(Sequential.filter(fn, list), List(6,8,6,7)),true)

        });
    });

    describe('#uniqueBy', function(){
        it('should return the sequence with no repeated items according to the result of a function', function(){
            var list = List({a:1, b:3},{a:1, b:1},{a:2, b:2},{a:3, b:1},{a:2, b:1},{a:1, b:6});
            var fnA = function(item){return item.a;};
            var fnB = function(item){return item.b;};

            var uniqA = Sequential.uniqueBy(fnA, list);
            var uniqB = Sequential.uniqueBy(fnB, list);

            assert.equal(Sequential.len(uniqA), 3);
            assert.equal(_equal(uniqA, List({a:1, b:3},{a:2, b:2},{a:3, b:1})), true);

            assert.equal(Sequential.len(uniqB), 4);
            assert.equal(_equal(uniqB, List({a:1, b:3}, {a:1, b:1},{a:2,b:2}, {a:1, b:6})), true);
        })
    });

    describe('#unique', function(){
        it('should return the sequence with no repeated items', function(){
            var list = List({a:1, b:3},{a:1, b:1},{a:2, b:2},{a:3, b:1},{a:2, b:2},{a:3, b:1},{a:2,b:2});

            var uniq = Sequential.unique(list);

            assert.equal(Sequential.len(uniq), 4);
            assert.equal(_equal(uniq, List({a:1, b:3},{a:1, b:1},{a:2,b:2},{a:3,b:1})), true);

        })
    });

    describe('#findIndex', function(){
        it('should return the index of the first item that matches a predicate', function(){
            var list = List(1,5,3,6,9,7,3,5);

            var idx = Sequential.findIndex(_equal(3), list);

            assert.equal(idx,2);
        });
    });

    describe('#findLastIndex', function(){
        it('should return the index of the first item that matches a predicate', function(){
            var list = List(1,5,3,6,9,7,3,5);

            var idx = Sequential.findLastIndex(_equal(3), list);

            assert.equal(idx,6);
        });
    });

    describe('#find', function(){
        it('should return the first item that matches a predicate', function(){
            var list = List({a:1, b:1}, {a:2, b:2}, {a:3, b:3}, {a:2, b:4}, {a:5, b:5});
            var fn = function(obj){return obj.a === 2};
            var obj = Sequential.find(fn, list);

            assert.equal(_equal(obj, {a:2,b:2}), true);
        });
    });

    describe('#findLast', function(){
        it('should return the first item that matches a predicate', function(){
            var list = List({a:1, b:1}, {a:2, b:2}, {a:3, b:3}, {a:2, b:4}, {a:5, b:5});
            var fn = function(obj){return obj.a === 2};
            var obj = Sequential.findLast(fn, list);

            assert.equal(_equal(obj, {a:2,b:4}), true);
        });
    });

    describe('#indexOf', function(){
        it('should return the index of the first item that matches a value', function(){
            var list = List(1,5,3,6,9,7,3,5);

            var idx = Sequential.indexOf(3, list);

            assert.equal(idx,2);
        });
    });

    describe('#lastIndexOf', function(){
        it('should return the index of the first item that matches a value', function(){
            var list = List(1,5,3,6,9,7,3,5);

            var idx = Sequential.lastIndexOf(3, list);

            assert.equal(idx,6);
        });
    });
});
