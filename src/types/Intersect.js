const Type = require('./Type');

const nameFunction = require('../util/nameFunction');
const setIntersection = require('../util/setIntersection');
const _isFunction = require('../internal/_isFunction');

const Intersect = module.exports;

Intersect.define = function defineIntersect(name, subtypes) {
    const ThisIntersect = _isFunction(name) ? name : nameFunction(name, function() {
        throw new TypeError(`${name} should not be called`);
    });
    name = ThisIntersect.name;

    ThisIntersect[Type.has] = function has(value) {
        for (let subtype of subtypes) {
            if (subtype[Type.has](value)) {
                return true;
            }
        }

        return false;
    };

    Object.defineProperty(ThisIntersect, Type.implements, {
        enumerable: false,
        get: () => {
            const subTypeImplements = subtypes.map((subtype) => subtype[Type.implements] || new Set());
            return setIntersection(...subTypeImplements);
        },
    });

    ThisIntersect[Type.subtypes] = subtypes;

    return ThisIntersect;
};
