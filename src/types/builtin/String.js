const Ord = require('../../protocols/Ord');
const Protocol = require('../../protocols/Protocol');
const Numeric = require('../../protocols/Numeric');
const Enumerable = require('../../protocols/Enumerable');
const Iterable = require('../../protocols/Iterable');
const Functor = require('../../protocols/Functor');
const Monoid = require('../../protocols/Monoid');
const Foldable = require('../../protocols/Foldable');
const Sequential = require('../../protocols/Sequential');
const Case = require('../../protocols/Case');
const Show = require('../../protocols/Show');
const Logical = require('../../protocols/Logical');
const Type = require('../Type');
const Clone = require('../../protocols/Clone');
const _isFunction = require('../../internal/_isFunction');

const merge = require('../../util/mergeDescriptors');

merge(String.prototype, {
    [Ord.lte](other) {
        return this.valueOf() <= other.valueOf();
    },
    [Numeric.toNumber]() {
        const codePoint = this.codePointAt(0);
        if (this.length == 1) {
            return codePoint;
        } else if (this.length == 2 && codePoint > 65535) {
            return codePoint;
        } else {
            throw new RangeError('Numeric.toNumber should only be called on a string with a single code point');
        }
    },
    [Numeric.fromNumber](number) {
        return String.fromCodePoint(number);
    },
    [Enumerable.prev]() {
        return this[Numeric.fromNumber](this[Numeric.toNumber]() - 1);
    },
    [Enumerable.next]() {
        return this[Numeric.fromNumber](this[Numeric.toNumber]() + 1);
    },
    [Functor.map](fn) {
        return Array.from(this)[Functor.map](fn).join('');
    },
    [Monoid.concat](other) {
        return this + String(other);
    },
    [Monoid.empty]() {
        return '';
    },
    [Foldable.foldl](fn, accum) {
        const iter = this[Iterable.iterator]();
        let value = iter.next().value;
        while (value != null) {
            accum = fn(accum, value);
            value = iter.next().value;
        }

        return accum;
    },
    [Foldable.foldr](fn, accum) {
        return this[Foldable.toArray]()[Foldable.foldr](fn, accum);
    },
    [Foldable.toArray]() {
        return Array.from(this);
    },
    [Sequential.of](value) {
        // TODO: allow custom stringification
        return String(value);
    },
    [Sequential.at](index) {
        if (index < 0) {
            throw new RangeError('Sequential.at should not be called with a negative value on a string');
        }

        const iter = this[Iterable.iterator]();
        let value = iter.next().value;
        while (value != null) {
            if (index === 0) {
                return value;
            }
            index -= 1;
            value = iter.next().value;
        }

        throw new RangeError('Sequential.at called on a string with an index that is out of bounds');
    },
    [Sequential.reverse]() {
        return this[Foldable.foldl]((res, c) => c + res, '');
    },
    [Sequential.slice](start, end) {
        let idx = 0;
        const iter = this[Iterable.iterator]();
        const parts = [];
        let value = iter.next().value;
        while (value != null) {
            if (idx >= end) {
                return parts.join('');
            }
            if (idx >= start) {
                parts.push(value);
            }

            value = iter.next().value;
            idx += 1;
        }

        if (idx === end) {
            return parts.join('');
        }

        throw new RangeError('Sequential.slice called with out of bounds values');
    },
    [Logical.toFalse]() {
        return '';
    },
    [Case.case](cases) {

        let match = null;
        let hasMatch = false;
        if (cases.hasOwnProperty(this)) {
            match = cases[this];
            hasMatch = true;
        } else if (cases.hasOwnProperty(Case.default)) {
            match = cases[Case.default];
            hasMatch = true;
        }

        if (hasMatch) {
            if (_isFunction(match)) {
                return match(this);
            } else {
                return match;
            }
        }

        throw new TypeError(`Missing case for ${this} when matching string value`);
    },
    [Show.show]() {
        return JSON.stringify(this);
    },
    [Clone.clone]() {
        return this.valueOf();
    },
});

String[Type.has] = function has(value) {
    return typeof value === 'string' || value instanceof String;
};

Protocol.implement(String, Ord, Numeric, Enumerable, Iterable, Monoid, Functor, Sequential, Case, Show, Logical, Clone);

module.exports = String;
