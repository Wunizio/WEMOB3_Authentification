'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var playerSchema = new Schema({
    name:{
        type: String,
        required: true,
        index: {unique:true}
    },
    password:{
        type: String,
        required: true
    },
    salt:{
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
});

module.exports = mongoose.model('Player', playerSchema);

playerSchema.method.setPassword = function(password){
    this.salt = crypto.randomBytes(32).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

playerSchema.method.validatePassword = function(password){
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === hash;
};