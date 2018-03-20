const {expect} = require('code');

const Iterable = require('../../src/protocols/Iterable');


describe('Iterable', () => {
    describe('.iterator', () => {
        it('is a symbol', () => {
            expect(typeof Iterable.iterator).to.equal('symbol');
        });

        it('is equal to Symbol.iterator', () => {
            expect(Iterable.iterator).to.equal(Symbol.iterator);
        });
    });
});
