module.exports = function(fn) {
    return fn != null && fn['@@functional/module'] === true;
};
