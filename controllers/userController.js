// controllers/userController.js
const User = require('../models/User');
const upload = require('../middleware/upload');

// Get user profile
exports.getUserProfile = (req, res) => {
    User.findById(req.user.id).then(user => {
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }).catch(err => console.log(err));
};

// Edit user profile
exports.editUserProfile = (req, res) => {
    const { name, bio, phone, email, isPublic } = req.body;
    User.findById(req.user.id).then(user => {
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.bio = bio || user.bio;
        user.phone = phone || user.phone;
        user.email = email || user.email;
        user.isPublic = isPublic !== undefined ? isPublic : user.isPublic;

        if (req.file) user.profilePhoto = req.file.path;

        user.save().then(updatedUser => res.json(updatedUser)).catch(err => console.log(err));
    }).catch(err => console.log(err));
};

// List public profiles
exports.listPublicProfiles = (req, res) => {
    User.find({ isPublic: true }).select('-password').then(users => res.json(users)).catch(err => console.log(err));
};

// Admin view all profiles
exports.adminViewAllProfiles = (req, res) => {
    User.find().select('-password').then(users => res.json(users)).catch(err => console.log(err));
};
