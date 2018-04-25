const { assert } = require('chai');
const Studio = require('../../lib/models/Studio');
const { getErrors } = require('./helpers');

describe('Studio model', () => {

    it('is a good, valid model', () => {
        const info = {
            name: 'Paramount Studios',
            address: {
                city: 'Los Angeles',
                state: 'California',
                country: 'USA'
            }
        };

        const studio = new Studio(info);
        info._id = studio._id;
        assert.deepEqual(studio.toJSON(), info);
        assert.isUndefined(studio.validateSync());

    });

    it('has required fields', () => {
        const studio = new Studio({});
        const errors = getErrors(studio.validateSync(), 1);
        assert.strictEqual(errors.name.kind, 'required');
    });
});
