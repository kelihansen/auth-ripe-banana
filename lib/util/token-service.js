const jwt = require('jsonwebtoken');
const APP_SECRET = process.env.APP_SECRET || 'temporarySecret';

module.exports = {
    sign(account) {
        const payload = {
            id: account._id,
            roles: account.roles
        };

        return jwt.sign(payload, APP_SECRET);
    },
    verify(token) {
        return jwt.verify(token, APP_SECRET);
    }
};