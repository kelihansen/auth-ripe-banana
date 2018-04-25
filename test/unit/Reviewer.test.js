const { assert } = require('chai');
const Reviewer = require('../../lib/models/Reviewer');
const { getErrors } = require('./helpers');

describe('Reviewer model', () => {
    it('is a good, valid model', () => {
        const info = {
            name: 'Roger Ebert',
            company: 'rogerebert.com',
        };

        const reviewer = new Reviewer(info);
        info._id = reviewer._id;
        assert.deepEqual(reviewer.toJSON(), info);
        assert.isUndefined(reviewer.validateSync());
    });

    it('has required fields', () => {
        const reviewer = new Reviewer({});
        const errors = getErrors(reviewer.validateSync(), 2);
        assert.strictEqual(errors.name.kind, 'required');
        assert.strictEqual(errors.company.kind, 'required');
    });
});