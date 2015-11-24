module.exports = function(parent, child) {
    Object.defineProperty(child, '@@functional/parentModule', {
        configurable: false,
        writable: false,
        enumerable: false,
        value: parent
    });
};