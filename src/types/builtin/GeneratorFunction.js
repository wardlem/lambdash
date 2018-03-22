const Protocol = require('../../protocols/Protocol');
const Type = require('../Type');

const setFunctionLength = require('../../util/setFunctionLength');

const merge = require('../../util/mergeDescriptors');

const Functor = require('../../protocols/Functor');
const Applicative = require('../../protocols/Applicative');
const Monad = require('../../protocols/Monad');
const Monoid = require('../../protocols/Monoid');

const GeneratorFunction = require('../../internal/_GeneratorFunction');

merge(GeneratorFunction.prototype, {
    [Functor.map](fn) {
        const original = this;
        function* mapped(...args) {
            const gen = original(...args);
            while (!gen.next().done) {
                yield fn(gen.value);
            }

            return gen.value;
        }

        setFunctionLength(this.length, mapped);

        return mapped;
    },
    [Applicative.ap](other) {
        const original = this;
        function* apped(...args) {
            const originalGen = original(...args);
            while (!originalGen.next().done) {
                const fn = originalGen.value;
                const otherGen = other();
                while (!otherGen.next().done) {
                    yield fn(otherGen.value);
                }
            }

            return originalGen.value;
        }

        setFunctionLength(this.length, apped);

        return apped;
    },
    [Applicative.of](value) {
        const ofGenerator = function* of() {
            yield value;
        };

        return ofGenerator;
    },
    [Monad.flatten]() {
        const original = this;
        function* flattened(...args) {
            const gen = original(...args);
            while (!gen.next().done) {
                yield* gen.value;
            }
        }

        setFunctionLength(this.length, flattened);

        return flattened;
    },
    [Monoid.empty]() {
        function* empty() {}
        return empty;
    },
    [Monoid.concat](other) {
        function* concatted() {
            yield* this;
            yield* other;
        }

        return concatted;
    },
});

GeneratorFunction[Type.has] = function has(value) {
    return value instanceof GeneratorFunction;
};

GeneratorFunction[Type.supertype] = Function;

Protocol.implement(GeneratorFunction, Functor, Applicative, Monad);

module.exports = GeneratorFunction;
