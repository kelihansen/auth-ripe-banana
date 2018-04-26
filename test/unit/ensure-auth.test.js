const { assert } = require('chai');
const createEnsureAuth = require('../../lib/util/ensure-auth');
const tokenService = require('../../lib/util/token-service');

describe('ensure auth middleware', () => {

    const account = { _id: 1 };
    let token = '';
    beforeEach(() => token = tokenService.sign(account));

    const ensureAuth = createEnsureAuth();

    it('adds payload as req.account on success', done => {
        const req = {
            get(header) {
                if(header === 'Authorization') return token;
            }
        };

        const next = () => {
            assert.equal(req.account.id, account._id);
            done();
        };

        ensureAuth(req, null, next);
    });
});