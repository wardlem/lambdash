const merge = require('../util/mergeDescriptors');
const nameFunction = require('../util/nameFunction');
const setFunctionLength = require('../util/setFunctionLength');
const _isFunction = require('../internal/_isFunction');
const _isDefined = require('../internal/_isDefined');

const Type = require('./Type');
const Protocol = require('../protocols/Protocol');
const Eq = require('../protocols/Eq');
const Iterable = require('../protocols/Iterable');
const Show = require('../protocols/Show');

const Product = module.exports;

Product.define = function defineProduct(name, definition, options = {}) {
    const {
        writable = false,
        supertype = null,
    } = options;

    let tags = Object.keys(definition);

    const constraints = tags.map((tag) => {
        const constraint = definition[tag];
        return constraint != null && _isFunction(constraint[Type.has])
            ? constraint[Type.has]
            :  _isFunction(constraint)
                ? constraint
                :  _isDefined;
    });

    if (Array.isArray(definition)) {
        tags = tags.map((tag) => `_${tag}`);
    }

    const ThisProduct = nameFunction(name, function ThisProduct(...args) {
        const instance = tags.reduce((instance, tag, ind) => {
            if (!constraints[ind](args[ind])) {
                throw new TypeError(`Invalid value for property ${tag} when creating a new ${name} instance`);
            }

            const isWritable = Array.isArray(writable) ? writable.includes(tag) : Boolean(writable);

            Object.defineProperty(instance, tag, {
                configurable: false,
                enumerable: true,
                get: () => args[ind],
                set: isWritable
                    ? (value) => {
                        if (!constraints[ind](value)) {
                            throw new TypeError(`Invalid value set for property ${tag} of ${name} instance`);
                        }
                        args[ind] = value;
                    }
                    : () => {throw new TypeError(`Cannot set immutable property ${tag} of ${name} instance`);},
            });

            Object.defineProperty(instance, ind, {
                configurable: false,
                enumerable: false,
                get: () => instance[tag],
                set: (value) => {instance[tag] = value;},
            });

            return instance;

        }, {__proto__: ThisProduct.prototype});

        if (!Object.prototype.hasOwnProperty.call(instance, 'length')) {
            Object.defineProperty(instance, 'length', {
                configurable: false,
                enumerable: false,
                writable: false,
                value: tags.length,
            });
        }

        return instance;
    });

    ThisProduct.from = function from(obj) {
        if (Array.isArray(obj)) {
            return ThisProduct(...obj);
        } else {
            const values = tags.map((tag) => obj[tag]);
            return ThisProduct(...values);
        }
    };

    ThisProduct[Type.has] = function has(obj) {
        return obj instanceof ThisProduct;
    };

    if (supertype !== Object) {
        ThisProduct.prototype = Object.create(supertype && supertype.prototype);
        ThisProduct.prototype.constructor = ThisProduct;
    }

    merge(ThisProduct.prototype, {
        [Eq.equals](other) {
            if (this === other) {
                return true;
            } else if (!ThisProduct[Type.has](other)) {
                return false;
            } else {
                for (const tag of tags) {
                    const l = this[tag];
                    const r = other[tag];

                    if (Eq[Type.has](l)) {
                        if (l[Eq.notEquals](r)) {
                            return false;
                        }
                    } else if (l !== r) {
                        return false;
                    }
                }

                return true;
            }
        },
        [Iterable.iterator]() {
            const arr = tags.map((tag) => this[tag]);
            return arr[Iterable.iterator]();
        },
        [Show.show]() {
            const innerValues = Array.from(this).map((value) => {
                if (value != null && typeof value[Show.show] === 'function') {
                    return value[Show.show]();
                }
                return String(value);
            });
            return `${name}(${innerValues.join(', ')})`;
        },
    });

    // TODO: evaluate if this is correct
    ThisProduct[Type.supertype] = supertype;

    setFunctionLength(tags.length, ThisProduct);

    Protocol.implement(ThisProduct, Eq, Iterable, Show);

    return ThisProduct;
};
