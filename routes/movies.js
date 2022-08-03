const { movie, validateMovie } = require('../models/movies');
const auth = require('../middleware/auth');
const { genre } = require('../models/genres');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @param req - requests genre from the database
 * @returns - returns the genre to the client
 */
router.get('', async(req, res, next) => {
    try {
        const movies = await movie.find()
        res.send(movies)
    } catch (err) {
        next(err);
    }
});


router.get('/:id', async(req, re, next) => {
    try {
        const movie = await movie.findById(req.params.id);
        if (!movie) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);
        res.send(movie);
    } catch (err) {
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
        const genres = await genre.findById(req.body.genreId);
        if (!genres) return res.status(404).send(`The genre with ID ${req.body.genreId} was not found.`);

        let movie = new movie({
            genre: {
                _id: genres._id,
                name: genres.name
            },
            name: req.body.name,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        movie = await movie.save();
        res.send(movie);

    } catch (err) {
        next(err);
    }

});

/**
 * @param req - requests a movie to be updated in the database
 * @returns - returns the updated movie to the client
 */
router.put('/:id', auth, async(req, res, next) => {
    try {
        const { error } = validateMovie(movie);
        const movie = await movie.findByIdAndUpdate(req.params.id, {
            genre: req.body.genre,
            name: req.body.name,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }, { new: true });
        if (error) {
            return res.status(400).send(error.details[0].message);
        };

        if (!movie) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);

        movie.name = req.body.name;
        movie.genre = req.body.genre;
        movie.numberInStock = req.body.numberInStock;
        movie.dailyRentalRate = req.body.dailyRentalRate;
        res.send(movie);

    } catch (err) {
        next(err);
    }
});

/**
 * @param req - requests a movie to be deleted from the database
 *  @returns - returns the deleted movie to the client
 */
router.delete('/:id', auth, async(req, res, next) => {
    try {
        const movie = await movie.findByIdAndRemove(req.params.id);

        if (!movie) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);

        const index = movie.indexOf(movie);
        movie.splice(index, 1);
        res.send(movie);
    } catch (err) {
        next(err);
    }

});



module.exports = router;