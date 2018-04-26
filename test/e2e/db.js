const connect = require('../../lib/util/connect');
const mongoose = require('mongoose');
const request = require('./request');

before(() => connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movies-test'));
after(() => mongoose.connection.close());

module.exports = {
    dropCollection(name) {
        return mongoose.connection.dropCollection(name)
            .catch(err => {
                if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    },

    createToken(info = { email: 'me@mail.com', password: '12345', name: 'Madame Reviewer', company: 'ireview.com' }) {
        return request.post('/auth/signup')
            .send(info)
            .then(({ body }) => body.token);
    }
};