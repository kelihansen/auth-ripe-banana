const { assert } = require('chai');
const User = require('../../lib/models/User');
const { getErrors } = require('./helpers');

describe('User model', () => {
    
    const info = {
        email: 'me@mail.com'
    };
    
    const password = '12345';

    it('is a good, valid model', () => {
        const completeInfo = {
            email: 'me@mail.com',
            hash: 'nowMyPasswordIsSuperSecret'
        };

        const user = new User(completeInfo);
        completeInfo._id = user._id;
        assert.deepEqual(user.toJSON(), completeInfo);
    });

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

    it('compares password to hash', () => {
        const user = new User(info);
        user.generateHash(password);
        assert.ok(user.comparePassword(password));
    });
});