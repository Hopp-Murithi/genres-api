const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('../models/genres');


const Movies = mongoose.model('movie', new mongoose.Schema({
    genre: {
        type: genreSchema,
        required: true
    },
    title: {
        type: String,
        trim: true,
        min: 3,
        max: 255
    },
    name: {
        type: String,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true
    }

}))


exports.validateMovie = (movie) => {
    const schema = Joi.object({
        genreId: Joi.string().min(3).required(),
        title: Joi.string().min(3).required(),
        name: Joi.string().min(3).required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required()
    })
    return schema.validate(movie);

};

module.exports = Movies;
module.exports.genreSchema = genreSchema;