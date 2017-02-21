const _moduleFor = require('./internal/_moduleFor');
const _curry = require('./internal/_curry');
const _isFunction = require('./internal/_isFunction');
const _curryN = require('./internal/_curryN');
const _typecached = require('./internal/_typecached');
const _thisify = require('./internal/_thisify');
const _flip = require('./internal/_flip');
const typeclass = require('./typeclass');

const Semigroup = {name: 'Semigroup'};
const Foldable = require('./Foldable');

const semigroupForModule = _typecached(M => {
    if (!Semigroup.isImplementedBy(M)) {
        throw new TypeError(`${M.name} does not implement Semigroup`);
    }


    const _Semigroup = {};

    _Semigroup.concat = M.concat;

    return _Semigroup;
});

const semigroupForModulePrototype = _typecached(M => {
    const methods = semigroupForModule(M);

    return {
        concat: _thisify(_flip(methods.concat)),
        concatAll: function(others) {
            return Semigroup.concatAll([this].concat(others));
        },
    };
});

/**
 * Returns the concatenation of two values
 *
 * @sig Semigroup m => m -> m -> m
 * @since 0.4.0
 * @param {Semigroup} first the prefix of the concatenation
 * @param {Semigroup} second the suffix of the concatenation
 * @return {Semigroup} the result of the concatenation
 * @example
 *
 *      _.concat([1,2,3],[4,5,6]);  // [1,2,3,4,5,6]
 *      _.concat("ABC", "123");     // "ABC123"
 */
Semigroup.concat = _curryN(2, typeclass.forward('concat', semigroupForModule));

/**
 * Concatenates all values in a foldable into one.
 *
 * The foldable can not be empty.
 *
 * @sig (Semigroup m, Foldable f)  => f m -> m
 * @since 0.4.0
 * @returns {Semigroup}
 */
Semigroup.concatAll = _curry(foldable => Foldable.foldl1(Semigroup.concat, foldable));


Semigroup.member = function(value) {
    const M = _moduleFor(value);
    return _isFunction(M.concat);
};

module.exports = typeclass(Semigroup, {
    deriveFn: semigroupForModule,
    deriveProtoFn: semigroupForModulePrototype,
    required: ['concat'],
    superTypes: [],
});
