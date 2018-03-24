const merge = require('../util/mergeDescriptors');

const nameFunction = require('../util/nameFunction');
const _isFunction = require('../internal/_isFunction');
const _isObject = require('../internal/_isObject');

const Type = require('./Type');
const Product = require('./Product');

const Protocol = require('../protocols/Protocol');
const Case = require('../protocols/Case');
const Eq = require('../protocols/Eq');

const Sum = module.exports;

Sum.define = function defineSum(name, definition, options = {}) {
    const {
        writable = false,
        supertype = Object,
    } = options;

    const names = Object.keys(definition);

    const ThisSum = _isFunction(name) ? name : nameFunction(name, function() {
        throw new TypeError(`${name} should not be called...use one of its subtype constructors instead`);
    });
    name = ThisSum.name;

    const subtypes = [];

    names.forEach((subname) => {
        let def = definition[subname];
        if (_isFunction(def)) {
            def = [def];
        } else if (def == null) {
            def = [];
        } else if (!_isObject(def)) {
            throw new TypeError(`Defintion for ${name}.${subname} must be an object or a function`);
        }

        let isWritable = writable;
        if (Array.isArray(writable)) {
            if (writable.includes(subname)) {
                isWritable = true;
            } else {
                isWritable = writable
                    .filter(value => value.startsWith(`${subname}.`))
                    .map((value) => value.substr(subname.length + 1));
            }
        }

        const SubType = Product.define(subname, def, {
            supertype: ThisSum,
            writable: isWritable,
        });

        subtypes.push(SubType);
        ThisSum[subname] = Object.keys(def).length ? SubType : SubType();
    });


    ThisSum[Type.has] = function has(obj) {
        return obj instanceof ThisSum;
    };

    if (supertype !== Object) {
        ThisSum.prototype = Object.create(supertype && supertype.prototype);
        ThisSum.prototype.constructor = ThisSum;
    }

    merge(ThisSum.prototype, {
        [Case.case](cases) {
            const c = this.constructor.name;

            if (cases.hasOwnProperty(c)) {
                if (_isFunction(cases[c])) {
                    return cases[c](...this);
                } else {
                    return cases[c];
                }
            } else if (cases.hasOwnProperty(Case.default)) {
                if (_isFunction(cases[Case.default])) {
                    return cases[Case.default](this);
                } else {
                    return cases[Case.default];
                }
            }

            throw new TypeError(`Missing case for ${c} when matching for sum type ${name}`);
        },
    });

    ThisSum[Type.subtypes] = subtypes;

    Protocol.implement(ThisSum, Eq, Case);

    return ThisSum;
};
