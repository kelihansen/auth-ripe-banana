const { assert } = require('chai');
const User = require('../../lib/models/User');
const { getErrors } = require('./helpers');

describe('User model', () => {
    
    const info = {
        email: 'me@mail.com'
    };
    
    const password = '12345';

    it('has required fields', () => {
        const user = new User({});
        const errors = getErrors(user.validateSync(), 2);
        assert.strictEqual(errors.email.kind, 'required');
        assert.strictEqual(errors.hash.kind, 'required');
    });

    it('generates hash from password', () => {
        const user = new User(info);
        user.generateHash(password);
        assert.ok(user.hash);
        assert.notEqual(user.hash, password);
    });

});