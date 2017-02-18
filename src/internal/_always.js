module.exports = function always(value) {
    return function always() {
        return value;
    };
};
