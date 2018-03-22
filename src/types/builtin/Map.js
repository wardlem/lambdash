const Ord = require('../../protocols/Ord');
const Protocol = require('../../protocols/Protocol');
const Iterable = require('../../protocols/Iterable');
const Functor = require('../../protocols/Functor');
const Monoid = require('../../protocols/Monoid');
const Foldable = require('../../protocols/Foldable');
const Associative = require('../../protocols/Associative');
const Show = require('../../protocols/Show');
const Type = require('../Type');
const SetLike = require('../protocols/SetLike');
const Clone = require('../protocols/Clone');
const Numeric = require('../protocols/Numeric');
const SetKind = require('../protocols/SetKind');

const Ordering = require('../Ordering');

const merge = require('../../util/mergeDescriptors');

function sortEntries(l, r) {
    return l[0][Ord.compare](r[0])[Numeric.toNumber]();
}

merge(Map.prototype, {
    [Ord.compare](other) {
        if (this === other) {
            // short-circuit
            return Ordering.EQ;
        }
        const thisEntries = Array.from(this).sort(sortEntries);
        const otherEntries = Array.from(this).sort(sortEntries);

        return thisEntries[Ord.compare](otherEntries);
    },
    [Functor.map](fn) {
        return Array.from(this.keys())[Foldable.foldl]((accum, key) => {
            accum.set(key, fn(this.get(key)));
            return accum;
        }, new Map());
    },
    [Monoid.concat](other) {
        return Array.from(other.keys()).reduce((res, k) => {
            res.set(k, other[k]);
            return res;
        }, this[Clone.clone]());
    },
    [Monoid.empty]() {
        return new Map();
    },
    [Monoid.isempty]() {
        return this.size === 0;
    },
    [SetLike.union](other) {
        return other[Monoid.concat](this);
    },
    [SetLike.difference](other) {
        const otherKeys = new Set(other.keys());
        return Array.from(this.keys()).reduce((res, k) => {
            if (!otherKeys.has(k)) {
                res.set(k, this.get(k));
            }
            return res;
        }, new Map());
    },
    [SetLike.intersection](other) {
        const otherKeys = new Set(other.keys());
        return Array.from(this.keys()).reduce((res, k) => {
            if (otherKeys.has(k)) {
                res.set(k, this.get(k));
            }
            return res;
        }, new Map());
    },
    [Clone.clone]() {
        return new Map(this);
    },
    [Foldable.foldl](fn, init) {
        const entries = Array.from(this).sort(sortEntries);
        return entries[Foldable.foldl]((accum, entry) => fn(accum, entry[1]));
    },
    [Foldable.foldr](fn, init) {
        const entries = Array.from(this).sort(sortEntries);
        return entries[Foldable.foldr]((entry, accum) => fn(entry[1], accum));
    },
    [Associative.has](key) {
        return this.has(key);
    },
    [Associative.set](key, value) {
        const clone = this[Clone.clone]();
        clone.set(key, value);
        return clone;
    },
    [Associative.get](key) {
        if (!this.has(key)) {
            throw new TypeError(`Map does not have key ${key}`);
        }

        return this.get(key);
    },
    [Associative.delete](key) {
        const clone = this[Clone.clone]();
        clone.delete(key);
        return clone;
    },
    [Associative.size]() {
        return this.size;
    },
    [Show.show](seen = new Set()) {
        if (seen.has(this)) {
            return '[Map recursion]';
        }
        seen = seen[SetKind.insert](this);
        const keyValues = Array.from(this)[Show.show](seen);

        return `new Map(${keyValues})`;
    },
});

Map[Type.has] = function has(value) {
    return value instanceof Map;
};

Protocol.implement(Map, Ord, Functor, Monoid, SetLike, Clone, Associative, Foldable, Show, Iterable);

module.exports = Map;
