// middleware/auth.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const keys = require('../config/keys');

module.exports = function(passport) {
    // Local Strategy for email and password login
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email }).then(user => {
            if (!user) return done(null, false, { message: 'Email not found' });

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) return done(null, user);
                else return done(null, false, { message: 'Incorrect password' });
            });
        }).catch(err => console.log(err));
    }));

    // JWT Strategy for token-based authentication
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = keys.secretOrKey;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id).then(user => {
            if (user) return done(null, user);
            return done(null, false);
        }).catch(err => console.log(err));
    }));
};
