const Joi = require('joi');
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    genre: {
        type: String,
        min: 3,
        max: 30
    }
})

const Genre = mongoose.model('Genre', genreSchema);

exports.validateGenre = (genre) => {
    const schema = Joi.object({
        genre: Joi.string().min(3).required()
    })
    return schema.validate(genre);

};

exports.genreSchema = genreSchema;
exports.Genre = Genre;