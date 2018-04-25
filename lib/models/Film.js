const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString, RequiredNumber } = require('../util/mongoose-helpers');

const schema = new Schema({ 
    title: RequiredString,
    studio: {
        type: Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    released: {
        ...RequiredNumber,
        min: 1000,
        max: 9999
    },
    cast: [{
        part: String,
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'Actor',
            required: true
        }
    }]
});

module.exports = mongoose.model('Film', schema);