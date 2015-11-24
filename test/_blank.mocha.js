var assert = require('assert');

var _blank = require('../src/internal/_blank');

describe('_blank', function(){
    it ('should have a single non-enumerable property indicating its blankness', function(){
        assert.equal(Object.keys(_blank), 0);
        assert.equal(_blank['@@functional/blank'], true);
        for (var key in _blank) {
            assert(false);
        }
    });
});