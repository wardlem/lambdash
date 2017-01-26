const _curry = require('./internal/_curry');
const _arrEqual = require('./internal/_arrayEqual');

const Ord = require('./Ord');
const Ordering = require('./Ordering');

/**
 * _TypedArray is the module for javascript's built-in TypedArray types.
 *
 * @module
 * @implements Eq
 * @implements Ord
 * @implements Functor
 * @implements Foldable
 * @implements Semigroup
 * @implements Monoid
 * @implements Sequential
 * @implements Show
 */
const _TypedArray = require('./internal/_primitives').TypedArray;

_TypedArray.eq = _curry(_arrEqual);

_TypedArray.compare = _curry(function(left, right) {
    // todo: this code is identical to that in Array...refactor
    if (left === right) {
        // short-circuit
        return Ordering.EQ;
    }

    const len = Math.min(left.length, right.length);
    for (let ind = 0; ind < len; ind++) {
        const ordering = Ord.compare(left[ind], right[ind]);
        if (!Ordering.isEQ(ordering)) {
            return ordering;
        }
    }

    return Ordering.fromNum(left.length - right.length);
});

_TypedArray.fmap = _curry(function(fn, array) {
    const result = new array.constructor(array.length);
    for (let i = 0; i < result.length; i++) {
        result[i] = fn(array[i]);
    }
    return result;
});

_TypedArray.concat = _curry(function(left, right) {
    const result = new left.constructor(left.length + right.length);

    for (let i = 0; i < left.length; i++){
        result[i] = left[i];
    }

    for (let i = 0; i < right.length; i++) {
        result[i + left.length] = right[i];
    }
    return result;
});

_TypedArray.foldl = _curry(function(fn, init, array){
    return array.reduce(fn, init);
});

_TypedArray.foldr = _curry(function(fn, init, array){
    return array.reduceRight(fn, init);
});

_TypedArray.nth = _curry(function(index, array) {
    if (index < 0 || index >= array.length) {
        throw new RangeError('Index out of bounds');
    }

    return array[index];
});

_TypedArray.show = _curry(function(array) {
    let vs = _TypedArray.foldl((arr, value) => arr.concat([`0x0${value.toString(16).toUpperCase()}`]), [], array);
    return `${array.constructor.name}(${vs.join(',')})`;
});

const TypedArrayTypes = [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
].map((C) => {
    const M = require('./internal/_primitives')[C.name];
    for (key in _TypedArray) {
        if (!M[key]) {
            M[key] = _TypedArray[key];
        }
    }
    
    M.of = function(...values) {
        return C.from(values);
    };

    M.empty = function() {
        return new M(0);
    };

    return M;
});

TypedArrayTypes.forEach(function(M){
    _TypedArray[M.name] = M;
});

module.exports = _TypedArray;
