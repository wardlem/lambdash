function setIntersection(first, ...rest) {
    return rest.reduce((intersect, set) => {
        const res = new Set();
        for (let value of intersect) {
            if (set.has(value)) {
                res.add(value);
            }
        }

        return res;
    }, first);
}

module.exports = setIntersection;
