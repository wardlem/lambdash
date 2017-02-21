const _curryN = require('./internal/_curryN');
const _isFunction = require('./internal/_isFunction');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');

const typeclass = require('./typeclass');


const Semigroup = require('./Semigroup');
const Associative = require('./Associative');

const AssocFoldable = {name: 'AssocFoldable'};

const assocFoldableForModule = _typecached((M) => {
    if (!AssocFoldable.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement AssocFoldable`);
    }
    const _AssocFoldable = {};

    _AssocFoldable.foldlAssoc = M.foldlAssoc;
    _AssocFoldable.foldrAssoc = M.foldrAssoc;
    _AssocFoldable.pairs = _isFunction(M.pairs)
        ? M.pairs
        : M.foldlAssoc((accum, v, k) => Semigroup.concat(accum, [[k,v]]), Object.freeze([]))
    ;
    _AssocFoldable.values = _isFunction(M.values)
        ? M.values
        : M.foldlAssoc((accum, v, k) => Semigroup.concat(accum, [v]), Object.freeze([]))
    ;
    _AssocFoldable.keys = _isFunction(M.keys)
        ? M.keys
        : M.foldlAssoc((accum, v, k) => Semigroup.concat(accum, [k]), Object.freeze([]))
    ;
    _AssocFoldable.filterAssoc = _isFunction(M.filterAssoc)
        ? M.filterAssoc
        : _curryN(2, (filter, assoc) => M.foldlAssoc((accum, v, k) => {
            return filter(v, k) ? M.assoc(k, v, accum) : accum;
        }, M.empty(), assoc))
    ;
    _AssocFoldable.mapAssoc = _isFunction(M.mapAssoc)
        ? M.mapAssoc
        : _curryN(2, (fn, assoc) => M.foldlAssoc((accum, v, k) => {
            return M.assoc(k, fn(v, k), assoc);
        }, M.empty(), assoc))
    ;

    return _AssocFoldable;
});

const assocFoldableForModulePrototype = _typecached(M => {
    const methods = assocFoldableForModule(M);

    return {
        foldlAssoc: _thisify(methods.foldlAssoc),
        foldrAssoc: _thisify(methods.foldrAssoc),
        pairs: _thisify(methods.pairs),
        values: _thisify(methods.values),
        keys: _thisify(methods.keys),
        filterAssoc: _thisify(methods.filterAssoc),
        mapAssoc: _thisify(methods.mapAssoc),
    };
});

/**
 * Folds an associative container from left to right with the key.
 *
 * The order the function is applied to the key value pairs are dictated
 * by the container's notion of left-to-right and may not be stable.
 *
 * @since 0.6.0
 * @sig AssocFoldable f => (r -> v -> k -> r) -> r -> (f k v) -> v
 * @example
 *
 *      const obj = {'r': 7, 'k': 8};
 *      const fn = (result, value, key) => result + key + (value + 1);
 *      _.foldlAssoc(fn, 'g', obj); // 'gr8k9'
 */
AssocFoldable.foldlAssoc = _curryN(3, typeclass.forward('foldlAssoc', assocFoldableForModule));

/**
 * Folds an associative container from right to left with the key.
 *
 * The order the function is applied to the key value pairs are dictated
 * by the container's notion of right-to-left and may not be stable.
 *
 * @since 0.6.0
 * @sig AssocFoldable f => (r -> v -> k -> r) -> r -> (f k v) -> v
 * @example
 *
 *      const obj = {'k': 8, 'r': 7};
 *      const fn = (result, value, key) => result + key + (value + 1);
 *      _.foldrAssoc(fn, '', obj); // 'gr8k9'
 */
AssocFoldable.foldrAssoc = _curryN(3, typeclass.forward('foldrAssoc', assocFoldableForModule));

/**
 * Returns an array of key value pair tuples (as arrays) where the first index of each pair is a key
 * in the object and the second index is the value associated with that key.
 *
 * @sig Associative a => a k v -> [[k,a]]
 * @since 0.6.0
 */
AssocFoldable.pairs = _curryN(1, typeclass.forward('pairs', assocFoldableForModule));

/**
 * Returns all the keys in an associative collection as an array.
 *
 * @sig Associative a => a k v -> [k]
 * @since 0.6.0
 */
AssocFoldable.keys = _curryN(1, typeclass.forward('keys', assocFoldableForModule));

/**
 * Returns all the keys in an associative collection as an array.
 *
 * @sig Associative a => a k v -> [v]
 * @since 0.6.0
 */
AssocFoldable.values = _curryN(1, typeclass.forward('values', assocFoldableForModule));

/**
 * Filters an associative container based on a predicate function that accepts both a value and key.
 *
 * @sig Associative a => (v -> k -> Boolean) -> a k v -> a k v
 * @since 0.6.0
 */
AssocFoldable.filterAssoc = _curryN(2, typeclass.forward('filterAssoc', assocFoldableForModule));

/**
 * Maps the values and keys of an associative container.
 *
 * @sig Associative a => (v -> k -> v) -> a k v -> a k v
 * @since 0.6.0
 */
AssocFoldable.mapAssoc = _curryN(2, typeclass.forward('mapAssoc', assocFoldableForModule));

module.exports = typeclass(AssocFoldable, {
    deriveFn: assocFoldableForModule,
    deriveProtoFn: assocFoldableForModulePrototype,
    superTypes: [Associative],
    required: ['empty', 'foldlAssoc', 'foldrAssoc'],
});
