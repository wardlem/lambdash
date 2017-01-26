module.exports = function _isTypedArray(value) {
    return ArrayBuffer.isView(value);
};

[
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
].forEach((c) => {
    module.exports[`is${c.name}`] = function(value) {
        return value instanceof c;
    }
})
