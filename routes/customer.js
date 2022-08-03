const express = require('express');
const auth = require('../middleware/auth');
const _ = require('lodash');
const { Customer, validateCustomer } = require('../models/customer');
const router = express.Router();
const mongoose = require('mongoose');
const admin = require('../middleware/admin');


/**
 * @param req - requests customer details from the database
 * @returns - returns the customer details to the client
 * 
 */
router.get('', async(req, res, next) => {
    try {
        const customer = await Customer.find()
        res.send(customer)
    } catch (err) {
        next(err);
    }
});


router.get('/:id', async(req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).send(`The customer with ID ${req.params.id} was not found.`);
        res.send(customer);
    } catch (err) {
        next(err);
    }


});

/** 
 * @param req - requests a new customer to be added to the database
 * @returns - returns the new customer added to the database
 **/
router.post('', async(req, res, next) => {
    try {
        let customer = new Customer(_.pick(req.body, ['name', 'phone', 'isGold']));
        const { error } = validateCustomer(Customer);
        if (error) {
            return res.status(400).send(error.details[0].message);
        };
        customer = await customer.save();
        res.send(customer);
    } catch (err) {
        next(err);
    }


});

/**
 * @param req - requests for a customer to be updated from the database
 * @returns - returns the updated customer details.
 */
router.put('/:id', auth, async(req, res, next) => {
    try {
        const { error } = validateCustomer(Customer);
        if (error) {
            return res.status(400).send(error.details[0].message);
        };
        const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold }, { new: true });
        if (!Customer) return res.status(404).send(`The customer with ID ${req.params.id} was not found.`);

        Customer.name = req.body.name;
        res.send(customer);
    } catch (err) {
        next(err);

    }


});


/**
 * @param req - requests a movie to be deleted from the database
 *  @returns - returns the deleted movie to the client
 */
router.delete('/:id', [auth, admin], async(req, res, next) => {
    try {
        const customer = await Customer.findByIdAndRemove({ _id: req.params.id });

        if (!customer) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);

        const index = Customer.indexOf(customer);

        Customer.splice(index, 1);
        res.send(customer);

    } catch (err) {
        next(err)
    }

});


module.exports = router;