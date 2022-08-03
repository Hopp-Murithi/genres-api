const Joi = require('joi');
const mongoose = require('mongoose');



const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                min: 3,
                max: 255
            },
            phone: {
                type: String,
                required: true,
                min: 9,
                max: 15
            },
            isGold: {
                type: Boolean,
                default: false
            }
        }),
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                min: 3,
                max: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
            },
            numberInStock: {
                type: Number,
                required: true,
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now
    },
    dateReturned: {
        type: Date,
        default: Date.now
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}))


exports.validateRentals = (rental) => {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
    })
    return schema.validate(rental);

};

module.exports = Rental;