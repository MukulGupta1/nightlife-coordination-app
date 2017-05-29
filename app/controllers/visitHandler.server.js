'use strict';

var Visits = require('../models/visits.js')
var d = new Date(0);

function VisitHandler(){
  this.addVisit = function(req,res){

    var newVisit = new Visits();
    newVisit.bar_id = req.body.bar_id,
    newVisit.user_id = req.user.fb.id,
    newVisit.visit_on = d.setMilliseconds(Date.now());

    newVisit.save(function(err){
      if (err) throw err;
      res.redirect('/');
    });

  }

}


module.exports = VisitHandler;
