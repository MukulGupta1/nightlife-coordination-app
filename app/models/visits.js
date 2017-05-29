'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Visit = new Schema({
  bar_id: String,
  user_id: Number,
  visit_on: Date,
  going: {type: Number, default: 1}
 },
  { versionKey: false }
);

module.exports = mongoose.model('Visit', Visit);
