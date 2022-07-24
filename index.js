const mongoose = require('mongoose');
const express = require('express');
const movies = require('./routes/movies');
const genres = require('./routes/genres');
const customers = require('./routes/customer');
const app = express();

app.use(express.json());
app.use('/api/genres/', genres);
app.use('/api/movies/', movies);
app.use('/api/customers/', customers);
mongoose.connect("mongodb://localhost/vidly")
    .then(() => console.log("connected to mongodb..."))
    .catch((err) => console.error("could not connect to mongodb...", err));


const port = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`Listening on port ${port}...`)
});