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

var lambdash = module.exports;

lambdash.Bool = Bool;
lambdash.Num = Num;
lambdash.Int = Int;
lambdash.Str = Str;
lambdash.Arr = Arr;
lambdash.Obj = Obj;
lambdash.Regex = Regex;
lambdash.DT = DT;
lambdash.Fun = Fun;

lambdash.Eq = Eq;
lambdash.Bounded = Bounded;
lambdash.Enum = Enum;
lambdash.Ord = Ord;
lambdash.Numeric = Numeric;
lambdash.Functor = Functor;
lambdash.Semigroup = Semigroup;
lambdash.Monoid = Monoid;
lambdash.Foldable = Foldable;
lambdash.Sequential = Sequential;
lambdash.Applicative = Applicative;
lambdash.Monad = Monad;
lambdash.Show = Show;

lambdash.Type = Type;

// Eq
lambdash.eq = Eq.eq;
lambdash.neq = Eq.neq;

// Bounded
lambdash.isMin = Bounded.isMin;
lambdash.isMax = Bounded.isMax;
lambdash.minBound = Bounded.minBound;
lambdash.maxBound = Bounded.maxBound;

// Enum
lambdash.toInt = Enum.toInt;
lambdash.prev = Enum.prev;
lambdash.next = Enum.next;
lambdash.enumTo = Enum.enumTo;
lambdash.enumUntil = Enum.enumUntil;
lambdash.enumFrom = Enum.enumFrom;

// Ord
lambdash.compare = Ord.compare;
lambdash.gt = Ord.gt;
lambdash.lt = Ord.lt;
lambdash.gte = Ord.gte;
lambdash.lte = Ord.lte;
lambdash.min = Ord.min;
lambdash.max = Ord.max;

// Numeric
lambdash.toNum = Numeric.toNum;
lambdash.add = Numeric.add;
lambdash.sub = Numeric.sub;
lambdash.subBy = Numeric.subBy;
lambdash.mul = Numeric.mul;
lambdash.div = Numeric.div;
lambdash.divBy = Numeric.divBy;
lambdash.mod = Numeric.mod;
lambdash.modBy = Numeric.modBy;
lambdash.abs = Numeric.abs;
lambdash.sign = Numeric.sign;
lambdash.negate = Numeric.negate;
lambdash.reciprocal = Numeric.reciprocal;
lambdash.pow = Numeric.pow;
lambdash.powBy = Numeric.powBy;

// Functor
lambdash.map = Functor.map;

// Semigroup
lambdash.concat = Semigroup.concat;
lambdash.concatAll = Semigroup.concatAll;

// Monoid
lambdash.empty = Monoid.empty;
lambdash.isEmpty = Bool.condition(
    [Monoid.member, Monoid.isEmpty],
    [Foldable.member, Foldable.isEmpty],
    [Bool.T, Fun.alwaysThrow(TypeError, "lamdash#isEmpty can only be called on a value that implements monoid or foldable")]
);
lambdash.cycleN = Monoid.cycleN;

// Foldable
lambdash.fold = Foldable.fold;
lambdash.foldl = Foldable.foldl;
lambdash.foldr = Foldable.foldr;
lambdash.foldMap = Foldable.foldMap;
lambdash.foldMap2 = Foldable.foldMap2;
lambdash.join = Foldable.join;
lambdash.join2 = Foldable.join2;
lambdash.toArray = Foldable.toArray;
lambdash.length = Bool.condition(
    [Type.hasModuleMethod('length'), Type.useModuleMethod('length')],
    [Foldable.member, Foldable.length],
    [Bool.T, Fun.alwaysThrow(TypeError, "lamdash#length called on invalid value")]
);
lambdash.contains = Foldable.contains;
lambdash.notContains = Foldable.notContains;
lambdash.all = Foldable.all;
lambdash.any = Foldable.any;
lambdash.countWith = Foldable.countWith;
lambdash.count = Foldable.count;
lambdash.fold1 = Foldable.fold1;
lambdash.foldl1 = Foldable.foldl1;
lambdash.foldr1 = Foldable.foldr1;
lambdash.maximum = Foldable.maximum;
lambdash.minimum = Foldable.minimum;
lambdash.sum = Foldable.sum;
lambdash.product = Foldable.product;

// Sequential
lambdash.nth = Sequential.nth;
lambdash.append = Sequential.append;
lambdash.prepend = Sequential.prepend;
lambdash.slice = Sequential.slice;
lambdash.take = Sequential.take;
lambdash.drop = Sequential.drop;
lambdash.takeLast = Sequential.takeLast;
lambdash.dropLast = Sequential.dropLast;
lambdash.head = Sequential.head;
lambdash.last = Sequential.last;
lambdash.tail = Sequential.tail;
lambdash.init = Sequential.init;
lambdash.intersperse = Sequential.intersperse;
lambdash.reverse = Sequential.reverse;
lambdash.splitAt = Sequential.splitAt;
lambdash.takeWhile = Sequential.takeWhile;
lambdash.dropWhile = Sequential.dropWhile;
lambdash.takeLastWhile = Sequential.takeLastWhile;
lambdash.dropLastWhile = Sequential.dropLastWhile;
lambdash.filter = Sequential.filter;
lambdash.uniqueBy = Sequential.uniqueBy;
lambdash.unique = Sequential.unique;
lambdash.findIndex = Sequential.findIndex;
lambdash.findLastIndex = Sequential.findLastIndex;
lambdash.find = Sequential.find;
lambdash.findLast = Sequential.findLast;
lambdash.indexOf = Sequential.indexOf;
lambdash.lastIndexOf = Sequential.lastIndexOf;

// Applicative
lambdash.ap = Applicative.ap;

// Monad
lambdash.flatten = Monad.flatten;
lambdash.chain = Monad.chain;
lambdash.composeM = Monad.composeM;
lambdash.pipeM = Monad.pipeM;

// Show
lambdash.show = Show.show;

// Bool
lambdash.and = Bool.and;
lambdash.or = Bool.or;
lambdash.not = Bool.not;
lambdash.condition = Bool.condition;
lambdash.T = Bool.T;
lambdash.F = Bool.F;

// Str
lambdash.split = Str.split;
lambdash.lines = Str.lines;
lambdash.words = Str.words;
lambdash.unlines = Str.unlines;
lambdash.unwords = Str.unwords;

// Function
lambdash.compose = Fun.compose;
lambdash.pipe = Fun.pipe;
lambdash.always = Fun.always;
lambdash.alwaysThrow = Fun.alwaysThrow;
lambdash.thunk = Fun.thunk;
lambdash.identity = Fun.identity;
lambdash.curry = Fun.curry;
lambdash.curryN = Fun.curryN;
lambdash.arity = Fun.arity;
lambdash.make = Fun.make;
lambdash.thisify = Fun.thisify;
lambdash.liftN = Fun.liftN;
lambdash.lift = Fun.lift;

// Ordering
lambdash.Ordering = Ordering;
lambdash.LT = Ordering.LT;
lambdash.GT = Ordering.GT;
lambdash.EQ = Ordering.EQ;

// Blank
lambdash.__ = __;
Object.defineProperty(lambdash, '@@functional/blank', {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false
});
