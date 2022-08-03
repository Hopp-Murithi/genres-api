const User = require('../models/user');
const auth = require('../middleware/auth')
const bcrypt = require("bcrypt");
const _ = require("lodash");
const validateUser = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async(req, res, next) => {
    try {
        const currentUser = await User.findOne(req.user._id).select('-password');
        res.send(currentUser);
    } catch (err) {
        next(err);
    }
})

router.post("", async(req, res, next) => {
    try {
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(404).send(`The email ${user.email} is already used`);
        user = new User(_.pick(req.body, ["name", "email", "password"]));
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = user.getAuthTokens();
        res.header('x-auth-token', token).send(_.pick(user, ["name", "email"]));
    } catch (err) {
        next(err);
    }

});
module.exports = router;