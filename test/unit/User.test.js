const { assert } = require('chai');
const User = require('../../lib/models/User');

describe('User model', () => {
    
    const info = {
        email: 'me@mail.com'
    };
    
    const password = '12345';

    // TODO validate model, but what about required hash?

    it('generates hash from password', () => {
        const user = new User(info);
        user.generateHash(password);
        assert.ok(user.hash);
        assert.notEqual(user.hash, password);
    });
});