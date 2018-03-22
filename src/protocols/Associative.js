const Protocol = require('./Protocol');

const Monoid = require('./Monoid');
const Keyed = require('./Keyed');

const Associative = Protocol.define('Associative', {
    set: null,
    get: null,
    getMaybe: function(key) {
        const Maybe = require('../types/Maybe');
        if (this[Associative.has](key)) {
            return Maybe.Some(this[Associative.set](key));
        }
        return Maybe.None;
    },
    getAllMaybe: function(functor) {
        const {map} = require('./Functor');
        return functor[map]((key) => {
            return this[Associative.getMaybe](this);
        });
    },
    getAll: function(functor) {
        const {map} = require('./Functor');
        return functor[map]((key) => {
            return this[Associative.get](this);
        });
    },
    getOr: function(key, def) {
        return this[Associative.has](key) ? this[Associative.get](key) : def;
    },
    alter: function(key, fn) {
        return this[Associative.set](key, fn(this[Associative.get](key)));
    },
    alterOr: function(key, fn, def) {
        if (this[Associative.has](key)) {
            return this[Associative.update](key, fn);
        }
        return this[Associative.set](key, def);
    },
    isempty: [Monoid.isempty, function() {
        return this[Associative.size]() === 0;
    }],
}, [Keyed]);

module.exports = Associative;
