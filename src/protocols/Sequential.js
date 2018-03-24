const Protocol = require('./Protocol');

const Foldable = require('./Foldable');
const Semigroup = require('./Semigroup');
const Of = require('./Of');
const Eq = require('./Eq');
const Monoid = require('./Monoid');

const _identity = require('../internal/_identity');

const Sequential = Protocol.define('Sequential', {
    at: null,
    append: function(item) {
        return this[Semigroup.concat](this[Of.of](item));
    },
    prepend: function(item) {
        return this[Of.of](item)[Semigroup.concat](this);
    },
    slice: function(start, end) {
        let res = this.empty();
        while (start < end) {
            res = res[Sequential.append](this[Sequential.at](start));
            start += 1;
        }

        return res;
    },
    take: function(n) {
        return this[Sequential.slice(0, n)];
    },
    drop: function(n) {
        return this[Sequential.slice](n, this[Sequential.count]());
    },
    takeLast: function(n) {
        return this[Sequential.drop](this[Sequential.count]() - n);
    },
    dropLast: function(n) {
        return this[Sequential.take](this[Sequential.count]() - n);
    },
    head: function() {
        return this[Sequential.at](0);
    },
    tail: function() {
        return this[Sequential.drop](1);
    },
    last: function() {
        return this[Sequential.at](this[Sequential.count]() - 1);
    },
    init: function() {
        return this[Sequential.dropRight](1);
    },
    intersperse: function(sep) {
        const l = this[Sequential.count](this);
        if (l < 2) {
            return this;
        }

        const _intersperse = (l, sequence) => {
            if (l == 0) {
                return this.empty();
            }
            const head = sequence[Sequential.head]();
            const tail = _intersperse(l - 1, sequence[Sequential.tail]());
            return tail[Sequential.prepend](head)[Sequential.prepend](sep);
        };

        const head = this[Sequential.head]();
        const tail = _intersperse(l - 1, this[Sequential.tail]());
        return tail[Sequential.prepend](head);
    },
    reverse: function() {
        const _reverse = (l, sequence) => {
            if (l === 0) {
                return sequence;
            }

            const head = sequence[Sequential.head]();
            const tail = _reverse(l - 1, sequence[Sequential.tail]());

            return tail[Sequential.append](head);
        };

        return _reverse(this[Sequential.count](), this);
    },
    splitAt: function(n, Container = Array) {
        const left = this[Sequential.take](n);
        const right = this[Sequential.drop](n);

        const leftContainer = Container.prototype[Of.of].call(null, left);
        const rightContainer = Container.prototype[Of.of].call(null, right);

        return leftContainer[Semigroup.concat](rightContainer);
    },
    takeWhile: function(pred) {
        let idx = 0;
        let l = this[Sequential.count]();
        while (idx < l && pred(this[Sequential.at](idx))) {
            idx += 1;
        }

        return this[Sequential.take](idx);
    },
    dropWhile: function(pred) {
        let idx = 0;
        let l = this[Sequential.count]();
        while (idx < l && pred(this[Sequential.at](idx))) {
            idx += 1;
        }

        return this[Sequential.drop](idx);
    },
    takeLastWhile: function(pred) {
        let idx = this[Sequential.count]() - 1;
        while (idx >= 0 && pred(this[Sequential.at](idx))) {
            idx -= 1;
        }

        return this[Sequential.drop](idx + 1);
    },
    dropLastWhile: function(pred) {
        let idx = this[Sequential.count]() - 1;
        while (idx >= 0 && pred(this[Sequential.at](idx))) {
            idx -= 1;
        }

        return this[Sequential.take](idx + 1);
    },
    filter: function(pred) {
        let res = this[Monoid.empty]();
        let idx = 0;
        let l = this[Sequential.count]();

        while (idx < l) {
            const v = this[Sequential.at](idx);
            if (pred(v)) {
                res = res[Sequential.append](v);
            }
            idx += 1;
        }

        return res;
    },
    uniqueBy: function(map) {
        if (this[Monoid.isempty]()) {
            return this;
        }

        const head = this[Sequential.head]();
        const tail = this[Sequential.tail]();


        const testv = map(head);
        const pred = (v) => map(v)[Eq.notEquals](testv);
        const filtered = tail[Sequential.filter](pred);

        return filtered[Sequential.uniqueBy](map)[Sequential.prepend](head);
    },
    unique: function() {
        return this[Sequential.uniqueBy](_identity);
    },
    isempty: [Monoid.isempty, function() {
        return this[Sequential.count]() === 0;
    }],
    findIndex: function(pred) {
        let l = this[Sequential.count]();
        let idx = 0;

        while (idx < l) {
            const v = this[Sequential.at](idx);
            if (pred(v)) {
                return idx;
            }
            idx += 1;
        }

        return -1;
    },
    findLastIndex: function(pred) {
        let idx = this[Sequential.count]() - 1;

        while (idx >= 0) {
            const v = this[Sequential.at](idx);
            if (pred(v)) {
                return idx;
            }
            idx -= 1;
        }

        return -1;
    },
    findMaybe: function(pred) {
        const Maybe = require('../types/Maybe');
        const idx = this[Sequential.findIndex](pred);
        if (idx === -1) {
            return Maybe.None();
        }

        return Maybe.Some(this[Sequential.at](idx));
    },
    findLastMaybe: function(pred) {
        const Maybe = require('../types/Maybe');
        const idx = this[Sequential.findLastIndex](pred);
        if (idx === -1) {
            return Maybe.None();
        }

        return Maybe.Some(this[Sequential.at](idx));
    },
    find: function(pred) {
        const result = this[Sequential.findMaybe](pred);
        if (result[Monoid.isempty]()) {
            throw new RangeError('Could not find the item');
        }

        return result[0];
    },
    findLast: function(pred) {
        const result = this[Sequential.findLastMaybe](pred);
        if (result[Monoid.isempty]()) {
            throw new RangeError('Could not find the item');
        }

        return result[0];
    },
    indexOf: function(value) {
        return this[Sequential.findIndex]((other) => value[Eq.equals](other));
    },
    lastIndexOf: function(value) {
        return this[Sequential.findLastIndex]((other) => value[Eq.equals](other));
    },
}, [Foldable, Monoid, Of]);

module.exports = Sequential;
