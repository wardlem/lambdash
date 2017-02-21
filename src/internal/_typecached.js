const typeIds = new Map();

const getTypeId = (T) => {
    if (!typeIds.has(T)) {
        typeIds.set(T, (Math.random() * Math.pow(10, 16)).toString(16));
    }

    return typeIds.get(T);
};

module.exports = function _typecached(fn) {
    const cache = new Map();
    return function _cached(...args) {
        const id = args.map(getTypeId).join('_');
        if (!cache.has(id)) {
            cache.set(id, fn(...args));
        }

        return cache.get(id);
    };
};
