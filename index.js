const Joi = require('joi');
const express = require('express');
const genres = require('./routes/genres');
const movie = express();

movie.use(express.json());
genres.use('/vidly/genres/', genres);



const port = process.env.PORT || 3000;

movie.listen(3000, () => {
    console.log(`Listening on port ${port}...`)
});