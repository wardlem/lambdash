const Type = require('../Type');
const Eq = require('../../protocols/Eq');
const Protocol = require('../../protocols/Protocol');
const Logical = require('../../protocols/Logical');
const Show = require('../../protocols/Show');

const {ap} = require('../../protocols/Apply');
const {map, toArray} = require('../../protocols/Functor');
const {foldl} = require('../../protocols/Foldable');

const _arity = require('../../internal/_arity');
const _compose = require('../../internal/_compose');
const _pipe = require('../../internal/_pipe');
const _curry = require('../../internal/_curry');
const _curryN = require('../../internal/_curryN');
const _always = require('../../internal/_always');
const _alwaysThrow = require('../../internal/_alwaysThrow');
const _thunk = require('../../internal/_thunk');
const _identity = require('../../internal/_identity.js');
const _flip = require('../../internal/_flip');

const nameFunction = require('../../util/nameFunction');
const setFunctionLength = require('../../util/setFunctionLength');

const merge = require('../../util/mergeDescriptors');

const {
    compose,
    pipe,
    always,
    alwaysThrow,
    thunk,
    identity,
    curry,
    curryN,
    arity,
    named,
    liftN,
    lift,
    apply,
    flip,
    noop,
    both,
    either,
    // exclusiveEither,
    // neither,
    complement,
} = require('../.../../internal/_symbols');

Function[Type.has] = function has(value) {
    return value instanceof Function;
};

merge(Function.prototype, {
    [compose](...others) {
        return _compose(others.concat[this]);
    },
    [pipe](...others) {
        return _pipe([this].concat(others));
    },
    [thunk]() {
        return _thunk(this);
    },
    [curry]() {
        return _curry(this);
    },
    [curryN](n) {
        return _curryN(n, this);
    },
    [arity](n) {
        return _arity(n, this);
    },
    [named](name) {
        const arity = _arity(this.length, this);
        nameFunction(name, arity);
        return arity;
    },
    [liftN](n) {
        // Thank you Ramda: https://github.com/ramda/ramda/blob/master/src/liftN.js
        const lifted = _curryN(n, this);
        return _curryN(n, (...args) => {
            return args.slice(1, n)[foldl]((l, r) => l[ap](r), args[0][map](lifted));
        });
    },
    [lift]() {
        return this[liftN](this.length);
    },
    [apply](values) {
        if (!Array.isArray(values)) {
            values = values[toArray]();
        }

        return this.apply(this, values);
    },
    [flip]() {
        return _flip(this);
    },
    [both](other) {
        const original = this;
        function both(...args) {
            return original(...args)[Logical.and](other(...args));
        }

        setFunctionLength(Math.max(this.length, other.length), both);

        return both;
    },
    [either](other) {
        const original = this;
        function either(...args) {
            return original(...args)[Logical.or](other(...args));
        }

        setFunctionLength(Math.max(this.length, other.length), either);

        return either;
    },
    [complement]() {
        const original = this;
        function complement(...args) {
            return !original(...args);
        }

        setFunctionLength(this.length, complement);
    },
    [Show.show]() {
        return `[${this.constructor.name} ${this.name}(${this.length})]`;
    },
});

merge(Function, {
    [always]: _always,
    [alwaysThrow]: _alwaysThrow,
    [identity]: _identity,
    [noop]: function noop() {},
});

Protocol.implement(Function, Eq, Show);

module.exports = Function;
