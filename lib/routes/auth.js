const router = require('express').Router();
const Account = require('../models/Account');

module.exports = router
    .post('/signup', (req, res, next) => {
        const { body } = req;
        const { email, password } = body;
        delete req.body.password;

        Account.find({ email })
            .count()
            .then(count => {
                if(count) console.log('email already in use');
                const account = new Account(body);
                account.generateHash(password);
                return account.save();
            })
            .then(account => {
                return account._id;
            })
            .then(token => res.json({ token }));
    });