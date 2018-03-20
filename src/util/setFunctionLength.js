function setFunctionLength(length, fn) {
    const descriptor = Object.getOwnPropertyDescriptor(fn, 'length');
    descriptor.value = length;
    Object.defineProperty(fn, 'length', descriptor);

    return fn;
}

module.exports = setFunctionLength;
