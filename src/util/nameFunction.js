function nameFunction(name, fn) {
    const descriptor = Object.getOwnPropertyDescriptor(fn, 'name');
    descriptor.value = name;
    Object.defineProperty(fn, 'name', descriptor);

    return fn;
}

module.exports = nameFunction;
