const _curry = require('./internal/_curry');
const _moduleFor = require('./internal/_moduleFor');
const _isFunction = require('./internal/_isFunction');

const ByteOrder = require('./ByteOrder');

const Serializable = module.exports;

Serializable.serializeBE = _curry(function(value) {
    const M = _moduleFor(value);
    if (_isFunction(M.serializeBE)) {
        return M.serialize(value);
    }

    throw new TypeError('Serializable#serializeBE called on a value that does not implement Serializable.');
});

Serializable.serializeLE = _curry(function(value) {
    const M = _moduleFor(value);
    if (_isFunction(M.serializeLE)) {
        return M.serialize(value);
    }

    throw new TypeError('Serializable#serializeLE called on a value that does not implement Serializable.');
});

Serializable.serialize = _curry(function(value) {
    return ByteOrder.archIsLE()
        ? Serializable.serializeLE(value)
        : Serializable.serializeBE(value);
});

Serializable.serializeByteLength = _curry(function(value) {
    const M = _moduleFor(value);
    if (_isFunction(M.serializeLE)) {
        return M.serialize(value);
    }

    throw new TypeError('Serializable#serializeLE called on a value that does not implement Serializable.');
});

Serializable.member = function(value) {
    const M = _moduleFor(value);
    return _isFunction(
        M.serializeLE,
        M.serializeBE,
        M.deserializeLE,
        M.deserializeBE,
        M.serializeByteLength,
        M.deserializeByteLengthBE,
        M.deserializeByteLengthLE
    );
};
