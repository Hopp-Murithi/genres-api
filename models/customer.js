const Joi = require('joi');
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 30
    },
    phone: {
        type: String,
        minlength: 9
    },
    isGold: {
        type: Boolean
    }

})
const Customer = mongoose.model('customer', customerSchema)

module.exports = function validateCustomer(Customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        phone: Joi.string().min(9).required(),
        isGold: Joi.boolean().required()
    })
    return Joi.validate(Customer);

    console.log('validating customer')

};
module.exports.customerSchema = customerSchema;
module.exports.Customer = Customer