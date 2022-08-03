const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()


router.post('', async(req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        };
        let user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(404).send('Invalid email or password')
        const validPassword = bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(404).send('Invalid email or password');

        const token = user.getAuthTokens();
        res.send(token);

    } catch (err) {
        next(err);
    }


})
validate = (req) => {
    const schema = Joi.object({
        email: Joi.string().email().min(4).max(255).required(),
        password: Joi.string().min(8).max(1024).required()
    })
    return schema.validate(req);
}

module.exports = router;