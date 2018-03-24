const Ord = require('../../protocols/Ord');
const Protocol = require('../../protocols/Protocol');
const Iterable = require('../../protocols/Iterable');
const Functor = require('../../protocols/Functor');
const Monoid = require('../../protocols/Monoid');
const Monad = require('../../protocols/Monad');
const Foldable = require('../../protocols/Foldable');
const Sequential = require('../../protocols/Sequential');
const Show = require('../../protocols/Show');
const Type = require('../Type');
const Applicative = require('../../protocols/Applicative');
const SetKind = require('../../protocols/SetKind');
const Clone = require('../../protocols/Clone');

const Ordering = require('../Ordering');

const merge = require('../../util/mergeDescriptors');

merge(Array.prototype, {
    [Ord.compare](other) {
        if (this === other) {
            // short-circuit
            return Ordering.EQ;
        }

        const len = Math.min(this.length, other.length);

        let ind = 0;
        while (ind < len) {
            const ordering = this[ind][Ord.compare](other[ind]);
            if (!ordering.isEQ()) {
                return ordering;
            }

            ind += 1;
        }

        if (this.length < other.length) {
            return Ordering.LT;
        } else if (this.length > other.length) {
            return Ordering.GT;
        }

        return Ordering.EQ;
    },
    [Functor.map](fn) {
        return this.map((v) => fn(v));
    },
    [Foldable.foldl](fn, init) {
        return this.reduce((accum, v) => fn(accum, v), init);
    },
    [Foldable.foldr](fn, init) {
        return this.reduceRight((accum, v) => fn(v, accum), init);
    },
    [Foldable.count]() {
        return this.length;
    },
    [Monoid.concat](other) {
        return this.concat(other);
    },
    [Monoid.empty]() {
        return [];
    },
    [Applicative.ap](other) {
        let result = [];
        let idx = 0;
        while (idx < this.length) {
            result = result.concat(other[Functor.map](this[idx]));
            idx += 1;
        }

        return result;
    },
    [Applicative.of](value) {
        return [value];
    },
    [Monad.flatten]() {
        return this.reduce((res, v) => res.concat(v), []);
    },
    [Sequential.at](idx) {
        if (idx < 0 || idx >= this.length) {
            throw new RangeError('Out of bounds index when Sequential.at called on an array');
        }
        return this[idx];
    },
    // [Sequential.length]() {
    //     return this.length;
    // },
    [Sequential.slice](start, end) {
        return this.slice(start, end);
    },
    [Sequential.reverse]() {
        return this.slice().reverse();
    },
    [SetKind.union](other) {
        return this.concat(other)[Sequential.unique]();
    },
    [SetKind.difference](other) {
        return this.filter((v) => !other[Foldable.contains](v))[Sequential.unique]();
    },
    [SetKind.intersection](other) {
        return this.filter((v) => other[Foldable.contains](v))[Sequential.unique]();
    },
    [SetKind.has](key) {
        return this[Foldable.contains](key);
    },
    [SetKind.delete](key) {
        return this.filter((v) => key[Ord.notEquals](v));
    },
    [SetKind.size]() {
        return this[Sequential.unique]().length;
    },
    [SetKind.insert](key) {
        if (this[SetKind.has](key)) {
            return this;
        }

        return this[Sequential.append](key);
    },
    [Show.show](seen = new Set()) {
        if (seen.has(this)) {
            return '[Array recursion]';
        }
        seen = seen[SetKind.insert](this);

        return `[${this.map((v) => v[Show.show]()).join(',')}]`;
    },
    [Clone.clone]() {
        return this.slice();
    },
});

Array[Type.has] = Array.isArray;

Protocol.implement(
    Array,
    Ord,
    Functor,
    Foldable,
    Sequential,
    Applicative,
    Monoid,
    Monad,
    Monad,
    SetKind,
    Iterable,
    Show,
    Clone
);

module.exports = Array;
