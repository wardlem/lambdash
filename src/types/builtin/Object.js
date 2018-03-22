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
const SetKind = require('../protocols/SetKind');
const Clone = require('../protocols/Clone');

const Ordering = require('../Ordering');

const merge = require('../../util/mergeDescriptors');

merge(Object.prototype, {
    [Ord.compare](other) {
        const thisKeys = Object.keys(this).sort();
        const otherKeys = Object.keys(other).sort();

        const count = Math.max(thisKeys.length, otherKeys.length);
        let idx = 0;
        while (idx < count) {
            const thisKey = thisKeys[idx];
            const otherKey = otherKeys[idx];
            let comp = thisKey[Ord.compare](otherKey);
            if (comp.isNE()) {
                return comp;
            }
            comp = this[thisKey][Ord.compare](other[otherKey]);
            if (comp.isNE()) {
                return comp;
            }
            idx += 1;
        }

        return Ordering(thisKeys.length - otherKeys.length);
    },
    [Functor.map](fn) {
        return Object.keys(this)[Foldable.foldl]((accum, key) => {
            accum[key] = fn(this[key]);
            return accum;
        }, {});
    },
    [Monoid.concat](other) {
        return Object.keys(other).reduce((res, k) => {
            res[k] = other[k];
            return res;
        }, this[Clone.clone]());
    },
    [Monoid.empty]() {
        return {};
    },
    [Monoid.isempty]() {
        return this[Associative.size] === 0;
    },
    [SetLike.union](other) {
        return other[Monoid.concat](this);
    },
    [SetLike.difference](other) {
        const otherKeys = new Set(Object.keys(other));
        return Object.keys(this).reduce((res, k) => {
            if (!otherKeys.has(k)) {
                res[k] = this[k];
            }
            return res;
        }, {});
    },
    [SetLike.intersection](other) {
        const otherKeys = new Set(Object.keys(other));
        return Object.keys(this).reduce((res, k) => {
            if (otherKeys.has(k)) {
                res[k] = this[k];
            }
            return res;
        }, {});
    },
    [Clone.clone]() {
        return Object.keys(this).reduce((res, k) => {
            res[k] = this[k];
            return res;
        }, {});
    },
    [Foldable.foldl](fn, init) {
        const keys = Object.keys(this).sort();
        return keys[Foldable.foldl]((accum, key) => fn(accum, this[key]));
    },
    [Foldable.foldr](fn, init) {
        const keys = Object.keys(this).sort();
        return keys[Foldable.foldr]((key, accum) => fn(this[key], accum));
    },
    [Associative.has](key) {
        return this.hasOwnProperty(key);
    },
    [Associative.set](key, value) {
        const clone = this[Clone.clone]();
        clone[key] = value;
        return clone;
    },
    [Associative.get](key) {
        if (!this[Associative.has](key)) {
            throw new TypeError(`Object does not have key ${key}`);
        }

        return this[key];
    },
    [Associative.delete](key) {
        const clone = this[Clone.clone]();
        delete clone[key];
        return clone;
    },
    [Associative.size]() {
        return Object.keys(this).length;
    },
    [Show.show](seen = new Set()) {
        if (seen.has(this)) {
            return '[Object recursion]';
        }
        seen = seen[SetKind.insert](this);
        const keyValues = Object.keys(this).map((key) => {
            return `${key[Show.show]()}: ${this[key][Show.show]()}`;
        });

        return `{${keyValues.join(', ')}}`;
    },
    [Iterable.iterator]() {
        const keys = Object.keys(this);
        let idx = 0;
        const gen = function*() {
            while (idx < keys.length) {
                const key = keys[idx];
                yield [key, this[key]];
                idx += 1;
            }
        };

        return gen();
    },
});

Object[Type.has] = function has(value) {
    return value instanceof Object;
};

Protocol.implement(Object, Ord, Functor, Monoid, SetLike, Clone, Associative, Foldable, Show, Iterable);

module.exports = Object;
