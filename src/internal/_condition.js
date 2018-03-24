module.exports = function(conditions) {
    const nextCondition = ([head, ...tail], args) => {
        if (typeof head !== 'function') {
            throw new RangeError('Condition did not have a match');
        }

        const [pred, res] = head;

        if (pred(...args)) {
            return res(...args);
        }

        return nextCondition(tail, args);
    };

    return function condition(...args) {
        return nextCondition(condition, args);
    };
};
