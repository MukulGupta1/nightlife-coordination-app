'use strict';

module.exports = {
    'fbAuth': {
        'clientID': process.env.FACEBOOK_APP_ID,
        'clientSecret': process.env.FACEBOOK_APP_SECRET,
        'callbackURL': process.env.APP_URL + 'auth/facebook/callback'
    }
};
