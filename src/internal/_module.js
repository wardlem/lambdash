module.exports = function module(mod) {
    Object.defineProperty(mod, '@@functional/module', {
        value: true,
        configurable: false,
        writable: false,
        enumerable: false,
    });
};
