const { Genre, validateGenre } = require('../models/genres');
const auth = require('../middleware/auth');
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const admin = require('../middleware/admin');


/**
 * @param req - requests genre from the database
 * @returns - returns the genre to the client
 */
router.get('', async(req, res, next) => {
    try {
        const movies = await Genre.find()
        res.send(movies)
    } catch (err) {
        next(err);
    }


});


router.get('/:id', async(req, res, next) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);
        res.send(genre);

    } catch (err) {
        next(err)
    }


});

/** 
 * @param req - requests a new genre to be added to the database
 * @returns - returns the new genre to the client
 **/
router.post('', auth, async(req, res, next) => {
    try {
        let genre = new Genre({ genre: req.body.genre });
        const { error } = validateGenre(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        };


        genre = await genre.save();
        res.send(genre);
    } catch (err) {
        next(err)
    }

});

/**
 * @param req - requests a movie to be updated in the database
 * @returns - returns the updated movie to the client
 */
router.put('/:id', auth, async(req, res) => {
    try {
        const { error } = validateGenre(genre);
        const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (error) {
            return res.status(400).send(error.details[0].message);
        };

        if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);

        genre.name = req.body.name;
        res.send(genre);
    } catch (err) {
        res.status(500).send('something went wrong...')
    }
});

/**
 * @param req - requests a movie to be deleted from the database
 *  @returns - returns the deleted movie to the client
 */
router.delete('/:id', [auth, admin], async(req, res, next) => {
    try {
        const genre = await Genre.findByIdAndRemove(req.params.id);

        if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);

        const index = genre.indexOf(genre);
        genre.splice(index, 1);
        res.send(genre);

    } catch (err) {
        next(err);
    }

});


module.exports = router;