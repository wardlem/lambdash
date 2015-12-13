var _moduleFor = require('./internal/_moduleFor');
var _isFunction = require('./internal/_isFunction');
var _curry = require('./internal/_curry');
var _equal = require('./internal/_equal');
var _not = require('./internal/_not');

var Foldable = require('./Foldable');
var Monoid = require('./Monoid');

var Sequential = module.exports;

Sequential.length = _curry(function(sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.length)) {
        return M.length(sequence);
    }

    return Foldable.length(sequence);
});

Sequential.nth = _curry(function(ind, sequence) {
    if (ind < 0) {
        ind = Sequential.length(sequence) + ind;
    }
    var M = _moduleFor(sequence);
    return M.nth(ind, sequence);
});

Sequential.slice = _curry(function(start, end, sequence){
    var M = _moduleFor(sequence);
    if (_isFunction(M.slice)) {
        return M.slice(start, end, sequence);
    }

    var res = M.empty();
    start = Math.max(0, start);
    end = Math.min(end, Sequential.length(sequence));


    while (start < end) {
        res = Sequential.append(M.nth(start, sequence));
        start += 1;
    }

    return res;
});

Sequential.take = _curry(function(n, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.take)) {
        return M.take(n, sequence);
    }

    return Sequential.slice(0, n, sequence);
});

Sequential.drop = _curry(function(n, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.take)) {
        return M.take(n, sequence);
    }

    return Sequential.slice(n, Sequential.length(sequence), sequence);
});

Sequential.takeLast = _curry(function(n, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.takeLast)) {
        return M.takeLast(n, sequence);
    }
    return Sequential.drop(Sequential.length(sequence) - n, sequence);
});

Sequential.dropLast = _curry(function(n, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.dropLast)) {
        return M.dropLast(n, sequence);
    }
    return Sequential.take(Sequential.length(sequence) - n, sequence);
});

Sequential.head = Sequential.nth(0);
Sequential.last = Sequential.nth(-1);

Sequential.tail = Sequential.drop(1);
Sequential.init = Sequential.dropLast(1);

Sequential.append = _curry(function(value, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.append)) {
        return M.append(value, sequence);
    }

    return Monoid.concat(sequence, M.of(value));
});

Sequential.prepend = _curry(function(value, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.prepend)) {
        return M.prepend(value, sequence);
    }

    return M.concat(M.of(value), sequence);
});

Sequential.intersperse = _curry(function(value, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.intersperse)) {
        return M.intersperse(value, sequence);
    }

    var l = Sequential.length(sequence);

    if (l < 2) {
        return sequence;
    }

    function _intersperse(len, sequence) {
        if (len === 0) {
            return M.empty();
        }
        var head = Sequential.head(sequence);
        var tail = _intersperse(len - 1, Sequential.tail(sequence));
        return Sequential.prepend(value, Sequential.prepend(head, tail));
    }

    var head = Sequential.head(sequence);
    var tail = _intersperse(l - 1, Sequential.tail(sequence));
    return Sequential.prepend(head, tail);
});

Sequential.reverse = _curry(function(sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.reverse)) {
        return M.reverse(sequence);
    }

    function _reverse(l, sequence) {
        if (l === 0) {
            return sequence;
        }

        var head = Sequential.head(sequence);
        var tail = Sequential.tail(sequence);

        return Sequential.append(_reverse(l-1, tail), head);
    }

    return _reverse(Sequential.length(sequence), sequence);
});

Sequential.splitAt = _curry(function(n, sequence) {
    return [Sequential.take(n, sequence), Sequential.drop(n, sequence)];
});

Sequential.takeWhile = _curry(function(fn, sequence) {
    var idx = 0;
    var l = Sequential.length(sequence);
    while (idx < l && fn(sequence[idx])) {
        idx += 1;
    }

    return Sequential.take(idx, sequence);
});

Sequential.dropWhile = _curry(function(fn, sequence) {
    var idx = 0;
    var l = Sequential.length(sequence);
    while (idx < l && fn(sequence[idx])) {
        idx += 1;
    }

    return Sequential.drop(idx, sequence);
});

Sequential.takeLastWhile = _curry(function(fn, sequence) {
    var idx = Sequential.length(sequence) - 1;
    while(idx >= 0 && fn(sequence[idx])) {
        idx -= 1;
    }

    return Sequential.drop(idx);
});

Sequential.dropLastWhile = _curry(function(fn, sequence) {
    var idx = Sequential.length(sequence) - 1;
    while(idx >= 0 && fn(sequence[idx])) {
        idx -= 1;
    }

    return Sequential.take(idx);
});

Sequential.filter = _curry(function(fn, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.filter)) {
        return M.filter(fn, sequence);
    }

    var res = M.empty();
    var idx = 0;
    var len = Sequential.length(sequence);

    while (idx < len) {
        var v = M.nth(idx, sequence);
        if (fn(v)) {
            res = Sequential.append(v, res);
        }
        idx += 1;
    }

    return res;
});

Sequential.uniqueBy = _curry(function(fn, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.uniqueBy)) {
        return M.uniqueBy(fn, sequence);
    }

    if (Sequential.length(sequence) === 0) {
        return M.empty();
    }

    var head = Sequential.head(sequence);
    var pred = _compose(_not(_equal(fn(head))), fn);
    var rest = Sequential.filter(pred, sequence);
    return Sequential.prepend(head, Sequential.uniqueBy(fn, rest));

});

Sequential.unique = Sequential.uniqueBy(_equal);

Sequential.findIndex = _curry(function(fn, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.find)) {
        return M.find(fn, sequence);
    }

    var len = Sequential.length(sequence);
    var idx = 0;
    while (idx < len) {
        var v = M.nth(idx, sequence);
        if (fn(v)) {
            return idx;
        }
        idx += 1;
    }

    return -1;
});


Sequential.findLastIndex = _curry(function(fn, sequence) {
    var M = _moduleFor(sequence);
    if (_isFunction(M.find)) {
        return M.find(fn, sequence);
    }

    var idx = Sequential.length(sequence) - 1;
    while (idx >= 0) {
        var v = M.nth(idx, sequence);
        if (fn(v)) {
            return idx;
        }
        idx -= 1;
    }

    return -1;
});

Sequential.find = _curry(function(fn, sequence) {
    var idx = Sequential.findIndex(fn, sequence);
    if (idx === -1) {
        throw new RangeError('The item could not be found');
    }
    return Sequential.nth(idx);
});

Sequential.findLast = _curry(function(fn, sequence) {
    var idx = Sequential.findLastIndex(fn, sequence);
    if (idx === -1) {
        throw new RangeError('The item could not be found');
    }
    return Sequential.nth(idx);
});

Sequential.indexOf = _curry(function(v, sequence) {
    return Sequential.findIndex(_equal(v), sequence);
});

Sequential.lastIndexOf = _curry(function(v, sequence) {
    return Sequential.findLastIndex(_equal(v), sequence);
});

Sequential.member = function(value) {
    if (value == null) {
        return false;
    }

    var M = _moduleFor(value);
    return Foldable.member(value) && Monoid.member(value) && _isFunction(M.nth) && _isFunction(M.of);
};

