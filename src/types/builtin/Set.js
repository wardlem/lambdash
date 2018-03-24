const Ord = require('../../protocols/Ord');
const Protocol = require('../../protocols/Protocol');
const Iterable = require('../../protocols/Iterable');
const Functor = require('../../protocols/Functor');
const Monoid = require('../../protocols/Monoid');
const Monad = require('../../protocols/Monad');
const Foldable = require('../../protocols/Foldable');
const Show = require('../../protocols/Show');
const Type = require('../Type');
const Applicative = require('../../protocols/Applicative');
const SetKind = require('../../protocols/SetKind');
const Numeric = require('../../protocols/Numeric');
const Clone = require('../../protocols/Clone');


const Ordering = require('../Ordering');

const merge = require('../../util/mergeDescriptors');

function sortKeys(l, r) {
    return l[Ord.compare](r)[Numeric.toNumber]();
}

merge(Set.prototype, {
    [Ord.compare](other) {
        if (this === other) {
            // short-circuit
            return Ordering.EQ;
        }

        const thisKeys = Array.from(this).sort(sortKeys);
        const otherKeys = Array.from(this).sort(sortKeys);

        return thisKeys[Ord.compare](otherKeys);
    },
    [Functor.map](fn) {
        return new Set(Array.from(this).map((v) => fn(v)));
    },
    [Foldable.foldl](fn, init) {
        return new Set(Array.from(this)[Foldable.foldl](fn, init));
    },
    [Foldable.foldr](fn, init) {
        return new Set(Array.from(this)[Foldable.foldr](fn, init));
    },
    [Foldable.count]() {
        return this.size;
    },
    [Monoid.concat](other) {
        return new Set(Array.from(this)[Monoid.concat](Array.from(other)));
    },
    [Monoid.empty]() {
        return new Set();
    },
    [Applicative.ap](other) {
        return new Set(Array.from(this)[Monoid.ap](Array.from(other)));
    },
    [Applicative.of](value) {
        return new Set([value]);
    },
    [Monad.flatten]() {
        return this[Foldable.foldl]((res, v) => res[Monoid.concat](v), new Set());
    },
    [SetKind.union](other) {
        return this.concat(other);
    },
    [SetKind.difference](other) {
        return other[Foldable.foldl]((res, v) => {
            res.delete(v);
            return res;
        }, this[Clone.clone]());
    },
    [SetKind.intersection](other) {
        return other[Foldable.foldl]((res, v) => {
            if (this.has(v)) {
                res.add(v);
            }
            return res;
        }, new Set());
    },
    [SetKind.has](key) {
        return this.has(key);
    },
    [SetKind.delete](key) {
        const clone = this[Clone.clone]();
        clone.delete(key);
        return clone;
    },
    [SetKind.size]() {
        return this.size;
    },
    [SetKind.insert](key) {
        const clone = this[Clone.clone]();
        clone.add(key);
        return clone;
    },
    [Show.show](seen = new Set()) {
        if (seen.has(this)) {
            return '[Set recursion]';
        }
        seen = seen[SetKind.insert](this);
        const values = Array.from(this)[Show.show](seen);

        return `new Set(${values})`;
    },
    [Clone.clone]() {
        return new Set(this);
    },
});

Set[Type.has] = function has(value) {
    return value instanceof Set;
};

Protocol.implement(Set, Ord, Functor, Foldable, Applicative, Monoid, Monad, Monad, SetKind, Iterable, Show, Clone);

module.exports = Set;
