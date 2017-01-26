const _curry = require('./internal/_curry');
const _Uint8Array = require('./internal/_primitives').Uint8Array;

/**
 * _ArrayBuffer is the module for javascript's built-in ArrayBuffer type.
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
const _ArrayBuffer = require('./internal/_primitives').ArrayBuffer;


_ArrayBuffer.eq = _curry(function(left, right) {
    return _Uint8Array.eq(new Uint8Array(left), new Uint8Array(right));
});

_ArrayBuffer.compare = _curry(function(left, right) {
    return _Uint8Array.compare(new Uint8Array(left), new Uint8Array(right));
});

_ArrayBuffer.fmap = _curry(function(fn, buffer) {
    return _Uint8Array.fmap(fn, new Uint8Array(buffer)).buffer;
});

_ArrayBuffer.concat = _curry(function(left, right) {
    return _Uint8Array.concat(new Uint8Array(left), new Uint8Array(right)).buffer;
});

_ArrayBuffer.empty = _curry(function(){
    return new ArrayBuffer(0);
});

_ArrayBuffer.foldl = _curry(function(fn, init, buffer){
    return _Uint8Array.foldl(fn, init, new Uint8Array(buffer));
});

_ArrayBuffer.foldr = _curry(function(fn, init, buffer){
    return _Uint8Array.foldr(fn, init, new Uint8Array(buffer));
});

_ArrayBuffer.nth = _curry(function(index, buffer) {
    if (index < 0 || index >= buffer.byteLength) {
        throw new RangeError('Index out of bounds');
    }

    return (new Uint8Array(buffer))[index];
});

_ArrayBuffer.of = function(...bytes) {
    return Uint8Array.from(bytes).buffer;
};

_ArrayBuffer.show = _curry(function(buffer) {
    let vs = _ArrayBuffer.foldl((arr, byte) => arr.concat([`0x0${byte.toString(16).toUpperCase()}`]), [], buffer);
    return `ArrayBuffer(${vs.join(',')})`;
});

module.exports = _ArrayBuffer;
