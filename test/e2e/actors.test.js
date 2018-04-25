const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');

describe('Actor API', () => {
    before(() => dropCollection('actors'));

    let emma = {
        name: 'Emma Thompson',
        dob: new Date(1959, 3, 15).toJSON(),
        pob: 'London, UK'
    };

    let paul = {
        name: 'Paul Newman',
        dob: new Date(1925, 0, 26).toJSON(),
        pob: 'Shaker Heights, OH, USA'
    };

    it('saves an actor', () => {
        return request.post('/actors')
            .send(emma)
            .then(({ body }) => {
                const { _id, __v
                } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...emma,
                    _id,
                    __v
                });
                emma = body;
            });
    });
    
    const getFields = ({ _id, name }) => ({ _id, name });

    it('get all actors', () => {
        return request.post('/actors')
            .send(paul)
            .then(({ body }) => {
                paul = body;
                return request.get('/actors');
            })
            .then(({ body }) => {
                assert.deepEqual(body, [emma, paul].map(getFields));
            });

    });

    it('gets an actor by id, including their films', () => {
        let sense = {
            title: 'Sense and Sensibility',
            studio: Types.ObjectId(),
            released: 1995,
            cast: [{
                part: 'Elinor Dashwood',
                actor: emma._id
            }]
        };
        return request.post('/films')
            .send(sense)
            .then(({ body }) => {
                sense = body;
                return request.get(`/actors/${emma._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, { 
                    ...emma,
                    films: [{
                        _id: sense._id,
                        title: sense.title,
                        released: sense.released
                    }] 
          
                }); 
            });
    });

    it('updates an actor', () => {
        emma.pob = 'Paddington, London, England';

        return request.put(`/actors/${emma._id}`)
            .send(emma)
            .then(({ body }) => {
                assert.deepEqual(body, emma);
            });

    });

    it('will not delete an actor in a film', () => {
        
        return request.delete(`/actors/${emma._id}`)
    
            .then(response => {
                assert.strictEqual(response.status, 400);
                assert.include(response.body.error,  'cannot');
            });
    });
    
    it('deletes an actor by id', () => {
        return request.delete(`/actors/${paul._id}`)
            .then(() => {
                return request.get(`/actors/${paul._id}`);
            })
            .then(res => {
                assert.strictEqual(res.status, 404);
            });
    });

    it('returns 404 if id not found', () => {
        return request.get(`/actors/${paul._id}`)
            .then(response => {
                assert.equal(response.status, 404);
            });

    });

});

