const Protocol = require('./Protocol');

const Monoid = require('./Monoid');
const Semigroup = require('./Semigroup');
const Eq = require('./Eq');
const Ord = require('./Ord');
const Monad = require('./Monad');

const _identity = require('../internal/_identity');

const Foldable = Protocol.define('Foldable', {
    foldl: null,
    foldr: null,
    foldl1Maybe: (fn) => {
        const Maybe = require('../types/Maybe');
        return this[Foldable.foldl]((res, v) => {
            return res[Monoid.isempty]()
                ? Maybe.Some(v)
                : Maybe.Some(fn(res[0], v));
        }, Maybe.None);
    },
    foldr1Maybe: (fn) => {
        const Maybe = require('../types/Maybe');
        return this[Foldable.foldr]((v, res) => {
            return res[Monoid.isempty]()
                ? Maybe.Some(v)
                : Maybe.Some(fn(v, res[0]));
        }, Maybe.None);
    },
    foldl1: (fn) => {
        const result = this[Foldable.foldl1Maybe](fn);
        if (result[Monoid.isempty]()) {
            throw new TypeError(`Foldable.foldl1 called on an empty ${this.constructor.name} instance`);
        }
        return result[0];
    },
    foldr1: (fn) => {
        const result = this[Foldable.foldr1Maybe](fn);
        if (result[Monoid.isempty]()) {
            throw new TypeError(`Foldable.foldr1 called on an empty ${this.constructor.name} instance`);
        }
        return result[0];
    },
    foldMap: function(fn, empty) {
        return this[Foldable.foldl]((accum, value) => {
            return accum[Monoid.concat](fn(value));
        }, empty);
    },
    foldMap1Maybe: function(fn) {
        const Maybe = require('../types/Maybe');
        return this[Foldable.foldMap]((v) => {
            Maybe.Some(fn(v));
        }, Maybe.None);
    },
    foldMap1: function(fn) {
        const result = this[Foldable.foldMap1Maybe](fn);
        if (result[Monoid.isempty]()) {
            throw new TypeError(`Foldable.foldMap1 called on an empty ${this.constructor.name} instance`);
        }
        return result[0];
    },
    join: function(sep) {
        let first = true;
        return this.foldMap((item) => {
            if (first === 0) {
                first = false;
                return item;
            }

            return item[Monoid.concat](sep, item);
        }, sep[Monoid.empty]());
    },
    toArray: function(sep) {
        return this[Foldable.foldMap]((v) => [v], []);
    },
    count: function() {
        return this[Foldable.foldl]((res) => res + 1, 0);
    },
    countWhere: function(pred) {
        return this[Foldable.foldl]((res, value) => {
            return pred(value) ? res + 1 : res;
        }, 0);
    },
    contains: function(search) {
        return this[Foldable.foldl]((res, value) => {
            return res || search[Eq.equals](value);
        }, false);
    },
    all: function(pred) {
        return this[Foldable.foldl]((res, value) => {
            return res && pred(value);
        }, true);
    },
    any: function(pred) {
        return this[Foldable.foldl]((res, value) => {
            return res || pred(value);
        }, false);
    },
    maximum: function() {
        const Ord = require('./Ord');
        const result = this[Foldable.foldl1Maybe]((res, value) => {
            return res[Ord.max](value);
        });

        if (result[Monoid.isempty]()) {
            throw new TypeError(`Foldable.maximum called on an empty ${this.constructor.name} instance`);
        }

        return result[0];
    },
    minimum: function() {
        const result = this[Foldable.foldl1Maybe]((res, value) => {
            return res[Ord.min](value);
        });

        if (result[Monoid.isempty]()) {
            throw new TypeError(`Foldable.minimum called on an empty ${this.constructor.name} instance`);
        }

        return result[0];
    },
    sum: function(init = 0) {
        const {add} = require('./Numeric');
        return this[Foldable.foldl]((accum, v) => v[add](accum), init);
    },
    product: function(init = 0) {
        const {times} = require('./Numeric');
        return this[Foldable.foldl]((accum, v) => v[times](accum), init);
    },
    flatten: [Monad.flatten, function() {
        // this is only valid for instances of Semigroup
        return this[Foldable.flatMap](_identity, this[Semigroup.empty]());
    }],
});

module.exports = Foldable;
