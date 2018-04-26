const router = require('express').Router();
const Account = require('../models/Account');
const { sign } = require('../util/token-service');
const createEnsureAuth = require('../util/ensure-auth');


module.exports = router

    .get('/verify', createEnsureAuth(), (req, res) => {
        res.json({ verified: true });
    })

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
                res.json({ token: sign(account) });
            })
            .catch(next);
    })

    .post('/signin', (req, res, next) => {
        const { body } = req;
        const { email, password } = body;
        delete body.password;

        Account.findOne({ email })
            .then(account => {
                if(!account || !account.comparePassword(password)) throw {
                    status: 401,
                    error: 'invalid email or password'
                };
                res.json({ token: sign(account) });
            })
            .catch(next);            
    });