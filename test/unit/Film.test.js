const { assert } = require('chai');
const { Types } = require('mongoose');
const Film = require('../../lib/models/Film');
const { getErrors } = require('./helpers');

describe('Film model', () => {
    it('is a good, valid model', () => {

        const info = {
            title: 'The Incredibles',
            studio: Types.ObjectId(),
            released: 2004,
            cast: [{
                part: 'Violet Parr',
                actor: Types.ObjectId()
            }]
        };

        const film = new Film(info);
        info._id = film._id;
        info.cast[0]._id = film.cast[0]._id;
        assert.deepEqual(film.toJSON(), info);
        assert.isUndefined(film.validateSync());
    });

    it('has required fields', () => {
        const film = new Film({ cast: [{}] });
        const errors = getErrors(film.validateSync(), 4);
        assert.equal(errors.title.kind, 'required');
        assert.equal(errors.studio.kind, 'required');
        assert.equal(errors.released.kind, 'required');
        assert.equal(errors['cast.0.actor'].kind, 'required');
    });

    it('takes a 4-digit number as a release date', () => {

        const tooLowInfo = {
            title: 'test',
            studio: Types.ObjectId(),
            released: 18,
        };
        
        const tooHighInfo = {
            title: 'test',
            studio: Types.ObjectId(),
            released: 42418,
        };

        const tooLowFilm = new Film(tooLowInfo);
        const lowError = getErrors(tooLowFilm.validateSync(), 1);
        assert.equal(lowError.released.kind, 'min');
        
        const tooHighFilm = new Film(tooHighInfo);
        const highError = getErrors(tooHighFilm.validateSync(), 1);
        assert.equal(highError.released.kind, 'max');
    });

});