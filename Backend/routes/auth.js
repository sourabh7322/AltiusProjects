const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', [
    body('username').isLength({ min: 1 }).withMessage('Username must be have 1 character'),
    body('email').isEmail().withMessage("Invalid email format"),
    body('password').isLength({ min: 3 }).withMessage("Password must have 3 character")

], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    const { username, email, password } = req.body;
    try {
        let user = await User.find({ email });
        if (user) {
            return res.status(400).json({ msg: 'User Already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        const token = jwt.sign({ userID: user_id }, process.env.JWT_SECRET, { expiresIn: "6h" });
        res.status(201).json({ token });


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})


router.post('/login', [
    body('email').isEmail().withMessage("Invalid email format"),
    body('password').isLength({ min: 3 }).withMessage("Password must have 3 character")
], async (req, res) => {
    const errors = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Invalid Credentials' })
        }
        const isMatch = await bcrypt.hash(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credential" })
        }

        const token = jwt.sign({ userID: user_id }, process.env.JWT_SECRET, { expiresIn: "6h" });
        res.status(201).json({ token });


    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;