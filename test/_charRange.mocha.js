var assert = require('assert');

var _charRange = require('../src/internal/_charRange');

describe('_charRange', function() {
    it('should create a range of characters', function() {
        var range = _charRange('A', 3);
        assert(Array.isArray(range));
        assert.equal(range.length, 3);
        assert.equal(range[0], 'A');
        assert.equal(range[1], 'B');
        assert.equal(range[2], 'C');
    });
});
