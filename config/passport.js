const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
    }, 
    function(username, password, done) {
    User.findOne({username: username}).then(function(user){//returns user obj with given username
        if (!user || !user.validPassword(password)) {//if user doesn't exist or password doesn't match
            return done(null, flash, {status: 'error', message : 'Username or password is invalid'});
        }
        return done(null, user);
    }).catch(done);
    })
);
/**

const router = express.Router();
router.use(passport.initialize());
router.use(passport.session());

*/