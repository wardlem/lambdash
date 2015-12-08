# Lambdash

Lambdash is a library for generic functional programming in JavaScript.

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

#### Implementors

All built in types implement Eq with the exception of Function.
Composite types (arrays, objects, etc.) implement Eq so long as all of their elements implement Eq.

#### Examples

    var arr1 = [1,2,3];
    var arr2 = [1,2,3];
    var arr3 = [1,2,3,4];
    
    _.eq(arr1, arr2);  // true
    _.neq(arr1, arr2); // false
    
    _.eq(arr1, arr3);  // false
    _.neq(arr1, arr3); // true

### Ord

Ord is an interface for the ordering of elements.

To facilitate ordering, Lambdash provides an algebraic data type for ordering called *Ordering*.

    // represents a "less than result"
    _.Ordering.LT === _.LT
    
    // represents a "greater than result"
    _.Ordering.GT === _.GT
    
    // represents an "equal to result"
    _.Ordering.EQ === _.EQ
    
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

#### Implementors

All built in types implement Ord except for Function and Object.
Composite types (arrays, objects, etc.) implement Ord so long as all of their elements implement Ord.

#### Examples

    _.compare(1, 2);             // _.LT
    _.compare('cat', 'cab');     // _.GT
    _.compare([1,2,3], [1,2,3]); // _.EQ
    
    _.lt(1, 2);             // true
    _.gt('boat', 'coat');   // false
    
    _.min(43, 56);          // 43
    _.max([1,2,3], [1,2,4]) // [1,2,4]

### Bounded

Bounded is an interface for types that have a maximum and minimum bound

#### Minimal Implementation

1. `minBound`: `() -> a`
2. `maxBound`: `() -> a`

#### Derived Functions

1. `isMin`: `a -> Boolean`
2. `isMax`: `a -> Boolean`

Additionally, the generic `_.minBound` and `_.maxBound` functions accepts a value and return the minBound and maxBound for the values type, respectively.

#### Implementors

The Boolean type implements Bounded with false as the min bound and true as the max bound.

#### Examples

    _.isMin(false);    // true
    _.isMin(true);     // false
    
    _.isMax(false);    // false
    _.isMax(true);     // true
    
    _.minBound(true);  // false
    _.maxBound(true);  // true

### Enum

The Enum interface is for types whose values are enumerable.
In particular, implementing values may be converted to and from an integer in a consistent fashion.

Values which implement Enum may or may not also implement Bounded.

#### Minimal implementation

1. `toInt`: `a -> Integer`
2. `fromInt`: `Integer -> a`

#### Derived Functions

1. `enumTo`: `a -> a -> Array a`
2. `enumUntil`: `a -> a -> Array a`
3. `enumFrom`: `Integer -> a -> Array a`

#### Implementors

Enum is implemented by Number, String, and Boolean

#### Examples

    _.enumTo(1,5);         // [1,2,3,4,5]
    _.enumUntil(1,5);      // [1,2,3,4]
    
    _.enumTo(5,1);         // [5,4,3,2,1]
    _.enumUntil(5,1);      // [5,4,3,2]
    
    _.enumTo('A', 'E');    // ['A','B','C','D','E']
    _.enumTo(true, false); // [true,false]
    
    _.enumFrom(4, 'D');    // ['D','E','F','G']
    _.enumFrom(-3, 'Q');   // ['Q','P','O]
    
    _.enumFrom(2)('r');    // ['r','s']
    _.enumFrom(_,2)(3);    // [2,3,4]
    
    
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


### Semigroup

A semigroup is a type that whose values can be concatenated together.
The following law should be observed:

    _.concat(a, _.concat(b, c)) is equal to _.concat(_.concat(a, b), c)
    
#### Minimal Implementation

1. `concat`: `a -> a -> a`

#### Derived Functions

1. `concatAll`: `a -> a -> a`

#### Examples

    _.concatAll([1,2],[3,4],[5,6]);  // [1,2,3,4,5,6]
    
    _.concat([1,2],[3,4]);           // [1,2,3,4]
    _.concat([1,2])([3,4]);          // [1,2,3,4]
    _.concat(_,[1,2])([3,4]);        // [3,4,1,2]

### Monoid

A type that implements Monoid must also implement Semigroup

A Monoid is a semigroup with an empty value.
It must confrom to the following law:

    _.concat(_.empty(a), a) is equal to _.concat(a, _.empty(a)) is equal to a

#### Minimal Implementation

1. `empty`: `() -> a`

#### Derived Functions

1. `isEmpty`: `a -> Boolean`

Additionally, the generic `_.empty` function accepts a value and returns the empty value for the type.

### Functor

A functor is a mappable, structure preserving type.

A functor should conform to the following law:

    _.map(_.identity, a) is equal to a
    _.map(f, _.map(g, a)) is equal to _.map(_.compose(f,g), a)

#### Minimal Implementation

1. `map`: `Functor f => (a -> b) -> f a -> f b`

#### Example

```javascript
_.map(x => x + 1, [1,2,3]);   // [2,3,4]
```

### Applicative

A type that implements applicative may have values which may be applied to other values of the type.

A value that implements Applicative must first implement Functor.

The following should be true:

    A.of(f).ap(A.of(a)) is equal to A.map(f, A.of(a))

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

#### Derived Functions

1. `chain`: `Monad m => (a -> m b) -> m a -> m b`

Additionally, functions that operate on monads may be composed or piped using the `_.composeM` and `_.pipeM` functions.
These functions behave in a similar manner to `_.compose` and `_.pipe` except that the functions are joined with the `_.chain` function.

#### Examples

```javascript

    var Maybe = require('lambdash.maybe'),
        Just = Maybe.Just,
        None = Maybe.None;
    
    _.flatten(Just(Just(1)));       // Just 1
    _.flatten(Just(None);           // None
    _.flatten(None);                // None
    
    _.flatten([[1,2],[3,4],[5,6]]);        // [1,2,3,4,5,6]
    
    _.chain(n => [n, n * 2], [1,2,3]);     // [1,2,2,4,3,6]
    
    var composed = _.composeM(_.add(1), _.mul(2), _.sub(2));
    composed([3,4,5]);                     // [3,5,7]
    
    var piped = _.pipeM(_.add(1), _.mul(2), _.sub(2));
    piped([3,4,5]);                        // [6,8,10]

```

### Foldable

The foldable interface is for container types that can be folded into a value.

#### Minimum Implementation

1. `fold`: `Foldable f => (b -> a -> b) -> b -> f a -> b`
2. `foldl`: `Foldable f => (b -> a -> b) -> b -> f a -> b`
3. `foldr`: `Foldable f => (b -> a -> b) -> b -> f a -> b`

Most likely, fold will be equivalent to either foldl or foldr, whichever is more efficient for the type.

#### Derived Functions

1. `foldMap`: `(Foldable f, Monoid m) => (a -> m) -> f a -> m`
2. `foldMap2`: `(Foldable f, Monoid m) => (a -> m) -> m -> f a -> m`
3. `join`: `(Foldable f, Monoid m) => f m -> m`
4. `join2`: `(Foldable f, Monoid m) => m -> f m -> m`
5. `toArray`: `Foldable f => f a -> Array a`
6. `length`: `Foldable f => f a -> Integer`
7. `isEmpty`: `Foldable f => f a -> Boolean`
8. `isNotEmpty`: `Foldable f => f a -> Boolean`
9. `contains`: `(Foldable f, Eq a) => a -> f a -> Boolean`
10. `notContains`: `(Foldable f, Eq a) => a -> f a -> Boolean`
11. `any`: `Foldable f => (a -> Boolean) -> f a -> Boolean`
12. `all`: `Foldable f => (a -> Boolean) -> f a -> Boolean`
13. `fold1`: `Foldable f => (b -> a -> b) -> f a -> b`
14. `foldl1`: `Foldable f => (b -> a -> b) -> f a -> b`
15. `foldr1`: `Foldable f => (b -> a -> b) -> f a -> b`
16. `maximum`: `(Foldable f, Ord a) => f a -> a`
17. `minimum`: `(Foldable f, Ord a) => f a -> a`
18. `sum`: `(Foldable f, Numeric a) => f a -> a`
19. `prodouct`: `(Foldable f, Numeric a) => f a -> a`


