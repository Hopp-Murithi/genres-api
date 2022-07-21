const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const genres = require('./routes/genres');
const movie = express();

movie.use(express.json());
genres.use('/vidly/genres/', genres);
mongoose .connect("mongodb://localhost/vidly")
.then(() => console.log("connected to mongodb..."))
.catch((err) => console.error("could not connect to mongodb...", err));





const port = process.env.PORT || 3000;

movie.listen(3000, () => {
    console.log(`Listening on port ${port}...`)
});