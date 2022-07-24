const Joi = require('joi');
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


const Genre = mongoose.model('genre', new mongoose.Schema({
        genre: {
            type: String,
            minlength: 3,
            maxlength: 30
        }

    }))
    /**
     * @param req - requests genre from the database
     * @returns - returns the genre to the client
     */
router.get('', async(req, res) => {
    const movies = await Genre.find()
    res.send(movies)
});


router.get('/:id', async(req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);
    res.send(genre);

});

/** 
 * @param req - requests a new genre to be added to the database
 * @returns - returns the new genre to the client
 **/
router.post('', async(req, res) => {
    let genre = new Genre({ genre: req.body.genre });
    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };


    genre = await genre.save();
    res.send(genre);

});

/**
 * @param req - requests a movie to be updated in the database
 * @returns - returns the updated movie to the client
 */
router.put('/:id', async(req, res) => {
    const { error } = validateGenre(genre);
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (error) {
        return res.status(400).send(error.details[0].message);
    };

    if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);

    genre.name = req.body.name;
    res.send(genre);

});

/**
 * @param req - requests a movie to be deleted from the database
 *  @returns - returns the deleted movie to the client
 */
router.delete('/:id', async(req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);

    const index = genre.indexOf(genre);
    genre.splice(index, 1);
    res.send(genre);

});


function validateGenre(genre) {
    const schema = Joi.object({
        genre: Joi.string().min(3).required()
    })
    return schema.validate(genre);

};

module.exports = router;