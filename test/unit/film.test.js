const assert = require('chai').assert;
const Film = require('../../lib/models/film');

describe('film model', () => {
    
    it('ensures invalid films are not accepted', () => {
        return new Film().validate()
            .then(() => { throw new Error('Expected validation to fail'); },
                err => {
                    const error = err.errors;
    
                    assert.ok(error.released && error.released.kind === 'required');
                    assert.ok(error.studio && error.studio.kind === 'required');
                    assert.ok(error.title && error.title.kind === 'required');
                });
    });

    it('validates a good model', () => {
        const titanic = new Film({ title: 'Titanic', studio: '590643bc2cd3da2808b0e651', released: 1998 });
    
        return titanic.validate();
    });
    
});    
