var User = require('./user_model.js');
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_KEY,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_REDIRECT_URL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({'provider': 'facebook', 'uid': profile.id}, 
      function(err, user) {
      if (err) { 
        console.log("Passport Error: ", err);
        return done(err); }
      console.log("Facebook Authentication completed successfully")
      done(null, user);
    });
  }
));