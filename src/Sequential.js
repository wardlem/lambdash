const _isFunction = require('./internal/_isFunction');
const _curry = require('./internal/_curry');
const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const typeclass = require('./typeclass');
const _equal = require('./internal/_equal');
const _not = require('./internal/_not');
const _compose = require('./internal/_compose');
const _identity = require('./internal/_identity');

const Foldable = require('./Foldable');
const Monoid = require('./Monoid');

const Sequential = {name: 'Sequential'};

const sequentialForModule = _typecached((M) => {
    if (!Sequential.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Sequential`);
    }

    const _Sequential = {};

    _Sequential.nth = M.nth;
    _Sequential.of = M.of;

    _Sequential.len = _isFunction(M.len)
        ? M.len
        : Foldable.len
    ;

    _Sequential.append = _isFunction(M.append)
        ? M.append
        : _curry((value, sequence) => M.concat(sequence, M.of(value)))
    ;

    _Sequential.prepend = _isFunction(M.prepend)
        ? M.prepend
        : _curry((value, sequence) => M.concat(M.of(value), sequence))
    ;

    _Sequential.slice = _isFunction(M.slice)
        ? M.slice
        : _curry((start, end, sequence) => {
            let res = M.empty();
            start = Math.max(0, start);
            end = Math.min(end, Sequential.len(sequence));


            while (start < end) {
                res = Sequential.append(M.nth(start, sequence), res);
                start += 1;
            }

            return res;
        })
    ;

    _Sequential.take = _isFunction(M.take) ? M.take : _Sequential.slice(0);

    _Sequential.drop = _isFunction(M.drop)
        ? M.drop
        : _curry((n, sequence) => _Sequential.slice(n, _Sequential.len(sequence), sequence))
    ;

    _Sequential.takeLast = _isFunction(M.takeLast)
        ? M.takeLast
        : _curry((n, sequence) => _Sequential.drop(_Sequential.len(sequence) - n, sequence))
    ;

    _Sequential.dropLast = _isFunction(M.dropLast)
        ? M.dropLast
        : _curry((n, sequence) => _Sequential.take(_Sequential.len(sequence) - n, sequence))
    ;

    _Sequential.head = _isFunction(M.head) ? M.head : _Sequential.nth(0);
    _Sequential.last = _isFunction(M.last)
        ? M.last
        : _curry(sequence => _Sequential.nth(_Sequential.len(sequence) - 1, sequence));
    _Sequential.tail = _isFunction(M.tail) ? M.tail : _Sequential.drop(1);
    _Sequential.init = _isFunction(M.init) ? M.init : _Sequential.dropLast(1);

    _Sequential.intersperse = _isFunction(M.intersperse)
        ? M.intersperse
        : _curry((value, sequence) => {
            const l = Sequential.len(sequence);

            if (l < 2) {
                return sequence;
            }

            function _intersperse(len, sequence) {
                if (len === 0) {
                    return M.empty();
                }
                const head = _Sequential.head(sequence);
                const tail = _intersperse(len - 1, _Sequential.tail(sequence));
                return _Sequential.prepend(value, _Sequential.prepend(head, tail));
            }

            const head = _Sequential.head(sequence);
            const tail = _intersperse(l - 1, _Sequential.tail(sequence));
            return _Sequential.prepend(head, tail);
        })
    ;

    _Sequential.reverse = _isFunction(M.reverse)
        ? M.reverse
        : _curry((sequence) => {
            function _reverse(l, sequence) {
                if (l === 0) {
                    return sequence;
                }

                const head = _Sequential.head(sequence);
                const tail = _Sequential.tail(sequence);

                return _Sequential.append(head, _reverse(l - 1, tail));
            }

            return _reverse(_Sequential.len(sequence), sequence);
        })
    ;

    _Sequential.splitAt = _isFunction(M.splitAt)
        ? M.splitAt
        : _curry((n, sequence) => [_Sequential.take(n, sequence), _Sequential.drop(n, sequence)])
    ;

    _Sequential.takeWhile = _isFunction(M.takeWhile)
        ? M.takeWhile
        : _curry((fn, sequence) => {
            let idx = 0;
            const l = _Sequential.len(sequence);
            while (idx < l && fn(_Sequential.nth(idx, sequence))) {
                idx += 1;
            }

            return _Sequential.take(idx, sequence);
        })
    ;

    _Sequential.dropWhile = _isFunction(M.dropWhile)
        ? M.dropWhile
        : _curry((fn, sequence) => {
            let idx = 0;
            const l = _Sequential.len(sequence);
            while (idx < l && fn(_Sequential.nth(idx, sequence))) {
                idx += 1;
            }

            return _Sequential.drop(idx, sequence);
        })
    ;

    _Sequential.takeLastWhile = _isFunction(M.takeLastWhile)
        ? M.takeLastWhile
        : _curry((fn, sequence) => {
            let idx = _Sequential.len(sequence) - 1;
            while (idx >= 0 && fn(_Sequential.nth(idx, sequence))) {
                idx -= 1;
            }

            return _Sequential.drop(idx + 1, sequence);
        })
    ;

    _Sequential.dropLastWhile = _isFunction(M.dropLastWhile)
        ? M.dropLastWhile
        : _curry((fn, sequence) => {
            let idx = _Sequential.len(sequence) - 1;
            while (idx >= 0 && fn(_Sequential.nth(idx, sequence))) {
                idx -= 1;
            }

            return _Sequential.take(idx + 1, sequence);
        })
    ;

    _Sequential.filter = _isFunction(M.filter)
        ? M.filter
        : _curry((fn, sequence) => {
            let res = M.empty();
            let idx = 0;
            const len = _Sequential.len(sequence);

            while (idx < len) {
                const v = M.nth(idx, sequence);
                if (fn(v)) {
                    res = _Sequential.append(v, res);
                }
                idx += 1;
            }

            return res;
        })
    ;

    _Sequential.uniqueBy = _isFunction(M.uniqueBy)
        ? M.uniqueBy
        : _curry((fn, sequence) => {
            if (_Sequential.len(sequence) === 0) {
                return M.empty();
            }

            const head = _Sequential.head(sequence);
            const pred = _compose(_not(_equal(fn(head))), fn);
            const rest = _Sequential.filter(pred, sequence);
            return _Sequential.prepend(head, _Sequential.uniqueBy(fn, rest));
        })
    ;

    _Sequential.unique = _isFunction(M.unique)
        ? M.unique
        : _Sequential.uniqueBy(_identity)
    ;

    _Sequential.findIndex = _isFunction(M.findIndex)
        ? M.findIndex
        : _curry((fn, sequence) => {
            const len = _Sequential.len(sequence);
            let idx = 0;
            while (idx < len) {
                const v = M.nth(idx, sequence);
                if (fn(v)) {
                    return idx;
                }
                idx += 1;
            }

            return -1;
        })
    ;

    _Sequential.findLastIndex = _isFunction(M.findLastIndex)
        ? M.findLastIndex
        : _curry((fn, sequence) => {
            let idx = _Sequential.len(sequence) - 1;
            while (idx >= 0) {
                const v = M.nth(idx, sequence);
                if (fn(v)) {
                    return idx;
                }
                idx -= 1;
            }

            return -1;
        })
    ;

    _Sequential.find = _isFunction(M.find)
        ? M.find
        : _curry((fn, sequence) => {
            const idx = _Sequential.findIndex(fn, sequence);
            if (idx === -1) {
                throw new RangeError('The item could not be found');
            }
            return _Sequential.nth(idx, sequence);
        })
    ;

    _Sequential.findLast = _isFunction(M.findLast)
        ? M.findLast
        : _curry((fn, sequence) => {
            const idx = _Sequential.findLastIndex(fn, sequence);
            if (idx === -1) {
                throw new RangeError('The item could not be found');
            }
            return _Sequential.nth(idx, sequence);
        })
    ;

    _Sequential.indexOf = _isFunction(M.indexOf)
        ? M.indexOf
        : _curry((v, sequence) => _Sequential.findIndex(_equal(v), sequence))
    ;

    _Sequential.lastIndexOf = _isFunction(M.lastIndexOf)
        ? M.lastIndexOf
        : _curry((v, sequence) => _Sequential.findLastIndex(_equal(v), sequence))
    ;

    return _Sequential;
});

const sequentialForModulePrototype = _typecached((M) => {
    const methods = sequentialForModule(M);

    const res = {};
    Object.keys(methods).forEach((method) => {
        res[method] = _thisify(methods[method]);
    });

    return res;
});

/**
 * Returns the length of a sequence
 *
 * This function should be implemented, though a default using the Foldable's length function exists.
 *
 * @sig Sequential s => s -> Number
 * @since 0.5.0
 * @param {Sequential} sequence the structure whose elements are being counted
 * @return {Number}
 */
Sequential.len = _curryN(1, typeclass.forward('len', sequentialForModule));

/**
 * Returns the element at the given index.
 *
 * If the index is negative, it returns the value at the length minus the given index.
 *
 * The index should be an integer.
 *
 * @sig Sequential s => Number -> s a -> a
 * @since 0.5.0
 * @param {Number} ind
 * @param {Sequential} sequence
 * @return {*}
 */
Sequential.nth = _curryN(2, typeclass.forward('nth', sequentialForModule));

/**
 * Creates a new sequence with a value added at the end.
 *
 * The default behavior may be overwritten by the implementation.
 *
 * @sig Sequential s => a -> s a -> s a
 * @since 0.5.0
 * @param {*} value the element that will be added at the end of the sequence
 * @param {Sequential} sequence
 * @return {Sequential} a new sequence equal to the given sequence with the value added at the end
 */
Sequential.append = _curryN(2, typeclass.forward('append', sequentialForModule));

/**
 * Creates a new sequence with a value added at the beginning.
 *
 * The default behavior may be overwritten by the implementation.
 *
 * @sig Sequential s => a -> s a -> s a
 * @since 0.5.0
 * @param {*} value the element that will be added at the beginning of the sequence
 * @param {Sequential} sequence
 * @return {Sequential} a new sequence equal to the given sequence with the value added at the beginning
 */
Sequential.prepend = _curryN(2, typeclass.forward('prepend', sequentialForModule));

/**
 * Returns a subsequence of a sequence.
 *
 * The default behavior may be overwritten by an implementation specific to the type.
 *
 * Start and end should be integers.
 *
 * @sig Sequential s => Number -> Number -> s a -> s a
 * @since 0.5.0
 * @param {Number} start the index where the subsequence will start
 * @param {Number} end the index where the subsequence will end (non-inclusive)
 * @param {Sequential} sequence the structure the subsequence will be extracted from
 * @return {Sequential} A subsequence of the sequence
 */
Sequential.slice = _curryN(3, typeclass.forward('slice', sequentialForModule));

/**
 * Takes the first n values from a sequence.
 *
 * If there are fewer than n values in the sequence, a copy of the sequence will be returned.
 *
 * This function is the same as Sequential.slice with 0 as the first parameter
 *
 * @sig Sequential s => Number -> s a -> s a
 * @since 0.5.0
 * @param {Number} n the number of items to take
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.take = _curryN(2, typeclass.forward('take', sequentialForModule));

/**
 * Removes the first n values from a sequence.
 *
 * If there are fewer than n values in the sequence, an empty sequence will be returned.
 *
 * This function is the same as Sequential.slice with n as the first parameter and
 * the length of the sequence as the second parameter.
 *
 * @sig Sequential s => Number -> s a -> s a
 * @since 0.5.0
 * @param {Number} n the number of items to remove
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.drop = _curryN(2, typeclass.forward('drop', sequentialForModule));
/**
 * Takes the last n values from a sequence.
 *
 * If there are fewer than n values in the sequence, a copy of the sequence will be returned.
 *
 * @sig Sequential s => Number -> s a -> s a
 * @since 0.5.0
 * @param {Number} n the number of items to keep
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.takeLast = _curryN(2, typeclass.forward('takeLast', sequentialForModule));
/**
 * Removes the last n values from a sequence.
 *
 * If there are fewer than n values in the sequence, an empty sequence will be returned.
 *
 * @sig Sequential s => Number -> s a -> s a
 * @since 0.5.0
 * @param {Number} n the number of items to remove
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.dropLast = _curryN(2, typeclass.forward('dropLast', sequentialForModule));

/**
 * Returns the first item in a non-empty sequence
 *
 * @sig Sequential s => s a -> a
 * @since 0.5.0
 * @param {Sequential} sequence
 * @return {*}
 */
Sequential.head = _curryN(1, typeclass.forward('head', sequentialForModule));

/**
 * Returns the final item in a non-empty sequence
 *
 * @sig Sequential s => s a -> a
 * @since 0.5.0
 * @param {Sequential} sequence
 * @return {*}
 */
Sequential.last = _curryN(1, typeclass.forward('last', sequentialForModule));

/**
 * Returns a sequence without its first element
 *
 * @sig Sequential s => s a -> s a
 * @since 0.5.0
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.tail = _curryN(1, typeclass.forward('tail', sequentialForModule));

/**
 * Returns a sequence without its final element
 *
 * @sig Sequential s => s a -> s a
 * @since 0.5.0
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.init = _curryN(1, typeclass.forward('init', sequentialForModule));

/**
 * Returns a sequence with a value added between all of an existing sequences values.
 *
 * @sig Sequential s => a -> s a -> s a
 * @since 0.5.0
 * @param {*} value the element that will be added to the sequence
 * @param {Sequential} sequence
 * @return {Sequential}
 * @example
 *
 *      const sequence = "tks";
 *      _.intersperse('i', sequence);  // "tikis"
 *
 */
Sequential.intersperse = _curryN(2, typeclass.forward('intersperse', sequentialForModule));

/**
 * Creates a sequence from another with the order reversed
 *
 * @sig Sequential s => s a -> s a
 * @since 0.5.0
 * @param {Sequential} sequence the structure being reversed
 * @return {Sequential}
 */
Sequential.reverse = _curryN(1, typeclass.forward('reverse', sequentialForModule));

/**
 * Splits a sequence into two.
 *
 * The result is returned as an array where the first element is the sequence
 * starting at index 0 and containing n items, and the second element is the sequence
 * beginning at index n.
 *
 * @sig Sequential s => Number -> s a -> Array (s a)
 * @since 0.5.0
 * @param {Number} n an integer index where the sequence will be split
 * @param {Sequential} sequence the structure being split
 * @return {Array}
 */
Sequential.splitAt = _curryN(2, typeclass.forward('splitAt', sequentialForModule));

/**
 * Takes elements from the start of a sequence as long as a predicate returns true.
 *
 * @sig Sequential s => (a -> Boolean) -> s a -> s a
 * @since 0.5.0
 * @param {Function} fn
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.takeWhile = _curryN(2, typeclass.forward('takeWhile', sequentialForModule));

/**
 * Drops elements from the start of a sequence as long as a predicate returns true.
 *
 * @sig Sequential s => (a -> Boolean) -> s a -> s a
 * @since 0.5.0
 * @param {Function} fn
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.dropWhile = _curryN(2, typeclass.forward('dropWhile', sequentialForModule));

/**
 * Takes elements from the end of a sequence as long as a predicate returns true.
 *
 * @sig Sequential s => (a -> Boolean) -> s a -> s a
 * @since 0.5.0
 * @param {Function} fn
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.takeLastWhile = _curryN(2, typeclass.forward('takeLastWhile', sequentialForModule));

/**
 * Drops elements from the end of a sequence as long as a predicate returns true.
 *
 * @sig Sequential s => (a -> Boolean) -> s a -> s a
 * @since 0.5.0
 * @param {Function} fn
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.dropLastWhile = _curryN(2, typeclass.forward('dropLastWhile', sequentialForModule));

/**
 * Creates a sequence from another with only the items a predicate returns true for.
 *
 * @sig Sequential s => (a -> Boolean) -> s a -> s a
 * @since 0.5.0
 * @param {Function} fn
 * @param {Sequential} sequence
 * @return {Sequential}
 */
Sequential.filter = _curryN(2, typeclass.forward('filter', sequentialForModule));

/**
 * Returns a sequence with all duplicate elements removed according to a predicate function.
 *
 * @since 0.5.0
 * @sig Sequential s => (a -> b) -> s a -> s a
 * @param {Function} fn a predicate function that determines uniqueness
 * @param {Sequential} sequence
 * @return {Sequential} The sequence with all duplicate elements removed according to the predicate
 */
Sequential.uniqueBy = _curryN(2, typeclass.forward('uniqueBy', sequentialForModule));

/**
 * Returns a sequence with all duplicate elements removed.
 *
 * @since 0.5.0
 * @sig Sequential s => s a -> s a
 * @param {Sequential} sequence
 * @return {Sequential} The sequence with all duplicate elements removed
 */
Sequential.unique = _curryN(1, typeclass.forward('unique', sequentialForModule));

/**
 * Returns the first index within a sequence for which a predicate returns true.
 *
 * Returns -1 if the element is not found.
 *
 * @since 0.5.0
 * @sig Sequential s => (a -> Boolean) -> s a -> Number
 * @param {Function} fn the predicate
 * @param {Sequential} sequence
 * @return {Number}
 */
Sequential.findIndex = _curryN(2, typeclass.forward('findIndex', sequentialForModule));

/**
 * Returns the last index within a sequence for which a predicate returns true.
 *
 * Returns -1 if the element is not found.
 *
 * @since 0.5.0
 * @sig Sequential s => (a -> Boolean) -> s a -> Number
 * @param {Function} fn the predicate
 * @param {Sequential} sequence
 * @return {Number}
 */
Sequential.findLastIndex = _curryN(2, typeclass.forward('findLastIndex', sequentialForModule));

/**
 * Returns the first element within a sequence for which a predicate returns true.
 *
 * @since 0.5.0
 * @sig Sequential s => (a -> Boolean) -> s a -> a
 * @param {Function} fn the predicate
 * @param {Sequential} sequence
 * @return {*}
 */
Sequential.find = _curryN(2, typeclass.forward('find', sequentialForModule));

/**
 * Returns that last element within a sequence for which a predicate returns true.
 *
 * @since 0.5.0
 * @sig Sequential s => (a -> Boolean) -> s a -> a
 * @param {Function} fn the predicate
 * @param {Sequential} sequence
 * @return {*}
 */
Sequential.findLast = _curryN(2, typeclass.forward('findLast', sequentialForModule));

/**
 * Returns the first index of an element in a sequence.
 *
 * Returns -1 if the element does not appear in the sequence.
 *
 * @since 0.5.0
 * @sig Sequential s => a -> s a -> Number
 * @param {*} v the value being searched for
 * @param {Sequential} sequence the structure being searched
 * @return {Number}
 */
Sequential.indexOf = _curryN(2, typeclass.forward('indexOf', sequentialForModule));

/**
 * Returns the last index of an element in a sequence.
 *
 * Returns -1 if the element does not appear in the sequence.
 *
 * @since 0.5.0
 * @sig Sequential s => a -> s a -> Number
 * @param {*} v the value being searched for
 * @param {Sequential} sequence the structure being searched
 * @return {Number}
 */
Sequential.lastIndexOf = _curryN(2, typeclass.forward('lastIndexOf', sequentialForModule));

module.exports = typeclass(Sequential, {
    deriveFn: sequentialForModule,
    deriveProtoFn: sequentialForModulePrototype,
    required: ['nth', 'of'],
    superTypes: [Foldable, Monoid],
});
