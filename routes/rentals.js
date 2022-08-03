const { Rental, validateCustomer } = require('../models/rental');
const auth = require('../middleware/auth');
const movie = require('../models/movies');
const Customer = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @param req - requests genre from the database
 * @returns - returns the genre to the client
 */
router.get('', async(req, res, next) => {
    try {
        const rentals = await Rental.find().sort('-dateOut');
        res.send(rentals)
    } catch {
        next(err);
    }
});


/** 
 * @param req - requests a new genre to be added to the database
 * @returns - returns the new genre to the client
 **/
router.post('', auth, async(req, res, next) => {
    try {
        const { error } = validateMovie(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        };
        const Customer = await Customer.findById(req.body.customerId);
        if (!Customer) return res.status(404).send(`The customer with ID ${req.body.customerId} was not found.`);

        const movie = await movie.findById(req.body.movieId);
        if (!movie) return res.status(404).send(`The movie with ID ${req.body.movieId} was not found.`);

        if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

        let rental = new Rental({
            customer: {
                _id: Customer._id,
                name: Customer.name,
                phone: Customer.phone,
                isGold: Customer.isGold,
                date: Customer.date
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        rental = await rental.save();

        movie.numberInStock--;
        movie.save();

        res.send(rental);

    } catch {
        next(err);
    }

});
/**
 * @params - id - requests for the Id of a specific rental.
 * @returns - rental info for a given id
 */

router.get('/:id', async(req, res, next) => {
    try {
        const rental = await rental.findById(req.params.id);
        if (!rental) return res.status(404).send(`The rental with ID ${req.params.id} was not found.`);
        res.send(rental);
    } catch {
        next(err);
    }
});

module.exports = router;