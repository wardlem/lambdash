const Type = require('../Type');
const Show = require('../../protocols/Show');
const Protocol = require('../../protocols/Protocol');
const merge = require('../../util/mergeDescriptors');
const Clone = require('../../protocols/Clone');

const ErrorTypes = [
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
];

ErrorTypes.forEach((ErrorType) => {
    ErrorType[Type.has] = function has(value) {
        return value instanceof ErrorType;
    };


    merge(ErrorType.prototype, {
        [Show.show]() {
            return `new ${ErrorType.name}(${this.message[Show.show]()})`;
        },
        [Clone.clone]() {
            // TODO: this does not capture the stack...
            return new ErrorType(this.message);
        },
    });

    if (ErrorType === Error) {
        ErrorType[Type.supertype] = Object;
    } else {
        ErrorType[Type.supertype] = Error;
    }

    Protocol.implement(ErrorType, Show, Clone);
});

module.exports = Error;
