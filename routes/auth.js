// routes/auth.js
const express = require('express');
const passport = require('../middleware/passport'); // Import passport instance
const router = express.Router();

// User registration
router.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        return res.json({ message: 'Registration successful' });
    })(req, res, next);
});

// User login
router.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!user) {
            return res.status(400).json({ message: 'Email not found or incorrect password' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            return res.json({ message: 'Login successful' });
        });
    })(req, res, next);
});

module.exports = router;
