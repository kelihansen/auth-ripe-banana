const { assert } = require('chai');
const request = require('./request');
const { Types } = require('mongoose');
const { dropCollection } = require('./db');
const tokenService = require('../../lib/util/token-service');

describe('Reviewer API', () => {
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('reviews'));
    before(() => dropCollection('films'));
    before(() => dropCollection('accounts'));  
    
    let token = '';
    
    let coolHandLuke = {
        title: 'Cool Hand Luke',
        studio: Types.ObjectId(),
        released: 1967,
        cast: []
    };

    before(() => {
        return request.post('/films')
            .send(coolHandLuke)
            .then(({ body }) => {
                coolHandLuke = body;
            });
    });

    let siskel = {
        name: 'Gene Siskel',
        company: 'genesiskel.com',
        email: 'estate@genesiskel.com',
        password: '12345'
    };

    before(() => {
        return request.post('/auth/signup')
            .send(siskel)
            .then(({ body }) => {
                token = body.token;
                siskel._id = tokenService.verify(token).id;
            });
    });

    let ebert = {
        name: 'Roger Ebert',
        company: 'rogerebert.com',
        email: 'estate@rogerebert.com',
        password: 'password'
    };

    before(() => {
        return request.post('/auth/signup')
            .send(ebert)
            .then(({ body }) => {
                token = body.token;
                ebert._id = tokenService.verify(token).id;
            });
    });

    it('gets all reviewers', () => {
        return request.get('/reviewers')
            .then(({ body }) => {
                assert.deepEqual(body, [{
                    _id: siskel._id,
                    name: siskel.name,
                    company: siskel.company,
                    __v: 0
                }, {
                    _id: ebert._id,
                    name: ebert.name,
                    company: ebert.company,
                    __v: 0
                }]);
            });
    });

    it('gets a reviewer by id, including an array of their reviews', () => {
        let lukeReview = {
            rating: 5,
            review: 'It is a great film. On that most of us can agree.',
            film: coolHandLuke._id
        };
    
        return request.post('/reviews')
            .set('Authorization', token) 
            .send(lukeReview)
            .then(({ body }) => {
                lukeReview = body;
                return request.get(`/reviewers/${ebert._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, {
                    _id: ebert._id,
                    name: ebert.name,
                    company: ebert.company,
                    __v: 0,
                    reviews: [{ 
                        _id: lukeReview._id,
                        rating: lukeReview.rating,
                        review: lukeReview.review, 
                        film: {
                            _id: coolHandLuke._id,
                            title: coolHandLuke.title 
                        }
                    }]
                });
            });
    });

});