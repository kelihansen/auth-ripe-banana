const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    email: RequiredString,
    hash: RequiredString
});

schema.methods = {
    generateHash(password) {
        this.hash = bcrypt.hashSync(password, 8);
    }
};

module.exports = mongoose.model('User', schema);