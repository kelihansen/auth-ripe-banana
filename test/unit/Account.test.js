const { assert } = require('chai');
const Account = require('../../lib/models/Account');
const { getErrors } = require('./helpers');

describe('Account model', () => {
    
    it('is a good, valid model', () => {
        const completeInfo = {
            email: 'me@mail.com',
            hash: 'nowMyPasswordIsSuperSecret'
        };
        
        const account = new Account(completeInfo);
        completeInfo._id = account._id;
        assert.deepEqual(account.toJSON(), completeInfo);
    });
    
    it('has required fields', () => {
        const account = new Account({});
        const errors = getErrors(account.validateSync(), 2);
        assert.strictEqual(errors.email.kind, 'required');
        assert.strictEqual(errors.hash.kind, 'required');
    });
    
    const info = {
        email: 'me@mail.com'
    };
    
    const password = '12345';

    it('generates hash from password', () => {
        const account = new Account(info);
        account.generateHash(password);
        assert.ok(account.hash);
        assert.notEqual(account.hash, password);
    });

    it('compares password to hash', () => {
        const account = new Account(info);
        account.generateHash(password);
        assert.ok(account.comparePassword(password));
    });
});