var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var util = require('util');

// load up the user model
var User       = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ["emails", "displayName"]

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {
            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                console.log('==== FACEBOOK AUTHENTICATION ====');
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err) {
                    console.log('Facebook Authentication Error: '+err);
                    return done(err);
                };

                // if the user is found, then log them in
                if (user) {
                    console.log('User already exists');
                    return done(null, user); // user found, return that user
                } else {
                    console.log('Creating new user...');
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        console.log("Saving user to db...")
                        if (err) {
                            console.log('New User Save Error: '+err);
                            throw err;
                        };

                        // if successful, return the new user
                        console.log('New User Saved Successfully');
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

    },
    function(token, tokenSecret, profile, done) {

        // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function() {

            User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                console.log('==== TWITTER AUTHENTICATION ====');

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err) {
                    console.log('Twitter Authentication Error: '+err);
                    return done(err);
                };

                // if the user is found then log them in
                if (user) {
                    console.log('User already exists');
                    return done(null, user); // user found, return that user
                } else {
                    console.log('Creating new user...');
                    // if there is no user, create them
                    var newUser                 = new User();

                    // set all of the user data that we need
                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    console.log("Saving user to db...")
                    // save our user into the database
                    newUser.save(function(err) {
                        if (err) {
                            console.log('New User Save Error: '+err);
                            throw err;
                        }
                        console.log('New User Saved Successfully');
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

};