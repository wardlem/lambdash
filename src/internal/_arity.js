function intRange(from, count) {
    var range = [];
    while (count > 0) {
        range.push(from);
        from += 1;
        count -= 1;
    }

    return range;
}

module.exports = function _arity(n, fn) {
    switch (n) {
        case 0:
            return function _f0() {
                return fn.apply(this, arguments);
            };
        case 1:
            return function _f1(_0) {
                return fn.apply(this, arguments);
            };
        case 2:
            return function _f2(_0, _1) {
                return fn.apply(this, arguments);
            };
        case 3:
            return function _f3(_0, _1, _2) {
                return fn.apply(this, arguments);
            };
        case 4:
            return function _f4(_0, _1, _2, _3) {
                return fn.apply(this, arguments);
            };
        case 5:
            return function _f5(_0, _1, _2, _3, _4) {
                return fn.apply(this, arguments);
            };
        case 6:
            return function _f6(_0, _1, _2, _3, _4, _5) {
                return fn.apply(this, arguments);
            };
        case 7:
            return function _f7(_0, _1, _2, _3, _4, _5, _6) {
                return fn.apply(this, arguments);
            };
        case 8:
            return function _f8(_0, _1, _2, _3, _4, _5, _6, _7) {
                return fn.apply(this, arguments);
            };
        case 9:
            return function _f9(_0, _1, _2, _3, _4, _5, _6, _7, _8) {
                return fn.apply(this, arguments);
            };
        case 10:
            return function _f10(_0, _1, _2, _3, _4, _5, _6, _7, _8, _9) {
                return fn.apply(this, arguments);
            };
        default:
            if (n < 0) {
                throw new RangeError('N cannot be less than 0');
            }
            var argNames = intRange(0, n).map(function(i) {return '_' + i;}).join(',');
            var fnName = '_f' + n;
            var fnStr = 'function ' + fnName + '(' + argNames + '){return fn.apply(this,arguments);}';
            var wrapped = '(function(){return ' + fnStr + '})()';
            /* eslint no-eval: 0 */
            return eval(wrapped);
    }
};
