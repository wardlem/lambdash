const sumType = require('./sumType');
const _is = require('./internal/_is');
const _thunk = require('./internal/_thunk');

const ByteOrder = sumType('ByteOrder', {BE: [], LE: []});

ByteOrder.archEndianness = (function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
    const buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    return new Int16Array(buffer)[0] === 256 ? ByteOrder.LE : ByteOrder.BE;
}());

ByteOrder.archIsBE = _thunk(_is, ByteOrder.BE, ByteOrder.archEndianness);
ByteOrder.archIsLE = _thunk(_is, ByteOrder.LE, ByteOrder.archEndianness);

module.exports = ByteOrder;
