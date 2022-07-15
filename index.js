const Joi = require('joi');
const express = require('express');
const movie = express();

movie.use(express.json());

const movies = [
    { id: 1, genre: 'movie1' },
    { id: 2, genre: 'movie2' },
    { id: 3, genre: 'movie3' },
    { id: 4, genre: 'movie4' },
]


/**
 *Returns Lists of movies
 */
movie.get('/vidly/genres', (req, res) => {
    res.send(movies)
});


movie.get('/vidly/genres/:id', (req, res) => {
    const genre = movies.find(m => m.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);
    res.send(genre);

});

/** 
 * Adds a new genre
 **/
movie.post('/vidly/genres', (req, res) => {
    const genre = {
        id: movies.length + 1,
        genre: req.body.genre
    };
    const { error } = validateMovie(genre);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };

    movies.push(genre);
    res.send(genre);

});

//update genre
movie.put('/vidly/genres/:id', (req, res) => {
    const genre = movies.find(m => m.id === parseInt(req.params.id));


    if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);


    const { error } = validateMovie(genre);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };

    genre.genre = req.body.genre;
    res.send(genre);

});

//delete genre
movie.delete('/vidly/genres/:id', (req, res) => {
    const genre = movies.find(m => m.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send(`The movie with ID ${req.params.id} was not found.`);

    const index = movies.indexOf(genre);
    movies.splice(index, 1);
    res.send(genre);

});


const port = process.env.PORT || 3000;

movie.listen(3000, () => {
    console.log(`Listening on port ${port}...`)
});

function validateMovie(movie) {
    const schema = Joi.object({
        id: Joi.optional(),
        genre: Joi.string().min(3).required()
    })
    return schema.validate(movie);

};