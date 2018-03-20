const Sum = require('./Sum');

const Protocol = require('../protocols/Protocol');

const Functor = require('../protocols/Functor');
const Apply = require('../protocols/Apply');
const Applicative = require('../protocols/Applicative');
const Monoid = require('../protocols/Monoid');
const Semigroup = require('../protocols/Semigroup');
const Foldable = require('../protocols/Foldable');
const Case = require('../protocols/Case');
const Monad = require('../protocols/Monad');

const merge = require('../util/mergeDescriptors');

const Maybe = Sum.define(function Maybe(...args) {
    if (args.length === 0) {
        return Maybe.None();
    }

    return Maybe.Some(args[0]);
}, {
    None: null,
    Some: [null],
});

merge(Maybe.prototype, {
    [Semigroup.concat]: function(other) {
        return this[Case.case]({
            None: other,
            Some: (l) => {
                return other[Case.case]({
                    None: this,
                    Some: (r) => Maybe.Some(l[Semigroup.concat](r)),
                });
            },
        });
    },
    [Monoid.empty]: function() {
        return Maybe.None;
    },
    [Apply.ap]: function(other) {
        return this[Case.case]({
            None: this,
            Some: (fn) => other[Functor.map](fn),
        });
    },
    [Applicative.of]: function(value) {
        return Maybe.Some(value);
    },
    [Functor.map]: function(fn) {
        return this[Case.case]({
            None: this,
            Some: (v) => Maybe.Some(fn(v)),
        });
    },
    [Foldable.foldl]: function(fn, accum) {
        return this[Case.case]({
            None: accum,
            Some: (v) => fn(accum, v),
        });
    },
    [Foldable.foldr]: function(fn, accum) {
        return this[Case.case]({
            None: accum,
            Some: (v) => fn(v, accum),
        });
    },
});

Protocol.implement(Maybe, Semigroup, Monoid, Functor, Apply, Applicative, Foldable, Monad);

module.exports = Maybe;
