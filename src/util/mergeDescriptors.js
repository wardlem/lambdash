// adapted from https://github.com/component/merge-descriptors/blob/master/index.js
const hasOwnProperty = Object.prototype.hasOwnProperty;

function mergeDescriptors(dest, ...srcs) {
    let redefine = false;
    if (typeof srcs[srcs.length - 1] === 'boolean') {
        redefine = srcs[srcs.length - 1];
        srcs = srcs.slice(0, srcs.length - 1);
    }

    srcs.forEach((src) => {
        const props = Object.getOwnPropertyNames(src).concat(Object.getOwnPropertySymbols(src));
        props.forEach((prop) => {
            if (!redefine && hasOwnProperty.call(dest, prop)) {
                // skip
                return;
            }

            // copy
            const descriptor = Object.getOwnPropertyDescriptor(src, prop);
            Object.defineProperty(dest, prop, descriptor);
        });

    });

    return dest;
}

module.exports = mergeDescriptors;
