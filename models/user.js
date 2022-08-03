const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    isAdmin: Boolean
})
userSchema.methods.getAuthTokens = function() {
    const token = jwt.send({ _id: this.id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema);

exports.validateUser = (User) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().min(4).max(255).required(),
        password: Joi.string().min(8).max(1024).required()
    })
    return schema.validate(User);

};
module.exports = User;