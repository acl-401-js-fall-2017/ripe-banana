const assert = require('chai').assert;
const Film = require('../../lib/models/film');

describe('Film Model', () => {
    it('is a good model', () => {
        const film = new Film({
            title: 'The Princess Bride',
            studio: '59eb914ffcd9df5be2d25d22',
            released: 1987,
            cast: [{part: 'ROUS', actor: '59eb914ffcd9df5be2d25d18'}]
        });
        assert.equal(film.validateSync(), undefined);
    }),

    it('checks required fields', () => {
        const film = new Film({});
        const {errors} = film.validateSync();
        assert.equal(errors.title.kind, 'required');
        assert.equal(errors.studio.kind, 'required');
        assert.equal(errors.released.kind, 'required');
        // assert.equal(errors['cast[0].actor'].kind, 'required');
    });



});

