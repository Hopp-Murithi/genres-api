const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


const Genre = mongoose.model('genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    }

}))




/**
 * @param req - requests movies from the database
 * @returns - returns the movies to the client
 * 
 */
router.get('/', async(req, res) => {
    const movies = await Genre.find()
    res.send(movies)
});


router.get('/:id', async(req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);
    res.send(genre);

});

/** 
 * @param req - requests a new movie to be added to the database
 * @returns - returns the new movie to the client
 **/
router.post('/', async(req, res) => {
    const { error } = validateMovie(genre);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };

    let genre = new Genre({ genre: req.body.genre });
    genre = await genre.save();
    res.send(genre);

});

/**
 * @param req - requests a movie to be updated in the database
 * @returns - returns the updated movie to the client
 */
router.put('/:id', async(req, res) => {
    const { error } = validateMovie(genre);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };
    const genre = await genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);

    genre.name = req.body.name;
    res.send(genre);

});

/**
 * @param req - requests a movie to be deleted from the database
 *  @returns - returns the deleted movie to the client
 */
router.delete('/:id', async(req, res) => {
    const genre = await genre.findByIdAndRemove({ _id: req.params.id });

    if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);

    const index = movies.indexOf(genre);
    movies.splice(index, 1);
    res.send(genre);

});


function validateMovie(movie) {
    const schema = Joi.object({
        id: Joi.optional(),
        genre: Joi.string().min(3).required()
    })
    return schema.validate(movie);

};

module.exports = router;