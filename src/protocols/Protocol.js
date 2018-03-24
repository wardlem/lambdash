const nameFunction = require('../util/nameFunction');

const Type = require('../types/Type');

const Protocol = module.exports;

Protocol.define = function defineProtocol(name, methods, extend = []) {
    const ThisProtocol = nameFunction(name, function() {});

    const requiredMethods = new Set();
    const allMethods = new Set();
    const keyMap = new Map();
    const methodMap = new Map();

    extend.forEach((Extended) => {
        const extendedMethods = Extended[Protocol.allmethods];
        const extendedMap = Extended[Protocol.keymap];

        // add all the supertype symbols to the new protocol
        for (let key of extendedMethods) {
            const keyStr = extendedMap.get(key);
            ThisProtocol[keyStr] = key;
        }
    });

    Object.keys(methods).forEach((key) => {
        let implementation = methods[key];
        let keySymbol;
        if (Array.isArray(implementation)) {
            [keySymbol, implementation] = implementation;
        } else {
            keySymbol = typeof implementation === 'symbol' ? implementation : Symbol(`${name}.${key}`);
        }

        ThisProtocol[key] = keySymbol;

        if (typeof implementation !== 'function') {
            requiredMethods.add(keySymbol);
        } else {
            methodMap.set(keySymbol, implementation);
        }

        allMethods.add(keySymbol);

        keyMap.set(keySymbol, key);
    });

    ThisProtocol.implement = function implement(Implementor) {
        if (ThisProtocol.implementedby(Implementor)) {
            // already implemented
            return;
        }

        for (let key of allMethods) {
            if (typeof Implementor.prototype[key] !== 'function') {
                if (requiredMethods.has(key)) {
                    throw new TypeError(`${Implementor.name} cannot not implement ${name} because it is missing the ${name}.${keyMap.get(key)} method.`);
                } else {
                    Implementor.prototype[key] = methodMap.get(key);
                }
            }
        }

        // must implement supertypes
        extend.forEach((Extended) => {
            Extended.implement(Implementor);
        });

        if (!(Implementor[Type.implements] instanceof Set)) {
            Object.defineProperty(Implementor, Type.implements, {
                enumerable: false,
                value: new Set(),
            });
        }

        Implementor[Type.implements].add(ThisProtocol);

    };

    ThisProtocol.implementedby = function implementedby(Implementor) {
        // Object.create(null) object
        if (Implementor == null) {
            return false;
        }

        if (!(Implementor[Type.implements] instanceof Set)) {
            return false;
        }

        if (Implementor[Type.supertype]) {
            // This exists primarily for sum types
            return Implementor[Type.implements].has(this) || ThisProtocol.implementedby(Implementor[Type.supertype]);
        } else {
            return Implementor[Type.implements].has(this);
        }
    };

    ThisProtocol[Type.has] = function has(obj) {
        if (obj == null) {
            return false;
        }

        return ThisProtocol.implementedby(obj.constructor);
    };

    // TODO: freeze the sets... requires overriding the methods on the instance
    ThisProtocol[Protocol.allmethods] = allMethods;
    ThisProtocol[Protocol.requiredmethods] = requiredMethods;
    ThisProtocol[Protocol.keymap] = keyMap;

    return ThisProtocol;
};

Protocol.allmethods = Symbol('Protocol.allmethods');
Protocol.requiredmethods = Symbol('Protocol.requiredmethods');
Protocol.implements = Type.implements;
Protocol.keymap = Symbol('Protocol.keymap');

Protocol.implement = function implement(Type, ...Protocols) {
    Protocols.forEach((Proto) => Proto.implement(Type));
};
