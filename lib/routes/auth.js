const router = require('express').Router();
const Account = require('../models/Account');
const tokenService = require('../util/token-service');

module.exports = router
    .post('/signup', (req, res, next) => {
        const { body } = req;
        const { email, password } = body;
        delete body.password;

        Account.find({ email })
            .count()
            .then(count => {
                if(count) throw {
                    status: 400,
                    error: 'an account using that email already exists'
                };
                const account = new Account(body);
                account.generateHash(password);
                return account.save();
            })
            .then(account => {
                return account._id;
            })
            .then(token => res.json({ token }))
            .catch(next);
    })

    .post('/signin', (req, res, next) => {
        const { body } = req;
        const { email, password } = body;
        delete body.password;

        Account.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) throw {
                    status: 401,
                    error: 'invalid email or password'
                };
                res.json({ token: user._id });
            })
            .catch(next);            
    });