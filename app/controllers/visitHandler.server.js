'use strict';

var Visits = require('../models/visits.js')


function VisitHandler(){

  var dn = new Date(Date.now());
  var cd = dn.getMonth()+ 1 + '/' + dn.getDate() + '/' + dn.getFullYear();
  dn.setDate(dn.getDate() + 1);
  var cnd = dn.getMonth()+1 + '/' + dn.getDate() + '/' + dn.getFullYear();

  this.addVisit = function(req,res){

    var d = new Date(0);
    var newVisit = new Visits();
    newVisit.bar_id = req.body.bar_id,
    newVisit.user_id = req.user.fb.id,
    newVisit.visit_on = d.setMilliseconds(Date.now());

    newVisit.save(function(err){
      if (err) throw err;
      res.redirect('/');
    });
  };

  this.getVisits = function(req, res) {

		Visits
			.count({
        'bar_id': req.params.id,
        'going': 1,
        'visit_on': {'$gte':cd, '$lt':cnd}
      })
			.exec(function(err, result) {
				if (err) {
					throw err;
				}
				res.json(result);
			});
	};

  this.getVisitStatus = function(req, res){

    Visits
      .find({
        'bar_id': req.params.id,
        'user_id': req.user.fb.id,
        'visit_on': {'$gte':cd, '$lt':cnd}
    })
    .exec(function(err, result) {
      if (err) {
        throw err;
      }
      res.json(result);
    });
  };

  this.updateVisitStatus = function(req,res){

    console.log('req.params.id: ' + req.params.id);
    console.log('req.user.fb.id: ' + req.user.fb.id);
    console.log('req.params.visitStatus: ' + req.params.visitStatus);

    Visits
      .findOneAndUpdate(
        {
          'bar_id': req.params.id,
          'user_id':  req.user.fb.id,
          'visit_on': {'$gte':cd, '$lt':cnd}
        },
        {
          $set: {'going': req.params.visitStatus}
        }
      );
  }

}


module.exports = VisitHandler;
