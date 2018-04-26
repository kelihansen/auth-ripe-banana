const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Auth API', () => {
    
    beforeEach(() => dropCollection('accounts'));

    let token = null;

    beforeEach(() => {
        return request.post('/auth/signup')
            .send({
                email: 'me@mail.com',
                password: '12345'
            })
            .then(({ body }) => token = body.token);
    });

    it('has a working signup route', () => {
        assert.ok(token);
    });

    it('has a working signin route', () => {
        return request.post('/auth/signin')
            .send({
                email: 'me@mail.com',
                password: '12345'
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });
    });
});