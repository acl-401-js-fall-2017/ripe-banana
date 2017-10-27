const { assert } = require('chai');
const Film = require('../../lib/models/film');


describe('Film test', () => {
    
    const film = new Film({
        title: 'dog anime',
        studio: '59ef87b38e62d836e1c0ee48',
        released: 2001,
        cast : [{
            actor: '59ef87b38e62d836e1c0ee47'
        }]
    });

    it('should validate a good model', () => {

        const validate = film.validateSync();

        assert.equal(validate, undefined);

    });

    it('should return error if title not provided', () => {
        let badFilm = new Film({});

        const { errors } = badFilm.validateSync();

        assert.equal(errors.title.kind, 'required');
    });

    it('should return error if invalid studio id', () => {
        let badFilm = new Film({
            title: 'teen cop',
            studio: '59ef87b38e62d836e1c0ee4',
            released: 2999,
            cast : [{
                actor: '59ef87b38e62d836e1c0ee47'
            }]
        });

        const { errors } = badFilm.validateSync();

        assert.equal(errors.studio.kind, 'ObjectID');
    });

    it('should return error if invalid actor id', () => {
        let badFilm = new Film({
            title: 'blackfish 2: vengeance',
            studio: '59ef87b38e62d836e1c0ee48',
            released: 3001,
            cast : [{
                actor: '5'
            }]
        });

        const { errors } = badFilm.validateSync();

        assert.equal(errors['cast.0.actor'].kind, 'ObjectID');
    });

    it('should return error if release year not provided', () => {
        let badFilm = new Film({
            title: 'the bloodening',
            studio: '59ef87b38e62d836e1c0ee48',
            cast : [{
                actor: '59ef87b38e62d836e1c0ee40'
            }]
        });

        const { errors } = badFilm.validateSync();

        assert.equal( errors.released.kind, 'required');
    });


});