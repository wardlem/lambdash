const {expect} = require('code');

const Ord = require('../../src/protocols/Ord');
const Eq = require('../../src/protocols/Eq');


describe('Ord', () => {
    describe('.equals', () => {
        it('is a symbol', () => {
            expect(typeof Ord.equals).to.equal('symbol');
        });

        it('is equal to Eq.equals', () => {
            expect(Ord.equals).to.equal(Eq.equals);
        });
    });
});
