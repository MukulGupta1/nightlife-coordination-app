'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: configAuth.fbAuth.clientID,
        clientSecret: configAuth.fbAuth.clientSecret,
        callbackURL: configAuth.fbAuth.callbackURL,
        profileFields: ['id', 'displayName', 'email']
    },
    function (token, refreshToken, profile, done) {
          process.nextTick(function () {
              User.findOne({ 'fb.id': profile.id }, function (err, user) {
                  if (err) {
                      return done(err);
                  }

                  if (user) {
                      return done(null, user);
                  } else {
                    var newUser = new User();

                    newUser.fb.id = profile.id;
          					newUser.fb.access_token = token;
          					newUser.fb.name = profile.displayName;
          					newUser.fb.email = profile.emails[0].value;

                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });

                  }

              });
          });
      }));

};
