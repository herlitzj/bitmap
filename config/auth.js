// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FACEBOOK_KEY, // your App ID
        'clientSecret'  : process.env.FACEBOOK_SECRET, // your App Secret
        'callbackURL'   : process.env.FACEBOOK_REDIRECT_URL
    },

    'twitterAuth' : {
        'consumerKey'       : process.env.TWITTER_KEY,
        'consumerSecret'    : process.env.TWITTER_SECRET,
        'callbackURL'       : process.env.TWITTER_REDIRECT_URL
    }

};