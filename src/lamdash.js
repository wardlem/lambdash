// Modules for Built-in Types
var Bool = require('./Bool');
var Num = require('./Num');
var Int = require('./Int');
var Str = require('./Str');
var Arr = require('./Arr');
var Obj = require('./Obj');
var Regex = require('./Regex');
var DT = require('./DT');
var Fun = require('./Fun');

// Type Classes
var Eq = require('./Eq');
var Bounded = require('./Bounded');
var Enum = require('./Enum');
var Ord = require('./Ord');
var Numeric = require('./Numeric');
var Functor = require('./Functor');
var Semigroup = require('./Semigroup');
var Monoid = require('./Monoid');
var Foldable = require('./Foldable');
var Sequential = require('./Sequential');
var Applicative = require('./Applicative');
var Monad = require('./Monad');
var Show = require('./Show');

// Auxiliary types
var Ordering = require('./Ordering');

// Blank
var __ = require('./internal/_blank');

var Type = {
    product: require('./productType'),
    sum: require('./sumType'),
    enumerated: require('./enumeratedType'),
    module: require('./internal/_module'),
    subModule: require('./internal/_subModule'),
    moduleFor: require('./internal/_moduleFor'),
    hasModuleMethod: require('./internal/_hasModuleMethod'),
    useModuleMethod: require('./internal/_useModuleMethod')
};

var lamdash = module.exports;

lamdash.Bool = Bool;
lamdash.Num = Num;
lamdash.Int = Int;
lamdash.Str = Str;
lamdash.Arr = Arr;
lamdash.Obj = Obj;
lamdash.Regex = Regex;
lamdash.DT = DT;
lamdash.Fun = Fun;

lamdash.Eq = Eq;
lamdash.Bounded = Bounded;
lamdash.Enum = Enum;
lamdash.Ord = Ord;
lamdash.Numeric = Numeric;
lamdash.Functor = Functor;
lamdash.Semigroup = Semigroup;
lamdash.Monoid = Monoid;
lamdash.Foldable = Foldable;
lamdash.Sequential = Sequential;
lamdash.Applicative = Applicative;
lamdash.Monad = Monad;
lamdash.Show = Show;

lamdash.Type = Type;

// Eq
lamdash.eq = Eq.eq;
lamdash.neq = Eq.neq;

// Bounded
lamdash.isMin = Bounded.isMin;
lamdash.isMax = Bounded.isMax;
lamdash.minBound = Bounded.minBound;
lamdash.maxBound = Bounded.maxBound;

// Enum
lamdash.toInt = Enum.toInt;
lamdash.prev = Enum.prev;
lamdash.next = Enum.next;
lamdash.enumTo = Enum.enumTo;
lamdash.enumUntil = Enum.enumUntil;
lamdash.enumFrom = Enum.enumFrom;

// Ord
lamdash.compare = Ord.compare;
lamdash.gt = Ord.gt;
lamdash.lt = Ord.lt;
lamdash.gte = Ord.gte;
lamdash.lte = Ord.lte;
lamdash.min = Ord.min;
lamdash.max = Ord.max;

// Numeric
lamdash.toNum = Numeric.toNum;
lamdash.add = Numeric.add;
lamdash.sub = Numeric.sub;
lamdash.subBy = Numeric.subBy;
lamdash.mul = Numeric.mul;
lamdash.div = Numeric.div;
lamdash.divBy = Numeric.divBy;
lamdash.mod = Numeric.mod;
lamdash.modBy = Numeric.modBy;
lamdash.abs = Numeric.abs;
lamdash.sign = Numeric.sign;
lamdash.negate = Numeric.negate;
lamdash.reciprocal = Numeric.reciprocal;
lamdash.pow = Numeric.pow;
lamdash.powBy = Numeric.powBy;

// Functor
lamdash.map = Functor.map;

// Semigroup
lamdash.concat = Semigroup.concat;
lamdash.concatAll = Semigroup.concatAll;

// Monoid
lamdash.empty = Monoid.empty;
lamdash.isEmpty = Bool.condition(
    [Monoid.member, Monoid.isEmpty],
    [Foldable.member, Foldable.isEmpty],
    [Bool.T, Fun.alwaysThrow(TypeError, "lamdash#isEmpty can only be called on a value that implements monoid or foldable")]
);
lamdash.cycleN = Monoid.cycleN;

// Foldable
lamdash.fold = Foldable.fold;
lamdash.foldl = Foldable.foldl;
lamdash.foldr = Foldable.foldr;
lamdash.foldMap = Foldable.foldMap;
lamdash.foldMap2 = Foldable.foldMap2;
lamdash.join = Foldable.join;
lamdash.join2 = Foldable.join2;
lamdash.toArray = Foldable.toArray;
lamdash.length = Bool.condition(
    [Type.hasModuleMethod('length'), Type.useModuleMethod('length')],
    [Foldable.member, Foldable.length],
    [Bool.T, Fun.alwaysThrow(TypeError, "lamdash#length called on invalid value")]
);
lamdash.contains = Foldable.contains;
lamdash.notContains = Foldable.notContains;
lamdash.all = Foldable.all;
lamdash.any = Foldable.any;
lamdash.countWith = Foldable.countWith;
lamdash.count = Foldable.count;
lamdash.fold1 = Foldable.fold1;
lamdash.foldl1 = Foldable.foldl1;
lamdash.foldr1 = Foldable.foldr1;
lamdash.maximum = Foldable.maximum;
lamdash.minimum = Foldable.minimum;
lamdash.sum = Foldable.sum;
lamdash.product = Foldable.product;

// Sequential
lamdash.nth = Sequential.nth;
lamdash.append = Sequential.append;
lamdash.prepend = Sequential.prepend;
lamdash.slice = Sequential.slice;
lamdash.take = Sequential.take;
lamdash.drop = Sequential.drop;
lamdash.takeLast = Sequential.takeLast;
lamdash.dropLast = Sequential.dropLast;
lamdash.head = Sequential.head;
lamdash.last = Sequential.last;
lamdash.tail = Sequential.tail;
lamdash.init = Sequential.init;
lamdash.intersperse = Sequential.intersperse;
lamdash.reverse = Sequential.reverse;
lamdash.splitAt = Sequential.splitAt;
lamdash.takeWhile = Sequential.takeWhile;
lamdash.dropWhile = Sequential.dropWhile;
lamdash.takeLastWhile = Sequential.takeLastWhile;
lamdash.dropLastWhile = Sequential.dropLastWhile;
lamdash.filter = Sequential.filter;
lamdash.uniqueBy = Sequential.uniqueBy;
lamdash.unique = Sequential.unique;
lamdash.findIndex = Sequential.findIndex;
lamdash.findLastIndex = Sequential.findLastIndex;
lamdash.find = Sequential.find;
lamdash.findLast = Sequential.findLast;
lamdash.indexOf = Sequential.indexOf;
lamdash.lastIndexOf = Sequential.lastIndexOf;

// Applicative
lamdash.ap = Applicative.ap;

// Monad
lamdash.flatten = Monad.flatten;
lamdash.chain = Monad.chain;
lamdash.composeM = Monad.composeM;
lamdash.pipeM = Monad.pipeM;

// Show
lamdash.show = Show.show;

// Bool
lamdash.and = Bool.and;
lamdash.or = Bool.or;
lamdash.not = Bool.not;
lamdash.condition = Bool.condition;
lamdash.T = Bool.T;
lamdash.F = Bool.F;

// Str
lamdash.split = Str.split;
lamdash.lines = Str.lines;
lamdash.words = Str.words;
lamdash.unlines = Str.unlines;
lamdash.unwords = Str.unwords;

// Function
lamdash.compose = Fun.compose;
lamdash.pipe = Fun.pipe;
lamdash.always = Fun.always;
lamdash.alwaysThrow = Fun.alwaysThrow;
lamdash.thunk = Fun.thunk;
lamdash.identity = Fun.identity;
lamdash.curry = Fun.curry;
lamdash.curryN = Fun.curryN;
lamdash.arity = Fun.arity;
lamdash.make = Fun.make;
lamdash.thisify = Fun.thisify;
lamdash.liftN = Fun.liftN;
lamdash.lift = Fun.lift;

// Ordering
lamdash.Ordering = Ordering;
lamdash.LT = Ordering.LT;
lamdash.GT = Ordering.GT;
lamdash.EQ = Ordering.EQ;

// Blank
lamdash.__ = __;
Object.defineProperty(lamdash, '@@functional/blank', {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false
});

