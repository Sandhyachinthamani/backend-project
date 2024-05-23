// routes/users.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');

// Get current user profile
router.get('/profile', passport.authenticate('jwt', { session: false }), userController.getUserProfile);

// Edit user profile
router.put('/profile', [passport.authenticate('jwt', { session: false }), upload.single('profilePhoto')], userController.editUserProfile);

// List public profiles
router.get('/public', userController.listPublicProfiles);

// Admin view all profiles
router.get('/admin', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
}, userController.adminViewAllProfiles);

module.exports = router;
