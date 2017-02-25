// Modules for Built-in Types
const Bool = require('./Boolean');
const Num = require('./Number');
const Int = require('./Integer');
const Str = require('./String');
const Arr = require('./Array');
const Obj = require('./Object');
const Regex = require('./RegExp');
const DT = require('./Date');
const _Set = require('./Set');
const _Map = require('./Map');
const Fun = require('./Function');
const Unit = require('./Unit');
const Any = require('./Any');
const _ArrayBuffer = require('./ArrayBuffer');
const _TypedArray = require('./TypedArray');


// Type Classes
const Eq = require('./Eq');
const Bounded = require('./Bounded');
const Enum = require('./Enum');
const Ord = require('./Ord');
const Numeric = require('./Numeric');
const Functor = require('./Functor');
const Semigroup = require('./Semigroup');
const Monoid = require('./Monoid');
const Foldable = require('./Foldable');
const Sequential = require('./Sequential');
const Applicative = require('./Applicative');
const Monad = require('./Monad');
const SetOps = require('./SetOps');
const SetKind = require('./SetKind');
const Associative = require('./Associative');
const AssocFoldable = require('./AssocFoldable');
const Show = require('./Show');
const Serializable = require('./Serializable');
const Hashable = require('./Hashable');

// Auxiliary types
const Ordering = require('./Ordering');

// Blank
const __ = require('./internal/_blank');

const Type = require('./Type');

const lambdash = module.exports;

lambdash.Any = Any;
lambdash.Bool = lambdash.Boolean = Bool;
lambdash.Num = lambdash.Number = Num;
lambdash.Int = lambdash.Integer = Int;
lambdash.Str = lambdash.String = Str;
lambdash.Arr = lambdash.Array = Arr;
lambdash.Obj = lambdash.Object = Obj;
lambdash.Regex = lambdash.RegExp = Regex;
lambdash.DT = lambdash.Date = DT;
lambdash.Set = _Set;
lambdash.Map = _Map;
lambdash.Fun = lambdash.Function = Fun;
lambdash.Unit = Unit;
lambdash.ArrayBuffer = _ArrayBuffer;
lambdash.TypedArray = _TypedArray;
lambdash.Int8Array = _TypedArray.Int8Array,
lambdash.Uint8Array = _TypedArray.Uint8Array,
lambdash.Uint8ClampedArray = _TypedArray.Uint8ClampedArray,
lambdash.Int16Array = _TypedArray.Int16Array,
lambdash.Uint16Array = _TypedArray.Uint16Array,
lambdash.Int32Array = _TypedArray.Int32Array,
lambdash.Uint32Array = _TypedArray.Uint32Array,
lambdash.Float32Array = _TypedArray.Float32Array,
lambdash.Float64Array = _TypedArray.Float64Array,

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
lambdash.SetOps = SetOps;
lambdash.SetKind = SetKind;
lambdash.Associative = Associative;
lambdash.AssocFoldable = AssocFoldable;
lambdash.Show = Show;
lambdash.Serializable = Serializable;
lambdash.Hashable = Hashable;

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
    [Bool.T, Fun.alwaysThrow(TypeError, 'lambdash#isEmpty can only be called on a value that implements monoid or foldable')]
);
lambdash.cycleN = Monoid.cycleN;

// Foldable
lambdash.foldl = Foldable.foldl;
lambdash.foldr = Foldable.foldr;
lambdash.foldMap = Foldable.foldMap;
lambdash.foldMap2 = Foldable.foldMap2;
lambdash.join = Foldable.join;
lambdash.join2 = Foldable.join2;
lambdash.joinWith = Foldable.joinWith;
lambdash.joinWith2 = Foldable.joinWith2;
lambdash.toArray = Foldable.toArray;
lambdash.len = Bool.condition(
    [Type.hasModuleMethod('len'), Type.useModuleMethod('len')],
    [Foldable.member, Foldable.len],
    [Bool.T, Fun.alwaysThrow(TypeError, 'lambdash#len called on invalid value')]
);
lambdash.contains = Foldable.contains;
lambdash.notContains = Foldable.notContains;
lambdash.all = Foldable.all;
lambdash.any = Foldable.any;
lambdash.countWith = Foldable.countWith;
lambdash.count = Foldable.count;
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

// SetOps
lambdash.union = SetOps.union;
lambdash.difference = SetOps.difference;
lambdash.intersection = SetOps.intersection;
lambdash.symmetricDifference = SetOps.symmetricDifference;

// SetKind
lambdash.exists = SetKind.exists;
lambdash.insert = SetKind.insert;
lambdash.remove = SetKind.remove;

// Associative
lambdash.assoc = Associative.assoc;
lambdash.dissoc = Associative.dissoc;
lambdash.lookup = Associative.lookup;
lambdash.lookupAll = Associative.lookupAll;
lambdash.lookupOr = Associative.lookupOr;
lambdash.update = Associative.update;
lambdash.updateOr = Associative.updateOr;

// AssocFoldable
lambdash.keys = AssocFoldable.keys;
lambdash.values = AssocFoldable.values;
lambdash.mapAssoc = AssocFoldable.mapAssoc;
lambdash.foldlAssoc = AssocFoldable.foldlAssoc;
lambdash.foldrAssoc = AssocFoldable.foldrAssoc;
lambdash.filterAssoc = AssocFoldable.filterAssoc;
lambdash.pairs = AssocFoldable.pairs;

// Hashable
lambdash.hashWithSeed = Hashable.hashWithSeed;
lambdash.hash = Hashable.hash;

// Show
lambdash.show = Show.show;

// Arr
lambdash.applyTo = Arr.applyTo;

// Obj
lambdash.copy = Obj.copy;
lambdash.copyOwn = Obj.copyOwn;
lambdash.propExists = Obj.propExists;
lambdash.ownPropExists = Obj.ownPropExists;
lambdash.prop = Obj.prop;
lambdash.propOr = Obj.propOr;
lambdash.props = Obj.props;
lambdash.propNames = Obj.propNames;
lambdash.ownPropNames = Obj.ownPropNames;
lambdash.ownValues = Obj.ownValues;
lambdash.ownPairs = Obj.ownPairs;

// Bool
lambdash.and = Bool.and;
lambdash.or = Bool.or;
lambdash.xor = Bool.xor;
lambdash.not = Bool.not;
lambdash.both = Bool.both;
lambdash.either = Bool.either;
lambdash.neither = Bool.neither;
lambdash.eitherExclusive = Bool.eitherExclusive;
lambdash.condition = Bool.condition;
lambdash.T = Bool.T;
lambdash.F = Bool.F;

// Str
lambdash.split = Str.split;
lambdash.match = Str.match;
lambdash.replace = Str.replace;
lambdash.toLower = Str.toLower;
lambdash.toUpper = Str.toUpper;
lambdash.trim = Str.trim;
lambdash.lines = Str.lines;
lambdash.words = Str.words;
lambdash.unlines = Str.unlines;
lambdash.unwords = Str.unwords;

// Fun
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
lambdash.apply = Fun.apply;
lambdash.noop = Fun.noop;
lambdash.flip = Fun.flip;
lambdash.typecached = Fun.typecached;

// Regex
lambdash.test = Regex.test;
lambdash.exec = Regex.exec;

// Ordering
lambdash.Ordering = Ordering;
lambdash.LT = Ordering.LT;
lambdash.GT = Ordering.GT;
lambdash.EQ = Ordering.EQ;

// ADTs
lambdash.unapply = Type.useModuleMethod('unapply');
lambdash.case = Type.useModuleMethod('case');
lambdash.set = Type.useModuleMethod('set');
lambdash.patch = Type.useModuleMethod('patch');
lambdash.toJSON = Type.useModuleMethod('toJSON');

// Blank
lambdash.__ = __;
Object.defineProperty(lambdash, '@@functional/blank', {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false,
});

require('./_derives')(lambdash);
