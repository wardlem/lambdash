const Protocol = require('./Protocol');
const Eq = require('./Eq');
const Ord = require('./Ord');

const Enumerable = Protocol.define('Enumerable', {
    prev: null,
    next: null,
    prevN: function prevN(n) {
        // ensure integer
        n = Math.trunc(n);

        if (n < 0) {
            return this[Enumerable.nextN](Math.abs(n));
        }

        if (n === 0) {
            return this;
        }

        return this[Enumerable.prev]()[Enumerable.prevN](n - 1);
    },
    nextN: function prevN(n) {
        // ensure integer
        n = Math.trunc(n);

        if (n < 0) {
            return this[Enumerable.prevN](Math.abs(n));
        }

        if (n === 0) {
            return this;
        }

        return this[Enumerable.next]()[Enumerable.nextN](n - 1);
    },
    enumTo: function enumTo(final) {
        // TODO: this can run forever if final not same type as this
        const res = this[Enumerable.enumUntil](final);
        res.push(final);

        return res;
    },
    enumUntil: function enumUntil(final) {
        // TODO: this can run forever if final not same type as this
        const step = this[Ord.isLessThan](final)
            ? Enumerable.next
            : Enumerable.prev
        ;

        const res = [];
        let current = this;
        while (current[Eq.notEquals](final)) {
            res.push(current);
            current = current[step]();
        }

        return res;
    },
    enumN: function enumN(n) {
        const step = n < 0 ? Enumerable.prev : Enumerable.next;
        n = Math.abs(n);

        const res = [];
        let current = this;
        while (res.length < n) {
            res.push(current);
            current = current[step]();
        }

        return res;
    },
}, [Eq, Ord]);

module.exports = Enumerable;
