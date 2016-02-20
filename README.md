# Lambdash

Lambdash is a library for generic functional programming in JavaScript.

Lamdash enables you to create custom data types that are on equal footing with
the types built into the javascript language.
It also enables you to write your code in a point-free, functional style.

The library is built on two concepts: modules, and interfaces (aka typeclasses).
Every value has a module.  This is almost always the value's constructor.
A module provides all the functions that operate on a type.

An interface defines a set of operations that must be implemented by a module for a type.
Typically, implementing an interface allows for other operations to be performed on the value.
The idea is that a little effort can result in a large payoff in terms of the functionality
that lambdash can provide for your types.

Lamdash attempts to provide a mostly pure functional api.
This includes curried functions and operations that do not modify the values they operate on (immutability).


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Interfaces](#interfaces)
  - [Eq](#eq)
  - [Ord](#ord)
  - [Bounded](#bounded)
  - [Enum](#enum)
  - [Functor](#functor)
  - [Semigroup](#semigroup)
  - [Monoid](#monoid)
  - [Applicative](#applicative)
  - [Monad](#monad)
  - [Foldable](#foldable)
  - [Sequential](#sequential)
  - [SetOps](#setops)
  - [Set](#set)
  - [Associative](#associative)
  - [Show](#show)
- [Modules For Built-in Types](#modules-for-built-in-types)
  - [Any](#any)
  - [Bool](#bool)
  - [Num](#num)
  - [Int](#int)
  - [Str](#str)
  - [Arr](#arr)
  - [Obj](#obj)
  - [Regex](#regex)
  - [DT](#dt)
  - [Fun](#fun)
  - [Unit](#unit)
  - [The future](#the-future)
- [Creating Types](#creating-types)
  - [Creating a Module](#creating-a-module)
  - [Product Types](#product-types)
  - [Sum Types](#sum-types)
  - [Enumerated Types](#enumerated-types)
  - [Implementing Interfaces](#implementing-interfaces)
- [Roadmap](#roadmap)
  - [Plans For Next Release](#plans-for-next-release)
  - [Future Plans](#future-plans)
- [Additional Libraries](#additional-libraries)
- [Contributing](#contributing)
- [Tests](#tests)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Interfaces

Lambdash defines several standard interfaces (a.k.a. type classes) for custom and built in types.
These interfaces allow generic functions to operate on implementing types in a manner specific to the data type being operated on.
In general, these interfaces mirror the standard type classes in Haskell, though many functions are renamed to those more familiar to JavaScript.

### Eq

Eq is an interface which defines equality between items of the same type.
In particular, it is intended to test for *structural* equality.

#### Minimal Implementation

1. `eq`: `a -> a -> Boolean`

#### Derived Functions

1. `neq`: `a -> a -> Boolean`

#### Examples

```javascript
var arr1 = [1,2,3];
var arr2 = [1,2,3];
var arr3 = [1,2,3,4];

_.eq(arr1, arr2);  // true
_.neq(arr1, arr2); // false

_.eq(arr1, arr3);  // false
_.neq(arr1, arr3); // true
```

### Ord

Ord is an interface for the ordering of elements.

To facilitate ordering, Lambdash provides an algebraic data type for ordering called *Ordering*.

```javascript
// represents a "less than result"
_.Ordering.LT === _.LT

// represents a "greater than result"
_.Ordering.GT === _.GT

// represents an "equal to result"
_.Ordering.EQ === _.EQ
```

Types that implement Ord must also implement Eq.

#### Minimal Implementation

1. `compare`: `a -> a -> Ordering`

#### Derived Functions

1. `lt`: `a -> a -> Boolean`
2. `gt`: `a -> a -> Boolean`
3. `lte`: `a -> a -> Boolean`
4. `gte`: `a -> a -> Boolean`
5. `min`: `a -> a -> a`
6. `max`: `a -> a -> a`

#### Examples

```javascript
_.compare(1, 2);             // _.LT
_.compare('cat', 'cab');     // _.GT
_.compare([1,2,3], [1,2,3]); // _.EQ

_.lt(1, 2);             // true
_.gt('boat', 'coat');   // false

_.min(43, 56);          // 43
_.max([1,2,3], [1,2,4]) // [1,2,4]
```

### Bounded

Bounded is an interface for types that have a maximum and minimum bound

#### Minimal Implementation

1. `minBound`: `() -> a`
2. `maxBound`: `() -> a`

#### Derived Functions

1. `isMin`: `a -> Boolean`
2. `isMax`: `a -> Boolean`

Additionally, the generic `_.minBound` and `_.maxBound` functions accepts a value and return the minBound and maxBound for the values type, respectively.

#### Examples

```javascript
_.isMin(false);    // true
_.isMin(true);     // false

_.isMax(false);    // false
_.isMax(true);     // true

_.minBound(true);  // false
_.maxBound(true);  // true
```

### Enum

The Enum interface is for types whose values are enumerable.
In particular, implementing values may be converted to and from an integer in a consistent fashion.

Values which implement Enum may or may not also implement Bounded.

#### Minimal implementation

1. `toInt`: `a -> Integer`
2. `fromInt`: `Integer -> a`

#### Derived Functions

1. `prev`: `a -> a`
2. `next`: `a -> a`
3. `enumTo`: `a -> a -> Array a`
4. `enumUntil`: `a -> a -> Array a`
5. `enumFrom`: `Integer -> a -> Array a`

#### Examples

```javascript
_.enumTo(1,5);         // [1,2,3,4,5]
_.enumUntil(1,5);      // [1,2,3,4]

_.enumTo(5,1);         // [5,4,3,2,1]
_.enumUntil(5,1);      // [5,4,3,2]

_.enumTo('A', 'E');    // ['A','B','C','D','E']
_.enumTo(true, false); // [true,false]

_.enumFrom(4, 'D');    // ['D','E','F','G']
_.enumFrom(-3, 'Q');   // ['Q','P','O']

_.enumFrom(2)('r');    // ['r','s']
_.enumFrom(_,2)(3);    // [2,3,4]
```


#### Numeric

The Numeric interface is for types upon whose values algebraic operations can be performed.

#### Minimal Implementation

1. `toNum` -> `a -> Number`
2. `fromNum` -> `Number -> a`

#### Optional Function Implementations

The following functions may be provided for optimization.
If they are not provided, operations, in most cases, are performed by first converting the value to a number then back to the type.
It is highly recommended that these functions are implemented rather than relying on the default behavior.

1. `add`: `a -> a -> a`
2. `sub`: `a -> a -> a`
3. `mul`: `a -> a -> a`
4. `div`: `a -> a -> a`
5. `mod`: `a -> a -> a`
6. `abs`: `a -> a`
7. `sign`: `a -> a`
8. `negate`: `a -> a`
9. `reciprocal`: `a -> a`
10. `pow`: `a -> a -> a`

#### Derived Functions

1. `subBy`: `a -> a -> a`
2. `divBy`: `a -> a -> a`
3. `modBy`: `a -> a -> a`
4. `powBy`: `a -> a -> a`


### Functor

A functor is a mappable, structure preserving type.

A functor should conform to the following law:

```javascript
_.map(_.identity, a) is equal to a
_.map(f, _.map(g, a)) is equal to _.map(_.compose(f,g), a)
```

#### Minimal Implementation

1. `map`: `Functor f => (a -> b) -> f a -> f b`

#### Example

```javascript
_.map(x => x + 1, [1,2,3]);   // [2,3,4]
```

### Semigroup

A semigroup is a type that whose values can be concatenated together.
The following law should be observed:

```
_.concat(a, _.concat(b, c)) is equal to _.concat(_.concat(a, b), c)
```

#### Minimal Implementation

1. `concat`: `a -> a -> a`

#### Derived Functions

1. `concatAll`: `a... -> a`

#### Examples

```javascript
_.concatAll([1,2],[3,4],[5,6]);  // [1,2,3,4,5,6]

_.concat([1,2],[3,4]);           // [1,2,3,4]
_.concat([1,2])([3,4]);          // [1,2,3,4]
_.concat(_,[1,2])([3,4]);        // [3,4,1,2]
```

### Monoid

A type that implements Monoid must also implement Semigroup

A Monoid is a semigroup with an empty value.
It must confrom to the following law:

```
_.concat(_.empty(a), a) is equal to _.concat(a, _.empty(a)) is equal to a
```

#### Minimal Implementation

1. `empty`: `() -> a`

#### Derived Functions

1. `isEmpty`: `a -> Boolean`
2. `cycleN`: `Number -> m -> m`

Additionally, the generic `_.empty` function accepts a value and returns the empty value for the type.

#### Examples

```javascript
_.empty([1,2,3]);     // []
_.empty("string");    // ""

_.isEmpty([1,2,3]);   // false
_.isEmpty([]);        // true

_.cycleN(3, [1,2,3]); // [1,2,3,1,2,3,1,2,3];
_.cycleN(4, ["ab"]);  // "abababab"
```

### Applicative

A type that implements applicative may have values which may be applied to other values of the type.

A value that implements Applicative must first implement Functor.

The following should be true:

    A.ap(A.of(f),A.of(a)) is equal to A.map(f, A.of(a))

#### Minimal Implementation

1. `ap`: `Applicative p => p (a -> b) -> p a -> p b`
2. `of`: `Applicative p => a -> p a`

#### Examples

```javascript
_.ap(_.Arr.of(x => x + 1), [1,2,3]);      // [2,3,4]
_.ap([x => x + 1, x => x * 2], [1,2,3]);  // [2,3,4,2,4,6]
```

### Monad

A monad is a chainable container type.

A type that implements Monad must first implement Applicative

#### Minimal Implementation

1. `flatten`: `Monad m => m (m a) -> m a`

#### Optional Function Implementations

1. `chain`: `Monad m => (a -> m b) -> m a -> m b`

Additionally, functions that operate on monads may be composed or piped using the `_.composeM` and `_.pipeM` functions.
These functions behave in a similar manner to `_.compose` and `_.pipe` except that the functions are joined with the `_.chain` function.

#### Examples

```javascript

    var Maybe = require('lambdash.maybe'),
        Just = Maybe.Just,
        None = Maybe.None;

    _.flatten(Just(Just(1)));       // Just(1)
    _.flatten(Just(None));          // None
    _.flatten(None);                // None

    _.flatten([[1,2],[3,4],[5,6]]);        // [1,2,3,4,5,6]

    _.chain(n => [n, n * 2], [1,2,3]);     // [1,2,2,4,3,6]

    var add1 = x => [_.add(x,1)];
    var mul2 = x => [_.mul(x,2)];
    var sub2 = x => [_.sub(x,2)];

    var composed = _.composeM(add1, mul2, sub2);
    composed([3,4,5]);                     // [3,5,7]

    var piped = _.pipeM(add1, mul2, sub2);
    piped([3,4,5]);                        // [6,8,10]

```

### Foldable

The Foldable interface is for container types that can be folded into a value.

#### Minimal Implementation

2. `foldl`: `Foldable f => (b -> a -> b) -> b -> f a -> b`
3. `foldr`: `Foldable f => (b -> a -> b) -> b -> f a -> b`

#### Derived Functions

1. `foldMap`: `(Foldable f, Monoid m) => (a -> m) -> f a -> m`
2. `foldMap2Def`: `(Foldable f, Monoid m) => (a -> m) -> m -> f a -> m`
3. `join`: `(Foldable f, Monoid m) => f m -> m`
4. `joinDef`: `(Foldable f, Monoid m) => m -> f m -> m`
3. `joinWith`: `(Foldable f, Monoid m) => m -> f m -> m`
4. `joinWithDef`: `(Foldable f, Monoid m) => m -> m -> f m -> m`
5. `toArray`: `Foldable f => f a -> Array a`
6. `len`: `Foldable f => f a -> Integer`
7. `isEmpty`: `Foldable f => f a -> Boolean`
8. `isNotEmpty`: `Foldable f => f a -> Boolean`
9. `contains`: `(Foldable f, Eq a) => a -> f a -> Boolean`
10. `notContains`: `(Foldable f, Eq a) => a -> f a -> Boolean`
11. `any`: `Foldable f => (a -> Boolean) -> f a -> Boolean`
12. `all`: `Foldable f => (a -> Boolean) -> f a -> Boolean`
13. `countWith`: `Foldable f => (a -> Boolean) -> f a -> Number`
13. `count`: `(Foldable f, Eq e) => e -> f e -> Number`
13. `fold1`: `Foldable f => (b -> a -> b) -> f a -> b`
14. `foldl1`: `Foldable f => (b -> a -> b) -> f a -> b`
15. `foldr1`: `Foldable f => (b -> a -> b) -> f a -> b`
16. `maximum`: `(Foldable f, Ord a) => f a -> a`
17. `minimum`: `(Foldable f, Ord a) => f a -> a`
18. `sum`: `(Foldable f, Numeric a) => f a -> a`
19. `product`: `(Foldable f, Numeric a) => f a -> a`


### Sequential

The Sequential interface is for containers whose values are ordered and indexable.

A type that implements Sequential must first implement Foldable and Monoid.

#### Minimal Implementation

1. `nth`: `Sequential s => Number -> s a -> a`
2. `of`: `Sequential s => a -> s a`

#### Optional Function Implementations

1. `len`: `Sequential s => s -> Number`
2. `append`: `Sequential s => a -> s a -> s a`
3. `prepend`: `Sequential s => a -> s a -> s a`
4. `slice`: `Sequential s => Number -> Number -> s a -> s a`
5. `intersperse`: `Sequential s => a -> s a -> s a`
6. `reverse`: `Sequential s => s a -> s a`
7. `filter`: `Sequential s => (a -> Boolean) -> s a -> s a`
8. `uniqueBy`: `Sequential s => (a -> b) -> s a -> s a`
9. `findIndex`: `Sequential s => (a -> Boolean) -> s a -> Number`
10. `findLastIndex`: `Sequential s => (a -> Boolean) -> s a -> Number`

#### Derived Functions

1. `take`: `Sequential s => Number -> s a -> s a`
2. `drop`: `Sequential s => Number -> s a -> s a`
3. `takeLast`: `Sequential s => Number -> s a -> s a`
4. `dropLast`: `Sequential s => Number -> s a -> s a`
5. `head`: `Sequential s => s a -> a`
6. `last`: `Sequential s => s a -> a`
7. `tail`: `Sequential s => s a -> s a`
8. `init`: `Sequential s => s a -> s a`
9. `splitAt`: `Sequential s => Number -> s a -> Array (s a)`
10. `takeWhile`: `Sequential s => (a -> Boolean) -> s a -> s a`
11. `dropWhile`: `Sequential s => (a -> Boolean) -> s a -> s a`
12. `takeLastWhile`: `Sequential s => (a -> Boolean) -> s a -> s a`
13. `dropLastWhile`: `Sequential s => (a -> Boolean) -> s a -> s a`
14. `unique`: `Sequential s => s a -> s a`
15. `find`: `Sequential s => (a -> Boolean) -> s a -> a`
16. `findLast`: `Sequential s => (a -> Boolean) -> s a -> a`
17. `indexOf`: `Sequential s => a -> s a -> Number`
18. `lastIndexOf`: `Sequential s => a -> s a -> Number`

### SetOps

SetOps is an interface for performing common set operations on

#### Minimal Implementation

1. `union`: `SetOps s => s -> s -> s`
2. `difference`: `SetOps s => s -> s -> s`
3. `intersection`: `SetOps s => s -> s -> s`
4. `symmetricDifference`: `SetOps s => s -> s -> s`


#### Derived Functions

There are none.

### Set

Set is an interface for a collection of (logical) unique values.

A type that implements set must also implement SetOps.

#### Minimal Implementation

1. `exists`: `Set s => k -> s k -> Boolean`
2. `insert`: `Set s => k -> s k -> s k`
3. `remove`: `Set s => k -> s k -> s k`

#### Derived Functions

There are none.

### Associative

The Associative interface is for containers that map keys to values.

#### Minimal Implementation

1. `assoc`: `Associative a => k -> v -> a k v -> a k v`
2. `dissoc`: `Associative a => k -> a k v -> a k v`
3. `exists`: `Associative a => k -> a k v -> Boolean`
4. `lookup`: `Associative a => k -> a k v -> v`

#### Optional Functions

These functions may be implemented, but they are not required nor are they derived.

1. `keys`: `Associative a => a k v -> Array k`
2. `values`: `Associative a => a k v -> Array v`
3. `mapAssoc`: `Associative a => (v -> k -> v) -> a k v -> a k v`
4. `foldlAssoc`: `Associative a => (b -> v -> k -> b) -> b -> a k v -> b`
5. `foldrAssoc`: `Associative a => (b -> v -> k -> b) -> b -> a k v -> b`
6. `filterAssoc`: `Associative a => (v -> k -> Boolean) -> a k v -> a k v`

#### Derived Functions

1. `lookupAll`: `(Functor f, Associative a) => f k -> a k v -> f v`
2. `lookupOr`: `Associative a => v -> k -> a k v -> v`

Additionally, if the type implements foldlAssoc the following is derived:

1. `pairs`: `Associative a => a k v -> Array Array(k,a))`

### Show

The show type is for converting a datatype to a string representation.

#### Minimal Implementation

1. `show`: `Show s => s -> String`

## Modules For Built-in Types

Lambdash provides a module for most of the built-in types.
If one is not provided, it the Obj module is the default.
All of the functions listed for each module are attached to the root lambdash object.

### Any

The any type can be any value.
It exists for validation when creating algebraic data types.


#### Implements

Nothing.

#### Functions

None.

### Bool

The Bool module is for Boolean values.

#### Implements

1. Eq
2. Ord
3. Enum
4. Show

#### Functions

1. `and`: `Boolean -> Boolean -> Boolean`
2. `or`: `Boolean -> Boolean -> Boolean`
3. `xor`: `Boolean -> Boolean -> Boolean`
4. `not`: `Boolean -> Boolean`
5. `both`: `(*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)`
6. `either`: `(*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)`
7. `neither`: `(*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)`
8. `eitherExclusive`: `(*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)`
9. `complement`: `(*... -> Boolean) -> (*... -> Boolean)`
10. `condition`: `[(*... -> Boolean), (*... -> a)]... -> (*... -> a)`
11. `T`: `() -> Boolean`
12. `F`: `() -> Boolean`

### Num

The Num module is for Number values.

#### Implements

1. Eq
2. Ord
3. Enum
4. Numeric
5. Show

#### Functions

No additional functions.

### Int

The Int module is only meant to act as a constraint for numbers that should always be integral.
Currently a number will always use the Num module for its functionality.

#### Implements

Nothing

#### Functions

No additional functions.

### Str

The Str module is for string values.

#### Implements

1. Eq
2. Ord
3. Enum (uses the first character of the string)
4. Functor
5. Semigroup
6. Monoid
7. Foldable
8. Sequential
9. Show

#### Functions

1. `split`: `String|RegExp -> String -> Array String`
2. `match`: `RegExp -> String -> Array String`
3. `replace`: `String|RegExp -> String -> String -> String`
4. `toLower`: `String -> String`
5. `toUpper`: `String -> String`
6. `trim`: `String -> String`
7. `lines`: `String -> Array String`
8. `words`: `String -> Array String`
9. `unlines`: `Foldable f => f String -> String`
10. `unwords`: `Foldable f => f String -> String`

### Arr

Arr is the lambdash module for Arrays.

#### Implements

1. Eq (if its elements implement Eq)
2. Ord (if its elements implement Ord)
3. Functor
4. Foldable
5. Semigroup
6. Monoid
7. Applicative
8. Monad
9. Sequential
10. SetOps
11. Set
12. Show (if its elements implement Show)

#### Functions

1. `applyTo`: `(* -> *) -> Array *  -> *`

### Obj

Object is the lambdash module for objects.

#### Implements

1. Eq (if its values implement Eq)
2. Ord (if its values implement Ord)
3. Functor
4. Semigroup (concat is a right biased union)
5. Monoid
6. SetOps
7. Foldable
8. Associative (with optional functions)
9. Show (if its values implement Show, keys are sorted)

#### Functions

1. `copy`: `{String: a} -> {String: a}`
2. `copyOwn`: `{String: a} -> {String: a}`
3. `propExists`: `String -> {String: a} -> Boolean`
4. `ownPropExists`: `String -> {String: a} -> Boolean`
5. `prop`: `String -> {String: a} -> a|undefined`
6. `propOr`: `a -> String -> {String: a} -> a`
7. `props`: `Foldable f => f String -> {String: a} -> f a`
8. `propNames`: `{String: a} -> [String]`
9. `ownPropNames`: `{String: a} -> [String]`
10. `ownValues`: `{String: a} -> [a]`
11. `ownPairs`: `{String: a} -> [[String, a]]`
12. `filter`: `(a -> Boolean) -> {String: a} -> {String: a}`

### Regex

Regex is the lambdash module for regular expression objects.

#### Implements

1. Show

#### Functions

1. `test`: `String -> RegExp -> Boolean`
2. `exec`: `String -> RegExp -> [String]`

#### Notes

A 3rd-party package could be created to extend this functionality.

### DT

DT is the lambdash module for DateTime objects.

#### Implements

1. Eq
2. Ord
3. Numeric
4. Show

#### Functions

None.

#### Notes

A 3rd-party package should be created to extend this functionality.

### Fun

Fun is the lambdash module for Functions.

#### Implements

Nothing.

#### Functions

`compose`: `(*... -> *)... -> (*... -> *)`
`pipe`: `(*... -> *)... -> (*... -> *)`
`always`: `a -> (() -> a)`
`alwaysThrow`: `(*... -> Error) -> *... -> (() -> ())`
`thunk`: `(*... -> *) -> *... -> (() -> *)`
`identity`: `a -> a`
`curry`: `(*...-> *) -> (*... -> *)`
`curryN`: `Number -> (*... -> *) -> (*... -> *)`
`arity`: `Number -> (*... -> *) -> (*... -> *)`
`make`: `String -> (*... -> *) -> (*... -> *)`
`thisify`: `(*... -> *) -> (*... -> *)`
`liftN`: `Applicative a => -> Number -> (*... -> c) -> ((a *)... -> a c)`
`lift`: `(*... -> c) -> ((a *)... -> a c)`
`apply`: `Foldable f => f * -> (*... -> a) -> a`
`noop`: `() -> ()`

### Unit

Unit is the module for undefined and null values.

#### Implements

1. Eq (always true)
2. Ord (always EQ)
3. Semigroup (always null)
4. Monoid
5. Functor (always null)
6. Show

#### Functions

None

### The future

The library does not yet support ECMAScript 2015 types.
There are plans for adding support for them.

## Creating Types

Lambdash provides a way to declare new algebraic data types.
It also provides a mechanism that will make lambdash start treating your types as modules,
which allows all of lambdash's generic functions to operate on your types instances.

### Creating a Module

Lambdash does not all care about an objects prototype.
Instead, it cares about modules.
Every object has module.
For custom types, by default, this module is lamdash's Obj module.
However, the whole point of the library is to allow the user the ability to
create their own types which will have an equal status with all the other types.

Lamdash provides a function, `_.Type.moduleFor`, which will return the module for a value.
The following is the process through which the module is identified:

1. If the value is null or undefined, return the Unit module
2. If the values constructor is a module and a submodule, return the constructor's parent module.
3. If the values constructor is a module, return the constructor
4. Return the appropriate module for built-in types.

A type can be declared as a module using the `_.Type.module` function.

```javascript

// this example uses a constructor function since it is an easy
// way to set a constructor for a value
function Example(x) {
    this.whatever = x
}

var ex = new Example(1);

_.Type.moduleFor(ex);   // _.Type.Obj

// make Example a module
_.Type.module(Example);
_.Type.ModuleFor(ex);  // Example

```

Submodules can be defined with the `_.Type.subModule` function.  
The first parameter is the parent module, the second is the submodule.
The submodule should also be declared as a module.
This functionality exists for sum types.

Modules will probably also want to add a `member` function.
The `member` function should accept a single value and return true if the value
is a member of the type, false if not.

### Product Types

Lamdash has a way to create product types.
A product type is a type that has a fixed number of labelled or non-labelled elements.

Product types are automatically created as modules.

A Product type should specify a name as its first argument and a definition as its second argument.
The definition may be an object or an array.
If the definition is an object, the keys will be the fields of the product type and the values
will be constraints.
If the definition is an array, its values should be constraints.

Constraints may be a type with a member function, a function that accepts a value and
returns true or false, or null.
If the constraint is null, the value may be of any type, but must be defined.

Every product type will automatically implement Eq (assuming its field implement Eq).
They will also have an unapply function.

```javascript

var Point = _.Type.product('Point', {x: _.Num, y: _.Num});

var p = Point(1,2);
p instanceof Point;  // true
_.Type.moduleFor(p); // Point
Point.name;          // "Point"
Point.member(point); // true

p.x;  // 1
p.y;  // 2
p[0]; // 1
p[1]; // 2

var p2 = Point('a', 'b'); // TypeError

// with an array
var Point = _.Type.product('Point', [_.Num, _.Num]);

p._0;  // 1
p._1;  // 2
p[0]; // 1
p[1]; // 2

_.eq(Point(1,2), Point(1,2)); // true
_.eq(Point(1,2), Point(1,3)); // false

_.unapply(function(x,y){console.log('x:'+x+',y:',y)}, p);  // 'x:1,y:2'

```

Every product type will automatically implement Eq (assuming its field implement Eq).
They will also have an unapply function.

### Sum Types

Sum types are a type that can be an instance of any one of its sub types.

To create a sum type pass a name as a string or a *named* function as the first
parameter, and a definition object to the second parameter of the `_.Type.sum` function.
The definition must be an object with the keys as the names of the subtypes, and
the values as product type definitions.
The keys must be valid identifier names.

If a definition of a subtype is empty, a single instance will be created and attached
to the sum type rather than the constructor.

Every sum type will implement Eq and will also have a case function which can be
use for simple matching of the type of the value.

```javascript

var Maybe = _.Type.sum('Maybe', {'None': [], 'Some': {value: _.Any}});

var maybe = Maybe.None;
maybe instancof Maybe;  // true
Maybe.member(maybe);    // true

_.Type.moduleFor(maybe); // Maybe

maybe = Maybe.Some(1);
maybe instanceof Maybe;      // true
maybe instanceof Maybe.Some; // true
Maybe.member(maybe);         // true

var value = _.case({
    None: 0,
    Some: function(v) {
        return v + 1;
    }
}, maybe);
// value is 2

// case with a default
value = _.case({
    None: 1,
    _: 0
}, maybe);
// value is 0

// creating maybe with a function
var Maybe = function(value) {return value == null ? Maybe.None : Maybe.Some(value) }
Maybe = _.Type.sum(Maybe, {'None': [], 'Some': {value: _.Any}});

Maybe(1);    // Some(1)
Maybe(null); // None

```

### Enumerated Types

Enumerated types are a special case of Sum types in which there are no values
associated with any of the sub types.

Enumerated types will automatically implement Ord, Bounded, and Enum.

```javascript

var Days = _.Type.enumerated('Days', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

_.enumFrom(Days.Tue, Days.Fri); // [Tue, Wed, Thu, Fri]
_.lt(Days.Tue, Days.Thu);       // true

Days.maxBound();   // 'Sun'
Days.minBound();   // 'Mon'

```

### Implementing Interfaces

Custom types may implement interfaces by creating the correct functions.

For example, consider implementing functor for the maybe type.  
The functor interface requires that the type implement `Map`.

```javascript

var Maybe = _.Type.sum('Maybe', {None: [], Some: {value: _.Any}});

var m = Maybe.Some(1);

_.Functor.member(m);  // false

Maybe.map = _.curry(function(fn, maybe){
    if (maybe === Maybe.None) {
        return maybe;
    }
    return Maybe.Some(fn(maybe.value));
});

_.Functor.member(m);         // true

_.map(_.add(2), m);          // Some(3)
_.map(_.add(2), Maybe.None); // None

```

## Roadmap

I feel that the 0.6.0 release is very significant release.
It is the first release that I actually feel comfortable using in a real application.

That being said, there is more work to do.

After the 0.6.0 release, I intend on improving the workflow.  
The master branch will always contain the most recent stable release and development
will take place in other branches.

### Plans For Next Release

The following is either planned or under review for the 0.7.0 release.

1. Implement modules for the new ECMAScript 2015 types
2. Figure out what to do with the Int module and what exactly its role in the library is
3. Adding Unicode processing functions to the Str module
4. Possibly adding a way to create a Union type (like a sum type from existing types)
5. Improve and further standardize docblocks and generate api docs

### Future Plans

1. Create a script that will amalgamate the files into one and minimize for the browser.
2. Create benchmarks.
3. Create a website for the library.
4. Create an external module that will improve or replace the DT module.


## Additional Libraries

Additional libraries for lambdash are either available or under development.

1. Task (For asynchronous computations)
2. List
3. Maybe
4. Either

If you have developed an additional library for lamdash, please let me know
so that I can list it here.

## Contributing

I am happy to take pull requests If anybody wants to contribute.

## Tests

To run tests:

```
npm install --dev
npm test
```

To run the coverage report:

```
npm run coverage
```
