const Eq = require('../../protocols/Eq');
const Protocol = require('../../protocols/Protocol');
const Show = require('../../protocols/Show');
const Functor = require('../../protocols/Functor');
const Semigroup = require('../../protocols/Semigroup');
const Monad = require('../../protocols/Monad');
const Type = require('../Type');
const Applicative = require('../../protocols/Applicative');
const Clone = require('../protocols/Clone');

const merge = require('../../util/mergeDescriptors');

merge(Promise.prototype, {
    [Eq.equals](other) {
        return this === other;
    },
    [Functor.map](fn) {
        return this.then((value) => fn(value));
    },
    [Semigroup.concat](other) {
        return Promise.all([this, other])
            .then(([first, second]) => first[Semigroup.concat](second));
    },
    [Applicative.ap](other) {
        return Promise.all([this, other])
            .then(([first, second]) => first(second));
    },
    [Applicative.of](v) { return Promise.resolve(v); },
    [Monad.flatten]() {
        // Promises are automatically flattened...yuck!
        return this;
    },
    [Show.show]() {
        return '[Promise]';
    },
    [Clone.clone]() {
        // can't mutate a promise so just return it
        return this;
    },
});

Promise[Type.has] = function has(value) {
    return value instanceof Promise;
};

Protocol.implement(Promise, Eq, Show, Functor, Semigroup, Applicative, Monad, Clone);

module.exports = Promise;
