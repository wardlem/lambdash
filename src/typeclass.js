const _isFunction = require('./internal/_isFunction');
const _moduleFor = require('./internal/_moduleFor');
const _always = require('./internal/_always');
const _typecached = require('./internal/_typecached');
const _last = require('./internal/_last');

const alwaysEmpty = _always({});

const typeclass = function typeclass(Typeclass, def) {
    const {
        required = [],
        superTypes = [],
        deriveFn = alwaysEmpty,
        deriveProtoFn = alwaysEmpty,
    } = def;

    Typeclass.isImplementedBy = typeclass.createIsImplementedBy(required, superTypes);
    Typeclass.member = (v) => Typeclass.isImplementedBy(_moduleFor(v));
    Typeclass.deriveFor = typeclass.createDeriveFor(deriveFn, deriveProtoFn);

    return Typeclass;
};

typeclass.createDeriveFor = function(deriveFn, deriveProtoFn) {
    return function deriveFor(M, derivePrototype = true) {
        const methods = deriveFn(M);
        const protoMethods = deriveProtoFn(M);

        for (let key in methods) {
            if (typeof M[key] === 'undefined') {
                M[key] = methods[key];
            }
        }

        if (derivePrototype && M.prototype) {
            for (let key in protoMethods) {
                if (typeof M.prototype[key] === 'undefined') {
                    M.prototype[key] = protoMethods[key];
                }
            }
        }
    };
};

typeclass.createIsImplementedBy = function(required, superTypes) {

    return function(M) {
        return !!M
            && superTypes.reduce((res, SuperType) => res && SuperType.isImplementedBy(M), true)
            && required.reduce((res, fnName) => res && _isFunction(M[fnName]), true)
        ;
    };
};

typeclass.forward = (methodName, deriveFn) => {
    return (...args) => {
        const M = _moduleFor(_last(args));
        return deriveFn(M)[methodName](...args);
    };
};

module.exports = typeclass;
