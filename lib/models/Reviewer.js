const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    name: RequiredString,
    company: RequiredString,
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }
});

module.exports = mongoose.model('Reviewer', schema);