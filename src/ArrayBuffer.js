const _curry = require('./internal/_curry');
const _curryN = require('./internal/_curryN');
const _Uint8Array = require('./internal/_primitives').Uint8Array;
const _Integer = require('./internal/_primitives').Integer;
const Sequential = require('./Sequential');

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

_ArrayBuffer.map = _curry(function(fn, buffer) {
    return _Uint8Array.map(fn, new Uint8Array(buffer)).buffer;
});

_ArrayBuffer.concat = _curry(function(left, right) {
    return _Uint8Array.concat(new Uint8Array(left), new Uint8Array(right)).buffer;
});

_ArrayBuffer.empty = _curry(function() {
    return new ArrayBuffer(0);
});

_ArrayBuffer.foldl = _curry(function(fn, init, buffer) {
    return _Uint8Array.foldl(fn, init, new Uint8Array(buffer));
});

_ArrayBuffer.foldr = _curry(function(fn, init, buffer) {
    return _Uint8Array.foldr(fn, init, new Uint8Array(buffer));
});

_ArrayBuffer.nth = _curry(function(index, buffer) {
    if (index < 0 || index >= buffer.byteLength) {
        throw new RangeError('Index out of bounds');
    }

    return (new Uint8Array(buffer))[index];
});

_ArrayBuffer.of = _curryN(1, function(...bytes) {
    return Uint8Array.from(bytes).buffer;
});

_ArrayBuffer.serializeBE = _curry(function(buffer) {
    const sizeSerialized = _Integer.serializeBE(buffer.byteLength);
    return _Uint8Array.concat(sizeSerialized, new Uint8Array(buffer));
});

_ArrayBuffer.serializeLE = _curry(function(buffer) {
    const sizeSerialized = _Integer.serializeLE(buffer.byteLength);
    return _Uint8Array.concat(sizeSerialized, new Uint8Array(buffer));
});

_ArrayBuffer.deserializeBE = _curry(function(source) {
    const size = _Integer.deserializeBE(source);
    return Sequential.slice(4, size + 4, source).buffer;
});

_ArrayBuffer.deserializeLE = _curry(function(source) {
    const size = _Integer.deserializeLE(source);
    return Sequential.slice(4, size + 4, source).buffer;
});

_ArrayBuffer.serializeByteLength = _curry(function(source) {
    return 4 + source.byteLength;
});

_ArrayBuffer.deserializeByteLengthBE = _curry(function(source) {
    const size = _Integer.deserializeBE(source);
    return 4 + size;
});

_ArrayBuffer.deserializeByteLengthLE = _curry(function(source) {
    const size = _Integer.deserializeLE(source);
    return 4 + size;
});

const HASH_BASE = 0x811c9dc5;
_ArrayBuffer.hashWithSeed = _curry(function(seed, buffer) {
    // FNV1-A hash, based on schwarzkopfb's implementation: https://github.com/schwarzkopfb/fnv1a

    let hash = seed;
    const view = new Uint8Array(buffer);

    for (let i = 0, l = view.length; i < l; i += 1) {
        hash ^= view[i];
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }

    return hash >>> 0;
});

_ArrayBuffer.hash = _ArrayBuffer.hashWithSeed(HASH_BASE);

_ArrayBuffer.show = _curry(function(buffer) {
    let vs = _ArrayBuffer.foldl((arr, byte) => arr.concat([`0x0${byte.toString(16).toUpperCase()}`]), [], buffer);
    return `ArrayBuffer(${vs.join(',')})`;
});

module.exports = _ArrayBuffer;
