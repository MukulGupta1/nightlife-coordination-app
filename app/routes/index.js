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

  app.route('/api/user')
    .get(function (req, res) {
      if(req.user){
        res.json({
          id: req.user.fb.id,
          access_token: req.user.fb.access_token,
          name: req.user.fb.name,
          email: req.user.fb.email
        });
      }
      else{
        res.json({})
      }
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

  app.route('/api/visits/:id')
		.get(isLoggedIn, visitHandler.getVisits)

  app.route('/api/user/:id/visitStatus')
    .get(isLoggedIn, visitHandler.getVisitStatus)

  app.route('/api/user/:id/visitStatus/:visitStatus')
    .post(isLoggedIn, visitHandler.updateVisitStatus)

};
