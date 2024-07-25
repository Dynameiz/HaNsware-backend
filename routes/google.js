require('dotenv').config();

var express = require('express');
var router = express.Router();
var session = require('express-session');
var jwt = require('jsonwebtoken');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var db = require('./../database/db');

router.use(
    session({
        secret: process.env.API_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/google/auth/google/callback",
        },
        function(accessToken, refreshToken, profile, cb){
            
        }
    )
);

passport.serializeUser(function (user, cb) {
    process.nextTick(function (){
        cb(null, { id: user.id, username: user.username, name: user.name });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ['profile'] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect('/');
    }
);

module.exports = router;