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

        const gen = function*() {
            yield* this[Enumerable.enumUntil](final);
            yield final;
        }.bind(this);

        return gen();
    },
    enumUntil: function enumUntil(final) {
        const step = this[Ord.lt](final)
            ? Enumerable.next
            : Enumerable.prev
        ;

        let current = this;
        const gen = function*() {
            while (current[Eq.notEquals](final)) {
                yield current;
                current = current[step]();
            }
        };

        return gen();
    },
    enumN: function enumN(n) {
        const step = n < 0 ? Enumerable.prev : Enumerable.next;
        n = Math.abs(n);

        let count = 0;
        let current = this;

        const gen = function*() {
            while (count < n) {
                yield current;
                count += 1;
                current = current[step]();
            }
        };


        return gen();
    },
}, [Eq, Ord]);

module.exports = Enumerable;
