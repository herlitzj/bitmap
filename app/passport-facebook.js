var User = require('./user_model.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var util = require('util')


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_KEY,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_REDIRECT_URL
  },
  function(accessToken, refreshToken, profile, done) {
    findOrCreateUser = function(){
      console.log("==== Facebook Authentication Started ====");
      User.findOne({'provider': 'facebook', 'uid': profile.id}, function(err, user){
        if (err){
          console.log('Error in Facebook Authentication: '+err);
          return done(err);
        }
        if (user) {
          console.log('User already exists');
          return done(null, false);
        } else {
          var newUser = new User();
          console.log("FACEBOOK PROFILE PAYLOAD: " + util.inspect(profile, false, null));
          console.log("REFRESH TOKEN PAYLOAD: " + util.inspect(refreshToken, false, null));
          console.log("ACCESS TOKEN PAYLOAD: " + util.inspect(accessToken, false, null));
          newUser.provider = 'facebook';
          newUser.uid = profile.id;
          newUser.accessToken = accessToken;
          newUser.refreshToken = refreshToken;

          newUser.save(function(err) {
            if (err){
              console.log('Error saving new user: '+err);
              throw err;
            }
            console.log('User Registration Successfull');
            return done(null, newUser);
          });
        }
      });
    };
  process.nextTick(findOrCreateUser);
  console.log("==== Facebook Authentication Complete ====");
  })
);
