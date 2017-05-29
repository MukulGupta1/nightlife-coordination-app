'use strict';

var path = process.cwd();
var VisitHandler = require(path + '/app/controllers/visitHandler.server.js');

module.exports = function (app, passport) {

  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/facebook');
    }
  }

  var visitHandler = new VisitHandler();

  app.route('/')
    .get(function (req, res) {
        if(req.user){
          res.render(path + '/public/index', {loggedIn: true});
        }
        else{
          res.render(path + '/public/index', {loggedIn: false});
        }
    });

  app.route('/login')
    .get(function (req, res) {
        res.sendFile(path + '/public/login.html');
    });

  app.route('/logout')
    .get(function (req, res) {
        req.logout();
        res.redirect('/');
    });

  app.route('/profile')
    .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/profile.html');
    });

  app.route('/api/:id')
    .get(isLoggedIn, function (req, res) {
        res.json(req.user.fb);
    });

  app.route('/auth/facebook')
    .get(passport.authenticate('facebook', {
      scope: 'email'
    }));

  app.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

  app.route('/addVisit')
    .post(isLoggedIn, visitHandler.addVisit)

};
